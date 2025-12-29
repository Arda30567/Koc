'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Student, CoachRequest, CoachNote, NutritionPlan, FitnessProgram } from '@/lib/types';

export function useCoachData(coachId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [requests, setRequests] = useState<CoachRequest[]>([]);
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [fitnessPrograms, setFitnessPrograms] = useState<FitnessProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    if (!coachId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch coach's students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select(`*, users!inner(*)`)
          .eq('coach_id', coachId)
          .eq('users.is_active', true);

        if (studentsError) throw studentsError;
        setStudents(studentsData || []);

        // Fetch pending requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('coach_requests')
          .select(`*, users!inner(*)`)
          .is('coach_id', null)
          .or(`coach_id.eq.${coachId}`)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (requestsError) throw requestsError;
        setRequests(requestsData || []);

        // Fetch nutrition plans
        const { data: nutritionData, error: nutritionError } = await supabase
          .from('nutrition_plans')
          .select(`*, users!inner(*)`)
          .eq('coach_id', coachId)
          .order('created_at', { ascending: false });

        if (nutritionError) throw nutritionError;
        setNutritionPlans(nutritionData || []);

        // Fetch fitness programs
        const { data: fitnessData, error: fitnessError } = await supabase
          .from('fitness_programs')
          .select(`*, users!inner(*)`)
          .eq('coach_id', coachId)
          .order('created_at', { ascending: false });

        if (fitnessError) throw fitnessError;
        setFitnessPrograms(fitnessData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coachId, supabase]);

  const acceptRequest = async (requestId: string, studentId: string) => {
    try {
      const { error } = await supabase
        .from('coach_requests')
        .update({
          status: 'accepted',
          coach_id: coachId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update student's coach_id
      const { error: studentError } = await supabase
        .from('students')
        .update({ coach_id: coachId })
        .eq('user_id', studentId);

      if (studentError) throw studentError;

      // Remove from requests list
      setRequests(requests.filter(r => r.id !== requestId));
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const rejectRequest = async (requestId: string, responseMessage?: string) => {
    try {
      const { error } = await supabase
        .from('coach_requests')
        .update({
          status: 'rejected',
          response_message: responseMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Remove from requests list
      setRequests(requests.filter(r => r.id !== requestId));
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const addNote = async (studentId: string, note: string, isPrivate: boolean = true) => {
    try {
      const { data, error } = await supabase
        .from('coach_notes')
        .insert({
          coach_id: coachId,
          student_id: studentId,
          note,
          is_private: isPrivate,
        })
        .select()
        .single();

      if (error) throw error;
      
      setNotes([data, ...notes]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const createNutritionPlan = async (plan: Omit<NutritionPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .insert(plan)
        .select()
        .single();

      if (error) throw error;
      
      setNutritionPlans([data, ...nutritionPlans]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const createFitnessProgram = async (program: Omit<FitnessProgram, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fitness_programs')
        .insert(program)
        .select()
        .single();

      if (error) throw error;
      
      setFitnessPrograms([data, ...fitnessPrograms]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    students,
    requests,
    notes,
    nutritionPlans,
    fitnessPrograms,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    addNote,
    createNutritionPlan,
    createFitnessProgram,
  };
}