
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      initialLoadRef.current = false;
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'User:', session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only redirect on successful sign in from login page
        if (event === 'SIGNED_IN' && session?.user && window.location.pathname === '/login') {
          console.log('User signed in, redirecting to dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 100);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('Attempting to sign in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Sign in result:', { success: !error, error: error?.message });

    // If login successful, ensure user has a profile
    if (data.user && !error) {
      try {
        // Check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        // If no profile exists, create one
        if (profileError && profileError.code === 'PGRST116') {
          console.log('Creating profile for user:', data.user.id);
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
              phone: data.user.user_metadata?.phone || null
            });
        }
      } catch (profileCreationError) {
        console.error('Error ensuring profile exists:', profileCreationError);
        // Don't fail the login if profile creation fails
      }
    }

    if (error) {
      setLoading(false);
    }
    // Note: Don't set loading to false here if successful, let the auth state change handle it

    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
