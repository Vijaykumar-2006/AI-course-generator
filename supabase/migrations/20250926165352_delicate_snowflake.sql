/*
  # Create CourseAI Database Schema

  1. New Tables
    - `trainers`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `organization` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, foreign key to trainers)
      - `title` (text)
      - `description` (text, optional)
      - `topic` (text)
      - `language` (text, default 'en')
      - `tone` (text, default 'professional')
      - `difficulty_level` (text, default 'intermediate')
      - `estimated_duration` (integer, minutes)
      - `outline` (jsonb)
      - `status` (enum: draft, published, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `content` (text)
      - `order_index` (integer)
      - `duration` (integer, minutes)
      - `learning_objectives` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key to lessons)
      - `title` (text)
      - `questions` (jsonb)
      - `passing_score` (integer, percentage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `analytics`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, foreign key to trainers)
      - `course_id` (uuid, foreign key to courses)
      - `metric_type` (text)
      - `metric_value` (numeric)
      - `recorded_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Trainers can only access their own courses and related data

  3. Indexes
    - Performance indexes on frequently queried columns
    - Composite indexes for common query patterns
*/

-- Create custom types
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');

-- Trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  organization text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  topic text NOT NULL,
  language text DEFAULT 'en',
  tone text DEFAULT 'professional',
  difficulty_level text DEFAULT 'intermediate',
  estimated_duration integer DEFAULT 0,
  outline jsonb DEFAULT '{}',
  status course_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  duration integer DEFAULT 0,
  learning_objectives text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]',
  passing_score integer DEFAULT 70,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Trainers policies
CREATE POLICY "Trainers can view own profile"
  ON trainers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Trainers can update own profile"
  ON trainers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Trainers can insert own profile"
  ON trainers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Courses policies
CREATE POLICY "Trainers can view own courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (trainer_id = auth.uid());

CREATE POLICY "Trainers can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (trainer_id = auth.uid());

CREATE POLICY "Trainers can update own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (trainer_id = auth.uid());

CREATE POLICY "Trainers can delete own courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING (trainer_id = auth.uid());

-- Lessons policies
CREATE POLICY "Trainers can view lessons from own courses"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can create lessons for own courses"
  ON lessons
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can update lessons from own courses"
  ON lessons
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can delete lessons from own courses"
  ON lessons
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.trainer_id = auth.uid()
  ));

-- Quizzes policies
CREATE POLICY "Trainers can view quizzes from own lessons"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lessons 
    JOIN courses ON lessons.course_id = courses.id 
    WHERE lessons.id = quizzes.lesson_id AND courses.trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can create quizzes for own lessons"
  ON quizzes
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM lessons 
    JOIN courses ON lessons.course_id = courses.id 
    WHERE lessons.id = quizzes.lesson_id AND courses.trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can update quizzes from own lessons"
  ON quizzes
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lessons 
    JOIN courses ON lessons.course_id = courses.id 
    WHERE lessons.id = quizzes.lesson_id AND courses.trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can delete quizzes from own lessons"
  ON quizzes
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lessons 
    JOIN courses ON lessons.course_id = courses.id 
    WHERE lessons.id = quizzes.lesson_id AND courses.trainer_id = auth.uid()
  ));

-- Analytics policies
CREATE POLICY "Trainers can view own analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (trainer_id = auth.uid());

CREATE POLICY "Trainers can insert own analytics"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (trainer_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_trainer_id ON courses(trainer_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_analytics_trainer_id ON analytics(trainer_id);
CREATE INDEX IF NOT EXISTS idx_analytics_course_id ON analytics(course_id);
CREATE INDEX IF NOT EXISTS idx_analytics_recorded_at ON analytics(recorded_at);

-- Functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();