
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  forgotPassword: async () => false,
  loading: true,
});

// Mock API for authentication (in a real app, this would be a server call)
const mockAuth = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email ending with @test.com and password "password"
    if (email.endsWith('@test.com') && password === 'password') {
      return {
        id: '1',
        name: email.split('@')[0],
        email
      };
    }
    return null;
  },
  
  register: async (name: string, email: string, password: string): Promise<User | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any registration
    return {
      id: '1',
      name,
      email
    };
  },

  forgotPassword: async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always return success
    return true;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await mockAuth.login(email, password);
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const user = await mockAuth.register(name, email, password);
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Registration successful",
          description: `Welcome, ${user.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: "Could not register. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const success = await mockAuth.forgotPassword(email);
      if (success) {
        toast({
          title: "Password reset link sent",
          description: `A password reset link has been sent to ${email}.`,
        });
        return true;
      } else {
        toast({
          title: "Request failed",
          description: "Could not process your request. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Request error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);
