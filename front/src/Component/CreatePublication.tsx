import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';  
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';

interface Suggestion {
  display_name: string;
}

const CreatePublication: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    title: '',
    address: '',
    city: '',
    country: '',
    typeOfHousing: '',
    rooms: '',
    bedrooms: '',
    area: '',
    exposure: '',
    furnished: false,
    notFurnished: false,
    accessibility: '',
    floor: '',
    annexArea: '',
    parking: false,
    garage: false,
    basement: false,
    storageUnit: false,
    cellar: false,
    exterior: false
  });
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { createItem } = useItems();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    if (name === 'address') {
      handleAddressChange(value);
    }

    // Gestion de l'exclusivité entre meublé et non meublé
    if (name === 'furnished' && (e.target as HTMLInputElement).checked) {
      setFormData(prev => ({ ...prev, notFurnished: false }));
    } else if (name === 'notFurnished' && (e.target as HTMLInputElement).checked) {
      setFormData(prev => ({ ...prev, furnished: false }));
    }
  };

  const handleAddressChange = async (value: string) => {
    if (value.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const addressParts = suggestion.display_name.split(',');
    const city = addressParts.slice(-2, -1)[0].trim();
    const country = addressParts.slice(-1)[0].trim();

    setFormData(prev => ({
      ...prev,
      address: suggestion.display_name,
      city,
      country
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });
    images.forEach(image => {
      submitData.append('images', image);
    });

    try {
      const newItem = await createItem(submitData);
      setMessage('Publication créée avec succès!');
      console.log('Nouvel item créé:', newItem);
      // Réinitialiser le formulaire ici si nécessaire
    } catch (error) {
      setMessage('Erreur lors de la création de la publication');
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center p-4">Créer une publication</h2>
      <div className="flex-grow overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Nom de la propriété"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Description de la propriété"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
              <input
                id="price"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Prix"
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Titre de l'annonce"
              />
            </div>
            <div className="relative">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Adresse de la propriété"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Ville"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
              <input
                id="country"
                name="country"
                type="text"
                required
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Pays"
              />
            </div>
            <div>
              <label htmlFor="typeOfHousing" className="block text-sm font-medium text-gray-700">Type de logement</label>
              <select
                id="typeOfHousing"
                name="typeOfHousing"
                value={formData.typeOfHousing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Sélectionner un type</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            <div>
              <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">Nombre de pièces</label>
              <input
                id="rooms"
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Nombre de pièces"
              />
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Nombre de chambres</label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Nombre de chambres"
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">Superficie</label>
              <input
                id="area"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Superficie en m²"
              />
            </div>
            <div>
              <label htmlFor="exposure" className="block text-sm font-medium text-gray-700">Exposition</label>
              <input
                id="exposure"
                name="exposure"
                type="text"
                value={formData.exposure}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Exposition"
              />
            </div>
            <div>
              <label htmlFor="furnished" className="block text-sm font-medium text-gray-700">
                <input
                  id="furnished"
                  name="furnished"
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="mr-2"
                />
                Meublé
              </label>
              <label htmlFor="notFurnished" className="block text-sm font-medium text-gray-700">
                <input
                  id="notFurnished"
                  name="notFurnished"
                  type="checkbox"
                  checked={formData.notFurnished}
                  onChange={handleChange}
                  className="mr-2"
                />
                Non meublé
              </label>
            </div>
            <div>
              <label htmlFor="accessibility" className="block text-sm font-medium text-gray-700">Accessibilité</label>
              <input
                id="accessibility"
                name="accessibility"
                type="text"
                value={formData.accessibility}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Accessibilité"
              />
            </div>
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Étage</label>
              <input
                id="floor"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Étage"
              />
            </div>
            <div>
              <label htmlFor="annexArea" className="block text-sm font-medium text-gray-700">Surface annexe</label>
              <input
                id="annexArea"
                name="annexArea"
                type="number"
                value={formData.annexArea}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Surface annexe en m²"
              />
            </div>
            <div>
              <label htmlFor="parking" className="block text-sm font-medium text-gray-700">
                <input
                  id="parking"
                  name="parking"
                  type="checkbox"
                  checked={formData.parking}
                  onChange={handleChange}
                  className="mr-2"
                />
                Parking
              </label>
              <label htmlFor="garage" className="block text-sm font-medium text-gray-700">
                <input
                  id="garage"
                  name="garage"
                  type="checkbox"
                  checked={formData.garage}
                  onChange={handleChange}
                  className="mr-2"
                />
                Garage
              </label>
              <label htmlFor="basement" className="block text-sm font-medium text-gray-700">
                <input
                  id="basement"
                  name="basement"
                  type="checkbox"
                  checked={formData.basement}
                  onChange={handleChange}
                  className="mr-2"
                />
                Sous-sol
              </label>
              <label htmlFor="storageUnit" className="block text-sm font-medium text-gray-700">
                <input
                  id="storageUnit"
                  name="storageUnit"
                  type="checkbox"
                  checked={formData.storageUnit}
                  onChange={handleChange}
                  className="mr-2"
                />
                Local de stockage
              </label>
              <label htmlFor="cellar" className="block text-sm font-medium text-gray-700">
                <input
                  id="cellar"
                  name="cellar"
                  type="checkbox"
                  checked={formData.cellar}
                  onChange={handleChange}
                  className="mr-2"
                />
                Cave
              </label>
              <label htmlFor="exterior" className="block text-sm font-medium text-gray-700">
                <input
                  id="exterior"
                  name="exterior"
                  type="checkbox"
                  checked={formData.exterior}
                  onChange={handleChange}
                  className="mr-2"
                />
                Extérieur
              </label>
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Créer la publication
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-4 rounded-md ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePublication;
