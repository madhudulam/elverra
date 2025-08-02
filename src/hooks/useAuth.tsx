
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  checkUserRole: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      initialLoadRef.current = false;
      if (session?.user) {
        checkUserRole();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'User:', session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          checkUserRole();
        } else {
          setUserRole(null);
          setIsAdmin(false);
        }

        // Only redirect on successful sign in from login page
        if (event === 'SIGNED_IN' && session?.user && window.location.pathname === '/login') {
          console.log('User signed in, redirecting to dashboard...');
          setTimeout(() => {
            // Check if user has completed membership payment
            checkMembershipStatus(session.user.id);
          }, 100);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (): Promise<string> => {
    try {
      if (!user) {
        setUserRole(null);
        setIsAdmin(false);
        return 'user';
      }

      const { data, error } = await supabase.rpc('get_user_role');
      if (error) throw error;
      
      const role = data || 'user';
      setUserRole(role);
      setIsAdmin(role === 'admin');
      return role;
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole('user');
      setIsAdmin(false);
      return 'user';
    }
  };

  const checkMembershipStatus = async (userId: string) => {
    try {
      const { data: membership } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (membership) {
        // If table doesn't exist or no membership found, user needs to select a plan
        console.warn('No active membership found:', error);
        window.location.href = '/dashboard';
      } else {
        // User needs to select membership plan
        window.location.href = '/membership-payment';
      }
    } catch (error) {
      console.warn('Error checking membership status, assuming no membership:', error);
      window.location.href = '/membership-payment';
    }
  };

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
    setUserRole(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    loading,
    userRole,
    isAdmin,
    signUp,
    signIn,
    signOut,
    checkUserRole
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
