// Database Types
export interface User {
  id: string;
  email: string;
  role: 'student' | 'coach';
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Student {
  id: string;
  user_id: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle';
  daily_calories?: number;
  privacy_setting?: 'public' | 'coach_only' | 'private';
  coach_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  user_id: string;
  specialization?: string;
  experience_years?: number;
  bio?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  student_id: string;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  created_at: string;
  updated_at: string;
}

export interface FitnessLog {
  id: string;
  student_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BodyMeasurement {
  id: string;
  student_id: string;
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicep?: number;
  thigh?: number;
  body_fat_percentage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionPlan {
  id: string;
  coach_id: string;
  student_id: string;
  title: string;
  description?: string;
  daily_calories: number;
  protein_ratio: number;
  carbs_ratio: number;
  fat_ratio: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface FitnessProgram {
  id: string;
  coach_id: string;
  student_id: string;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  sessions_per_week: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachRequest {
  id: string;
  student_id: string;
  coach_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  response_message?: string;
  created_at: string;
  updated_at: string;
}

export interface ForumRoom {
  id: string;
  name: string;
  description?: string;
  type: 'general' | 'nutrition' | 'fitness';
  is_active: boolean;
  created_at: string;
}

export interface ForumMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    full_name?: string;
    avatar_url?: string;
    role: 'student' | 'coach';
  };
}

export interface CoachNote {
  id: string;
  coach_id: string;
  student_id: string;
  note: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface AuthError {
  message: string;
  status?: number;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Chart Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  full_name: string;
  role: 'student' | 'coach';
}

export interface MealFormData {
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  role?: 'student' | 'coach';
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: AuthError;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}