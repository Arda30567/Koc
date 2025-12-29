'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useForum } from '@/lib/hooks/useForum';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MessageCircle, Send, Users, Lock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function ForumPage() {
  const { user } = useAuth();
  const { rooms, messages, loading, error, subscribeToRoom, fetchMessages, sendMessage } = useForum();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(rooms[0].id);
    }
  }, [rooms, selectedRoom]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom);
      const unsubscribe = subscribeToRoom(selectedRoom);
      return unsubscribe;
    }
  }, [selectedRoom, fetchMessages, subscribeToRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;
    
    setIsSending(true);
    const result = await sendMessage(selectedRoom, newMessage);
    setIsSending(false);
    
    if (!result.error) {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const roomMessages = messages.filter(msg => msg.room_id === selectedRoom);
  const selectedRoomData = rooms.find(r => r.id === selectedRoom);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir hata oluştu</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Forum</h1>
        <p className="mt-1 text-sm text-gray-600">
          Diğer kullanıcılarla deneyimlerinizi paylaşın
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
        {/* Rooms List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Sohbet Odaları</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {rooms.map((room) => {
                  const isSelected = selectedRoom === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-primary-50 border-r-2 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${
                            isSelected ? 'text-primary-900' : 'text-gray-900'
                          }`}>
                            {room.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {room.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span className="text-xs">{/* Active users count */}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          {selectedRoomData ? (
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedRoomData.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRoomData.description}
                    </p>
                  </div>
                  {!user && (
                    <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Misafir modu</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {roomMessages.length > 0 ? (
                    roomMessages.map((message) => {
                      const isOwnMessage = user?.id === message.user_id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary-600 text-white'
                                : user
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-gray-100 text-gray-500 blur-sm'
                            }`}
                          >
                            {!isOwnMessage && user && (
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-medium">
                                  {message.user.full_name || 'Anonim'}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  message.user.role === 'coach'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {message.user.role === 'coach' ? 'Koç' : 'Öğrenci'}
                                </span>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          Bu odada henüz mesaj yok
                        </p>
                        {!user && (
                          <p className="text-sm text-gray-400 mt-2">
                            Mesajları görmek için giriş yapın
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {user ? (
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Mesajınızı yazın..."
                          className="form-input resize-none"
                          rows={2}
                          disabled={isSending}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="flex items-center space-x-2"
                      >
                        {isSending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Göndermek için Enter tuşuna basın
                    </p>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 p-4 text-center">
                    <p className="text-gray-500 mb-3">
                      Mesaj göndermek için giriş yapın
                    </p>
                    <div className="flex justify-center space-x-3">
                      <a
                        href="/login"
                        className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Giriş Yap
                      </a>
                      <a
                        href="/register"
                        className="btn-outline px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Kayıt Ol
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Bir sohbet odası seçin</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}