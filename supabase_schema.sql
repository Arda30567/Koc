-- ============================================
-- FITNESS COACH APP - SUPABASE SCHEMA
-- Production-Ready PostgreSQL Database
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'coach')),
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    age INTEGER CHECK (age >= 13 AND age <= 100),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    height DECIMAL(5,2) CHECK (height >= 100 AND height <= 250),
    weight DECIMAL(5,2) CHECK (weight >= 30 AND weight <= 300),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    goal TEXT CHECK (goal IN ('lose_weight', 'gain_weight', 'maintain', 'build_muscle')),
    daily_calories INTEGER CHECK (daily_calories >= 800 AND daily_calories <= 5000),
    privacy_setting TEXT NOT NULL DEFAULT 'coach_only' CHECK (privacy_setting IN ('public', 'coach_only', 'private')),
    coach_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Coaches table
CREATE TABLE IF NOT EXISTS public.coaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    specialization TEXT,
    experience_years INTEGER CHECK (experience_years >= 0 AND experience_years <= 50),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    date DATE NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein DECIMAL(6,2) NOT NULL CHECK (protein >= 0),
    carbs DECIMAL(6,2) NOT NULL CHECK (carbs >= 0),
    fat DECIMAL(6,2) NOT NULL CHECK (fat >= 0),
    fiber DECIMAL(6,2),
    sugar DECIMAL(6,2),
    sodium DECIMAL(6,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness logs table
CREATE TABLE IF NOT EXISTS public.fitness_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    sets INTEGER NOT NULL CHECK (sets >= 1),
    reps INTEGER NOT NULL CHECK (reps >= 1),
    weight DECIMAL(6,2),
    duration INTEGER,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Body measurements table
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    chest DECIMAL(5,2),
    waist DECIMAL(5,2),
    hips DECIMAL(5,2),
    bicep DECIMAL(5,2),
    thigh DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutrition plans table
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    daily_calories INTEGER NOT NULL CHECK (daily_calories >= 800 AND daily_calories <= 5000),
    protein_ratio DECIMAL(4,2) NOT NULL CHECK (protein_ratio >= 0.1 AND protein_ratio <= 0.5),
    carbs_ratio DECIMAL(4,2) NOT NULL CHECK (carbs_ratio >= 0.2 AND carbs_ratio <= 0.7),
    fat_ratio DECIMAL(4,2) NOT NULL CHECK (fat_ratio >= 0.1 AND fat_ratio <= 0.4),
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fitness programs table
CREATE TABLE IF NOT EXISTS public.fitness_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INTEGER NOT NULL CHECK (duration_weeks >= 1 AND duration_weeks <= 52),
    sessions_per_week INTEGER NOT NULL CHECK (sessions_per_week >= 1 AND sessions_per_week <= 7),
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach requests table
CREATE TABLE IF NOT EXISTS public.coach_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    message TEXT,
    response_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum rooms table
CREATE TABLE IF NOT EXISTS public.forum_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('general', 'nutrition', 'fitness')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum messages table
CREATE TABLE IF NOT EXISTS public.forum_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.forum_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach notes table
CREATE TABLE IF NOT EXISTS public.coach_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_coach_id ON public.students(coach_id);
CREATE INDEX IF NOT EXISTS idx_students_privacy ON public.students(privacy_setting);

-- Coaches indexes
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_verified ON public.coaches(is_verified);

-- Meals indexes
CREATE INDEX IF NOT EXISTS idx_meals_student_id ON public.meals(student_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(date);
CREATE INDEX IF NOT EXISTS idx_meals_type ON public.meals(meal_type);

-- Fitness logs indexes
CREATE INDEX IF NOT EXISTS idx_fitness_logs_student_id ON public.fitness_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_fitness_logs_date ON public.fitness_logs(date);

-- Body measurements indexes
CREATE INDEX IF NOT EXISTS idx_measurements_student_id ON public.body_measurements(student_id);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON public.body_measurements(date);

-- Nutrition plans indexes
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_coach_id ON public.nutrition_plans(coach_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_student_id ON public.nutrition_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_active ON public.nutrition_plans(is_active);

-- Fitness programs indexes
CREATE INDEX IF NOT EXISTS idx_fitness_programs_coach_id ON public.fitness_programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_fitness_programs_student_id ON public.fitness_programs(student_id);
CREATE INDEX IF NOT EXISTS idx_fitness_programs_active ON public.fitness_programs(is_active);

-- Coach requests indexes
CREATE INDEX IF NOT EXISTS idx_coach_requests_student_id ON public.coach_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_coach_requests_coach_id ON public.coach_requests(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_requests_status ON public.coach_requests(status);

-- Forum indexes
CREATE INDEX IF NOT EXISTS idx_forum_messages_room_id ON public.forum_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_forum_messages_user_id ON public.forum_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_messages_created ON public.forum_messages(created_at);

-- Coach notes indexes
CREATE INDEX IF NOT EXISTS idx_coach_notes_coach_id ON public.coach_notes(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_notes_student_id ON public.coach_notes(student_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Only admins can insert users" ON public.users FOR INSERT WITH CHECK (false);
CREATE POLICY "Only admins can delete users" ON public.users FOR DELETE USING (false);

-- Students policies
CREATE POLICY "Students can view own data" ON public.students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can update own data" ON public.students FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Coaches can view their students" ON public.students FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.coaches WHERE id = coach_id)
);
CREATE POLICY "Students can insert own data" ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coaches policies
CREATE POLICY "Coaches can view all coaches" ON public.coaches FOR SELECT USING (true);
CREATE POLICY "Coaches can update own data" ON public.coaches FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'coach')
);
CREATE POLICY "Coaches can insert own data" ON public.coaches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Students can view own meals" ON public.meals FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own meals" ON public.meals FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students can delete own meals" ON public.meals FOR DELETE USING (auth.uid() = student_id);
CREATE POLICY "Coaches can view student meals" ON public.meals FOR SELECT USING (
  auth.uid() IN (SELECT coach_id FROM public.students WHERE user_id = student_id)
);

-- Fitness logs policies
CREATE POLICY "Students can view own logs" ON public.fitness_logs FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own logs" ON public.fitness_logs FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own logs" ON public.fitness_logs FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students can delete own logs" ON public.fitness_logs FOR DELETE USING (auth.uid() = student_id);
CREATE POLICY "Coaches can view student logs" ON public.fitness_logs FOR SELECT USING (
  auth.uid() IN (SELECT coach_id FROM public.students WHERE user_id = student_id)
);

-- Body measurements policies
CREATE POLICY "Students can view own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students can delete own measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = student_id);
CREATE POLICY "Coaches can view student measurements" ON public.body_measurements FOR SELECT USING (
  auth.uid() IN (SELECT coach_id FROM public.students WHERE user_id = student_id)
);

-- Nutrition plans policies
CREATE POLICY "Coaches can manage own plans" ON public.nutrition_plans FOR ALL USING (auth.uid() = coach_id);
CREATE POLICY "Students can view own plans" ON public.nutrition_plans FOR SELECT USING (auth.uid() = student_id);

-- Fitness programs policies
CREATE POLICY "Coaches can manage own programs" ON public.fitness_programs FOR ALL USING (auth.uid() = coach_id);
CREATE POLICY "Students can view own programs" ON public.fitness_programs FOR SELECT USING (auth.uid() = student_id);

-- Coach requests policies
CREATE POLICY "Students can create requests" ON public.coach_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can view own requests" ON public.coach_requests FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Coaches can view requests" ON public.coach_requests FOR SELECT USING (
  coach_id IS NULL OR coach_id = auth.uid()
);
CREATE POLICY "Coaches can update requests" ON public.coach_requests FOR UPDATE USING (
  coach_id = auth.uid() OR EXISTS (SELECT 1 FROM public.coaches WHERE user_id = auth.uid())
);

-- Forum rooms policies (public read)
CREATE POLICY "Anyone can view forum rooms" ON public.forum_rooms FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage forum rooms" ON public.forum_rooms FOR ALL USING (false);

-- Forum messages policies
CREATE POLICY "Anyone can view messages" ON public.forum_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post messages" ON public.forum_messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.forum_rooms WHERE id = room_id AND is_active = true
  )
);
CREATE POLICY "Users can delete own messages" ON public.forum_messages FOR DELETE USING (auth.uid() = user_id);

