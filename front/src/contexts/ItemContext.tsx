import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  images: string[];
  userId: string;
  latitude?: number;
  longitude?: number;
}

interface ItemContextType {
  getUserItems: () => Promise<Item[]>;
  updateItem: (id: string, formData: FormData) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
  createItem: (formData: FormData) => Promise<Item>; // Nouvelle méthode
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);

  const getUserItems = async (): Promise<Item[]> => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get<Item[]>('/item', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Fetched items:", response.data.length); // Ajoutez ce log
      return response.data; // Retournez toutes les données sans filtrage
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, formData: FormData): Promise<Item> => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put<Item>(`/item/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setItems(prevItems => prevItems.map(i => i._id === id ? response.data : i));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/item/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  };

  const createItem = async (formData: FormData): Promise<Item> => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post<Item>('/item', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setItems(prevItems => [...prevItems, response.data]);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  };

  return (
    <ItemContext.Provider value={{ getUserItems, updateItem, deleteItem, createItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = (): ItemContextType => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};
