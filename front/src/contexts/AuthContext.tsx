import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  profilePhotoPath: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  signin: (username: string, password: string) => Promise<void>;
  signout: () => void;
  updateUser: (userData: Partial<User> | FormData) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({
        id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        profilePhotoPath: response.data.profilePhotoPath,
        isPremium: response.data.isPremium
      });
    } catch (error) {
      console.error('Echec affichage de l utilisateur', error);
      localStorage.removeItem('token');
    }
  };

  const signin = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/signin', { username, password });
      localStorage.setItem('token', response.data.access_token);
      await fetchUser(response.data.access_token);
    } catch (error) {
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = async (userData: Partial<User> | FormData) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      if (userData instanceof FormData) {
        response = await axios.put('http://localhost:5000/auth/update', userData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.put('http://localhost:5000/auth/update', userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const updatedUser = {
        id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        profilePhotoPath: response.data.profilePhotoPath,
        isPremium: response.data.isPremium
      };
  
      if (updatedUser.profilePhotoPath) {
        updatedUser.profilePhotoPath = `${updatedUser.profilePhotoPath}?t=${new Date().getTime()}`;
      }

      setUser(updatedUser);
      
    } catch (error) {
      console.error('Échec de la mise à jour de l utilisateur', error);
      throw error;
    }
  };

  const upgradeToPremium = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!user) throw new Error('User not found');
      const response = await axios.patch(`http://localhost:5000/auth/users/${user.id}/premium`, 
        { isPremium: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setUser(prevUser => prevUser ? { ...prevUser, isPremium: true } : null);
      }
    } catch (error) {
      console.error('Échec de la mise à niveau vers premium', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, updateUser, upgradeToPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé au sein d un AuthProvider');
  }
  return context;
};