import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    organization: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 🔹 Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Sign In
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }

    const user = data.user;

    // ✅ Ensure trainer profile exists (for email confirmation ON)
    const { data: existing } = await supabase
      .from('trainers')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existing) {
      const { error: profileError } = await supabase.from('trainers').insert([
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          organization: user.user_metadata?.organization || '',
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create trainer profile.');
      }
    }
  };

  // 🔹 Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    organization: string
  ) => {
    try {
      // Step 1: Create user with redirect URL
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            'https://arron-stereotomical-sympathisingly.ngrok-free.dev/auth/callback',
          data: {
            full_name: fullName,
            organization: organization,
          },
        },
      });

      if (error) {
        console.error('Supabase sign up error:', error);
        throw new Error(error.message || 'Failed to create account');
      }

      // Step 2: Wait for session (if email confirmation is OFF)
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session;

      if (!currentSession) {
        console.warn(
          'No active session after signup. User may need to confirm email.'
        );
        alert(
          'Account created! Please check your email and confirm before logging in.'
        );
        return;
      }

      const user = currentSession.user;

      // Step 3: Create trainer profile (authenticated session)
      const { error: profileError } = await supabase.from('trainers').insert([
        {
          id: user.id,
          email,
          full_name: fullName,
          organization,
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(
          'Account created but failed to create profile. Please contact support.'
        );
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      throw new Error(
        err.message ||
          'Unable to connect to the authentication service. Please check your configuration and try again.'
      );
    }
  };

  // 🔹 Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
