'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ForumRoom, ForumMessage } from '@/lib/types';

export function useForum() {
  const [rooms, setRooms] = useState<ForumRoom[]>([]);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('forum_rooms')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setRooms(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [supabase]);

  const subscribeToRoom = (roomId: string) => {
    // Subscribe to real-time messages
    const subscription = supabase
      .channel(`forum:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ForumMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_messages')
        .select(`
          *,
          users!inner(
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const sendMessage = async (roomId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi gerekli');

      const { data, error } = await supabase
        .from('forum_messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          content: content.trim(),
        })
        .select(`
          *,
          users!inner(
            full_name,
            avatar_url,
            role
          )
        `)
        .single();

      if (error) throw error;
      
      // Add to local state
      setMessages((prev) => [...prev, data]);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    rooms,
    messages,
    loading,
    error,
    subscribeToRoom,
    fetchMessages,
    sendMessage,
  };
}