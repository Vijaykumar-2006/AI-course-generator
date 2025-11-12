import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref') || supabaseKey.includes('your-anon-key')) {
  console.error('Supabase configuration error:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseKey ? 'Set' : 'Missing'
  });
  throw new Error(
    'Supabase environment variables are not properly configured. ' +
    'Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file with your actual Supabase project credentials. ' +
    'You can find these in your Supabase project dashboard under Settings > API.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      trainers: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          organization: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          organization?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          organization?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          trainer_id: string;
          title: string;
          description: string;
          topic: string;
          language: string;
          tone: string;
          difficulty_level: string;
          estimated_duration: number;
          outline: any;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          title: string;
          description?: string;
          topic: string;
          language?: string;
          tone?: string;
          difficulty_level?: string;
          estimated_duration?: number;
          outline?: any;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          title?: string;
          description?: string;
          topic?: string;
          language?: string;
          tone?: string;
          difficulty_level?: string;
          estimated_duration?: number;
          outline?: any;
          status?: 'draft' | 'published' | 'archived';
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content: string;
          order_index: number;
          duration: number;
          learning_objectives: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          content: string;
          order_index: number;
          duration?: number;
          learning_objectives?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          content?: string;
          order_index?: number;
          duration?: number;
          learning_objectives?: string[];
          updated_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          questions: any;
          passing_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          questions: any;
          passing_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          title?: string;
          questions?: any;
          passing_score?: number;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          trainer_id: string;
          course_id: string;
          metric_type: string;
          metric_value: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          trainer_id: string;
          course_id: string;
          metric_type: string;
          metric_value: number;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          trainer_id?: string;
          course_id?: string;
          metric_type?: string;
          metric_value?: number;
          recorded_at?: string;
        };
      };
    };
  };
};