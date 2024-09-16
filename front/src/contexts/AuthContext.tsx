import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signin: (username: string, password: string) => Promise<void>;
  signout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement de l'application
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      localStorage.removeItem('token');
    }
  };

  const signin = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/signin', { username, password });
      localStorage.setItem('token', response.data.access_token);
      setUser({ username: response.data.username, email: response.data.email });
    } catch (error) {
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/auth/update', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to update user', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, updateUser }}>
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