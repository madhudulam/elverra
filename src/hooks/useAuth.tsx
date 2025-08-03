import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<void>;
  checkUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkUserRole = async () => {
    if (!user) {
      setUserRole(null);
      setIsAdmin(false);
      return;
    }

    try {
      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!error && roleData) {
        setUserRole('admin');
        setIsAdmin(true);
      } else {
        // Check other roles or default to user
        const { data: allRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (allRoles && allRoles.length > 0) {
          setUserRole(allRoles[0].role);
          setIsAdmin(allRoles[0].role === 'admin');
        } else {
          setUserRole('user');
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole('user');
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        // Check user role after sign in
        setTimeout(() => {
          checkUserRole();
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user]);

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      // Check if user is admin and redirect accordingly
      setTimeout(async () => {
        try {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .single();

          if (roleData) {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          navigate('/dashboard');
        }
      }, 500);
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setIsAdmin(false);
      navigate('/');
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    isAdmin,
    signUp,
    signIn,
    signOut,
    checkUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};