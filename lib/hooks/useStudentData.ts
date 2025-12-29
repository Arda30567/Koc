'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Meal, FitnessLog, BodyMeasurement, Student } from '@/lib/types';

export function useStudentData(studentId: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [fitnessLogs, setFitnessLogs] = useState<FitnessLog[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    if (!studentId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch student profile
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', studentId)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);

        // Fetch meals
        const { data: mealsData, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .eq('student_id', studentId)
          .order('date', { ascending: false })
          .limit(100);

        if (mealsError) throw mealsError;
        setMeals(mealsData || []);

        // Fetch fitness logs
        const { data: fitnessData, error: fitnessError } = await supabase
          .from('fitness_logs')
          .select('*')
          .eq('student_id', studentId)
          .order('date', { ascending: false })
          .limit(100);

        if (fitnessError) throw fitnessError;
        setFitnessLogs(fitnessData || []);

        // Fetch measurements
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('body_measurements')
          .select('*')
          .eq('student_id', studentId)
          .order('date', { ascending: false })
          .limit(50);

        if (measurementsError) throw measurementsError;
        setMeasurements(measurementsData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, supabase]);

  const addMeal = async (meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert(meal)
        .select()
        .single();

      if (error) throw error;
      setMeals([data, ...meals]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const addFitnessLog = async (log: Omit<FitnessLog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fitness_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      setFitnessLogs([data, ...fitnessLogs]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const addMeasurement = async (measurement: Omit<BodyMeasurement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('body_measurements')
        .insert(measurement)
        .select()
        .single();

      if (error) throw error;
      setMeasurements([data, ...measurements]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateStudent = async (updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('user_id', studentId)
        .select()
        .single();

      if (error) throw error;
      setStudent(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Calculate daily totals
  const getDailyTotals = (date: string) => {
    const dayMeals = meals.filter(meal => meal.date === date);
    return {
      calories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: dayMeals.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: dayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: dayMeals.reduce((sum, meal) => sum + meal.fat, 0),
    };
  };

  return {
    student,
    meals,
    fitnessLogs,
    measurements,
    loading,
    error,
    addMeal,
    addFitnessLog,
    addMeasurement,
    updateStudent,
    getDailyTotals,
  };
}