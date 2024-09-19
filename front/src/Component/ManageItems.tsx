import React, { useState, useEffect } from 'react';
import { useItems } from '../contexts/ItemContext';

interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  images: string[];
  rooms: number;
  bedrooms: number;
  area: number;
}

interface ItemFormData extends Omit<Item, 'images' | '_id'> {
  images: (string | File)[];
}

const ManageItems: React.FC = () => {
    const { getUserItems, updateItem, deleteItem } = useItems();
    const [userItems, setUserItems] = useState<Item[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [itemData, setItemData] = useState<ItemFormData>({
      name: '',
      description: '',
      price: 0,
      address: '',
      city: '',
      country: '',
      images: [],
      rooms: 0,
      bedrooms: 0,
      area: 0,
    });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUserItems();
  }, []);

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
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setItemData(prev => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
        setMessage({ type: 'success', text: 'Item deleted successfully' });
        loadUserItems();
        if (selectedItemId === itemId) {
          setSelectedItemId(null);
          setItemData({
            name: '',
            description: '',
            price: 0,
            address: '',
            city: '',
            country: '',
            images: [],
            rooms: 0,
            bedrooms: 0,
            area: 0,
          });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete item' });
      }
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
      Object.entries(itemData).forEach(([key, value]) => {
        if (key !== 'images') {
          formData.append(key, value?.toString() || '');
        }
      });
      
      if (itemData.images) {
        itemData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      await updateItem(selectedItemId, formData);
      setMessage({ type: 'success', text: 'Item updated successfully' });
      loadUserItems();
      setSelectedItemId(null);
      setItemData({
        name: '',
        description: '',
        price: 0,
        address: '',
        city: '',
        country: '',
        images: [],
        rooms: 0,
        bedrooms: 0,
        area: 0,
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update item' });
    }
  };

  const selectItem = (item: Item) => {
    setSelectedItemId(item._id);
    setItemData({
      name: item.name,
      description: item.description,
      price: item.price,
      address: item.address,
      city: item.city,
      country: item.country,
      images: item.images,
      rooms: item.rooms,
      bedrooms: item.bedrooms,
      area: item.area,
    });
  };

  const truncateAddress = (address: string, maxLength: number) => {
    if (address.length <= maxLength) return address;
    return address.substr(0, maxLength - 3) + '...';
  };

  const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
    const truncatedAddress = truncateAddress(`${item.address}, ${item.city}, ${item.country}`, 30);
    const imageUrl = item.images && item.images.length > 0
      ? `http://localhost:5000/uploads/${item.images[0]}`
      : 'https://via.placeholder.com/100x100';

    return (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg flex flex-col sm:flex-row mb-4">
        <div
          className="w-full h-24 sm:w-24 sm:h-24 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{truncatedAddress}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">🛏 {item.rooms}</span>
              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">🛌 {item.bedrooms}</span>
              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">{item.area} m²</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-teal-700">${item.price.toLocaleString()}/ month</p>
            <div>
              <button 
                onClick={() => selectItem(item)}
                className="px-3 py-1 bg-blue-600 text-white text-xs font-normal rounded-lg hover:bg-blue-700 transition-colors duration-200 mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteItem(item._id)}
                className="px-3 py-1 bg-red-600 text-white text-xs font-normal rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Manage Your Items</h2>
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2">
        <div className="space-y-4">
          {userItems.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
        {selectedItemId && (
          <form onSubmit={handleItemSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
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
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per month)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={itemData.price}
                onChange={handleNumberChange}
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
              <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">Number of Rooms</label>
              <input
                id="rooms"
                name="rooms"
                type="number"
                value={itemData.rooms}
                onChange={handleNumberChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Number of Bedrooms</label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={itemData.bedrooms}
                onChange={handleNumberChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (m²)</label>
              <input
                id="area"
                name="area"
                type="number"
                step="0.01"
                value={itemData.area}
                onChange={handleNumberChange}
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
    </div>
  );
};

export default ManageItems;