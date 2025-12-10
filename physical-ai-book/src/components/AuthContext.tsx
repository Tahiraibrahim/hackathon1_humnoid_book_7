import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name?: string;
  software_background?: string;
  hardware_background?: string;
}

// ✅ Interface mein isAuthenticated wapis add kar diya
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean; // Ye line missing thi
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const AUTH_URL = "http://localhost:4000";

  useEffect(() => {
    const storedUser = localStorage.getItem('hackathon_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${AUTH_URL}/api/auth/sign-in/email`, {
        email,
        password
      });
      
      const userData = res.data.user || { email, id: "test-user-id" };
      
      setUser(userData);
      localStorage.setItem('hackathon_user', JSON.stringify(userData));
      setShowModal(false);
      alert("Login Successful! 🔓");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console.");
    }
  };

  const signup = async (data: any) => {
    try {
      await axios.post(`${AUTH_URL}/api/auth/sign-up/email`, {
        email: data.email,
        password: data.password,
        name: data.name,
        software_background: data.software_background,
        hardware_background: data.hardware_background
      });
      alert("Account created! Please Login now.");
    } catch (error) {
      console.error("Signup failed", error);
      alert("Signup failed. Email might already exist.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hackathon_user');
    alert("Logged out 👋");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, // ✅ Ye logic add kar di (Agar user hai to true, nahi to false)
      loading, 
      login, 
      signup, 
      logout, 
      showModal, 
      setShowModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};