-- Coach notes policies
CREATE POLICY "Coaches can manage own notes" ON public.coach_notes FOR ALL USING (auth.uid() = coach_id);
CREATE POLICY "Students can view public notes" ON public.coach_notes FOR SELECT USING (
  student_id = auth.uid() AND is_private = false
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON public.coaches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_logs_updated_at BEFORE UPDATE ON public.fitness_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_body_measurements_updated_at BEFORE UPDATE ON public.body_measurements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_plans_updated_at BEFORE UPDATE ON public.nutrition_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_programs_updated_at BEFORE UPDATE ON public.fitness_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_requests_updated_at BEFORE UPDATE ON public.coach_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_notes_updated_at BEFORE UPDATE ON public.coach_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, full_name, is_active)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'role',
        NEW.raw_user_meta_data->>'full_name',
        TRUE
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default forum rooms
INSERT INTO public.forum_rooms (name, description, type, is_active) VALUES
    ('Genel Sohbet', 'Her konuda serbest sohbet alanı', 'general', true),
    ('Beslenme ve Diyet', 'Beslenme ipuçları, tarifler ve diyet tartışmaları', 'nutrition', true),
    ('Fitness ve Egzersiz', 'Egzersiz programları, teknikler ve motivasyon', 'fitness', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calculate daily calorie totals for a student
CREATE OR REPLACE FUNCTION get_daily_calories(
    p_student_id UUID,
    p_date DATE
) RETURNS TABLE (
    total_calories INTEGER,
    total_protein DECIMAL,
    total_carbs DECIMAL,
    total_fat DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(SUM(protein), 0) as total_protein,
        COALESCE(SUM(carbs), 0) as total_carbs,
        COALESCE(SUM(fat), 0) as total_fat
    FROM public.meals
    WHERE student_id = p_student_id AND date = p_date;
END;
$$ LANGUAGE plpgsql;

-- Get student progress (weight change over time)
CREATE OR REPLACE FUNCTION get_student_progress(
    p_student_id UUID,
    p_days INTEGER DEFAULT 30
) RETURNS TABLE (
    date DATE,
    weight DECIMAL,
    change_from_start DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bm.date,
        bm.weight,
        bm.weight - FIRST_VALUE(bm.weight) OVER (ORDER BY bm.date) as change_from_start
    FROM public.body_measurements bm
    WHERE bm.student_id = p_student_id
        AND bm.date >= CURRENT_DATE - INTERVAL '1 day' * p_days
    ORDER BY bm.date;
END;
$$ LANGUAGE plpgsql;

-- Count active students for a coach
CREATE OR REPLACE FUNCTION count_coach_students(
    p_coach_id UUID
) RETURNS INTEGER AS $$
DECLARE
    student_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO student_count
    FROM public.students
    WHERE coach_id = p_coach_id;
    
    RETURN student_count;
END;
$$ LANGUAGE plpgsql;