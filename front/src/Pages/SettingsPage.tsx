import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ItemData {
  _id: string;
  name: string;
  description: string;
  price: string;
  address: string;
  city: string;
  country: string;
  images: File[];
}

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { getUserItems, updateItem } = useItems();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [itemData, setItemData] = useState<ItemData>({
    _id: '',
    name: '',
    description: '',
    price: '',
    address: '',
    city: '',
    country: '',
    images: [],
  });
  const [userItems, setUserItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'items'>('profile');

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        username: user.username || '',
        email: user.email || '',
      }));
      loadUserItems();
    }
  }, [user]);

  const loadUserItems = async () => {
    try {
      const items = await getUserItems();
      setUserItems(items);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load user items' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (['username', 'email', 'password', 'confirmPassword'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setItemData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setItemData(prev => ({ ...prev, images: Array.from(e.target.files!) }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };
      await updateUser(updateData);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setFormData(prevState => ({
        ...prevState,
        password: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedItemId) {
      setMessage({ type: 'error', text: 'Please select an item to update' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('description', itemData.description);
      formData.append('price', itemData.price);
      formData.append('address', itemData.address);
      formData.append('city', itemData.city);
      formData.append('country', itemData.country);
      
      itemData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      

      await updateItem(selectedItemId, formData);
      setMessage({ type: 'success', text: 'Item updated successfully' });
      loadUserItems();
      setSelectedItemId(null);
      resetItemForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update item' });
    }
  };

  const selectItem = (item: any) => {
    setSelectedItemId(item._id);
    setItemData({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      address: item.address,
      city: item.city,
      country: item.country,
      images: [],
    });
  };

  const resetItemForm = () => {
    setItemData({
      _id: '',
      name: '',
      description: '',
      price: '',
      address: '',
      city: '',
      country: '',
      images: [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`mr-4 ${activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`${activeTab === 'items' ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}
        >
          Manage Items
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
        </form>
      )}

      {activeTab === 'items' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Items</h2>
          <ul className="mb-6">
            {userItems.map(item => (
              <li key={item._id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <button 
                  onClick={() => selectItem(item)} 
                  className={`px-4 py-2 rounded ${selectedItemId === item._id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {selectedItemId === item._id ? 'Selected' : 'Select to Edit'}
                </button>
              </li>
            ))}
          </ul>

          {selectedItemId && (
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={itemData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={itemData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={itemData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={itemData.address}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={itemData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={itemData.country}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Item
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;