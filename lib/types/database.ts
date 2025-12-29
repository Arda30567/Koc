export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'student' | 'coach';
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role: 'student' | 'coach';
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'student' | 'coach';
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          age: number | null;
          gender: 'male' | 'female' | 'other' | null;
          height: number | null;
          weight: number | null;
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
          goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle' | null;
          daily_calories: number | null;
          privacy_setting: 'public' | 'coach_only' | 'private';
          coach_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age?: number | null;
          gender?: 'male' | 'female' | 'other' | null;
          height?: number | null;
          weight?: number | null;
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
          goal?: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle' | null;
          daily_calories?: number | null;
          privacy_setting?: 'public' | 'coach_only' | 'private';
          coach_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number | null;
          gender?: 'male' | 'female' | 'other' | null;
          height?: number | null;
          weight?: number | null;
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
          goal?: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle' | null;
          daily_calories?: number | null;
          privacy_setting?: 'public' | 'coach_only' | 'private';
          coach_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      coaches: {
        Row: {
          id: string;
          user_id: string;
          specialization: string | null;
          experience_years: number | null;
          bio: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          specialization?: string | null;
          experience_years?: number | null;
          bio?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          specialization?: string | null;
          experience_years?: number | null;
          bio?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          student_id: string;
          name: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          date: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          fiber: number | null;
          sugar: number | null;
          sodium: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          name: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          date: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          fiber?: number | null;
          sugar?: number | null;
          sodium?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          name?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          date?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          fiber?: number | null;
          sugar?: number | null;
          sodium?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fitness_logs: {
        Row: {
          id: string;
          student_id: string;
          exercise_name: string;
          sets: number;
          reps: number;
          weight: number | null;
          duration: number | null;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          exercise_name: string;
          sets: number;
          reps: number;
          weight?: number | null;
          duration?: number | null;
          date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          exercise_name?: string;
          sets?: number;
          reps?: number;
          weight?: number | null;
          duration?: number | null;
          date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      body_measurements: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          weight: number;
          chest: number | null;
          waist: number | null;
          hips: number | null;
          bicep: number | null;
          thigh: number | null;
          body_fat_percentage: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          weight: number;
          chest?: number | null;
          waist?: number | null;
          hips?: number | null;
          bicep?: number | null;
          thigh?: number | null;
          body_fat_percentage?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          date?: string;
          weight?: number;
          chest?: number | null;
          waist?: number | null;
          hips?: number | null;
          bicep?: number | null;
          thigh?: number | null;
          body_fat_percentage?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nutrition_plans: {
        Row: {
          id: string;
          coach_id: string;
          student_id: string;
          title: string;
          description: string | null;
          daily_calories: number;
          protein_ratio: number;
          carbs_ratio: number;
          fat_ratio: number;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          student_id: string;
          title: string;
          description?: string | null;
          daily_calories: number;
          protein_ratio: number;
          carbs_ratio: number;
          fat_ratio: number;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          student_id?: string;
          title?: string;
          description?: string | null;
          daily_calories?: number;
          protein_ratio?: number;
          carbs_ratio?: number;
          fat_ratio?: number;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fitness_programs: {
        Row: {
          id: string;
          coach_id: string;
          student_id: string;
          title: string;
          description: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          duration_weeks: number;
          sessions_per_week: number;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          student_id: string;
          title: string;
          description?: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          duration_weeks: number;
          sessions_per_week: number;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          student_id?: string;
          title?: string;
          description?: string | null;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          duration_weeks?: number;
          sessions_per_week?: number;
          is_active?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      coach_requests: {
        Row: {
          id: string;
          student_id: string;
          coach_id: string | null;
          status: 'pending' | 'accepted' | 'rejected';
          message: string | null;
          response_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          coach_id?: string | null;
          status?: 'pending' | 'accepted' | 'rejected';
          message?: string | null;
          response_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          coach_id?: string | null;
          status?: 'pending' | 'accepted' | 'rejected';
          message?: string | null;
          response_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_rooms: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: 'general' | 'nutrition' | 'fitness';
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type: 'general' | 'nutrition' | 'fitness';
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: 'general' | 'nutrition' | 'fitness';
          is_active?: boolean;
          created_at?: string;
        };
      };
      forum_messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      coach_notes: {
        Row: {
          id: string;
          coach_id: string;
          student_id: string;
          note: string;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          student_id: string;
          note: string;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          student_id?: string;
          note?: string;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}