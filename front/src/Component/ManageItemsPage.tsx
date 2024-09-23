import React, { useState, useEffect } from 'react';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

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

const truncateAddress = (address: string, maxLength: number) => {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};

const PropertyCard: React.FC<{ item: Item; onEdit: () => void; onDelete: () => void }> = ({ item, onEdit, onDelete }) => {
  const truncatedAddress = truncateAddress(`${item.address}, ${item.city}, ${item.country}`, 30);

  const imageUrl = item.images && item.images.length > 0
    ? `http://localhost:5000/uploads/${item.images[0]}`
    : 'https://via.placeholder.com/165x155';

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg flex flex-col sm:flex-row mb-4">
      <div className="relative w-full h-48 sm:w-40 sm:h-40 m-2">
        <div
          className="w-full h-full rounded-xl bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{truncatedAddress}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
              <FontAwesomeIcon icon={faBath} className="mr-1" /> {item.rooms || 'N/A'}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
              <FontAwesomeIcon icon={faBed} className="mr-1" /> {item.bedrooms || 'N/A'}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
              <FontAwesomeIcon icon={faRulerCombined} className="mr-1" /> {item.area || 'N/A'} m²
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-teal-700">€{item.price.toLocaleString()}/ mois</p>
          <div>
            <button onClick={onEdit} className="mr-2 px-3 py-2 bg-[#095550] text-white text-sm font-normal rounded-lg hover:bg-[#074440] transition-colors duration-200">
              <FontAwesomeIcon icon={faPencilAlt} className="mr-1" /> Edit
            </button>
            <button onClick={onDelete} className="px-3 py-2 bg-red-500 text-white text-sm font-normal rounded-lg hover:bg-red-600 transition-colors duration-200">
              <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageItems: React.FC = () => {
  const { getUserItems, updateItem, deleteItem } = useItems();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const { user } = useAuth();
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
  }, [user]);

  const loadUserItems = async () => {
    try {
      const allItems = await getUserItems();
      const filteredItems = allItems
        .filter((item: any) => item.userId === user?.id)
        .map((item: any) => ({
          ...item,
          rooms: item.rooms || 0,
          bedrooms: item.bedrooms || 0,
          area: item.area || 0,
        }));
      setUserItems(filteredItems);
    } catch (error) {
      setMessage({ type: 'error', text: 'Echec dans le chargement des utilisateurs' });
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
      setItemData(prev => ({ ...prev, images: Array.from(e.target.files || []) }));
    }
  };  

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await deleteItem(itemId);
        setMessage({ type: 'success', text: 'Élément supprimé avec succès.' });
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
        setMessage({ type: 'error', text: 'Échec de la suppression' });
      }
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedItemId) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un élément à mettre à jour.' });
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
      setMessage({ type: 'success', text: 'Élément mis à jour avec succès.' });
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
      setMessage({ type: 'error', text: 'Échec de la mise à jour' });
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

  return (
    <div className="min-h-screen h-screen w-full overflow-y-auto px-4 py-8 pb-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Your Properties</h1>
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      {userItems.length === 0 ? (
        <p className="text-center py-4">You haven't posted any properties yet.</p>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {userItems.map(item => (
            <PropertyCard
              key={item._id}
              item={item}
              onEdit={() => selectItem(item)}
              onDelete={() => handleDeleteItem(item._id)}
            />
          ))}
        </div>
      )}
      {selectedItemId && (
        <form onSubmit={handleItemSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow mt-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Property Name</label>
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
            Update Property
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageItems;
