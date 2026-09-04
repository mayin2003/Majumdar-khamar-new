import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInAdmin, 
  signOutAdmin, 
  getCurrentAdminUser, 
  onAdminAuthStateChange, 
  isUserAuthorizedAdmin,
  AdminAuthUser
} from '../services/authService';

interface AuthContextType {
  user: AdminAuthUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch initial Supabase session
    getCurrentAdminUser()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Initial admin auth check notice:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    // Real Supabase Auth listener
    const unsubscribe = onAdminAuthStateChange((_event, _session, authUser) => {
      if (isMounted) {
        setUser(authUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const loggedUser = await signInAdmin(email, pass);
      setUser(loggedUser);
    } catch (err: any) {
      const msg = err.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOutAdmin();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  const isAuthorized = !!user && isUserAuthorizedAdmin(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAuthorized,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
