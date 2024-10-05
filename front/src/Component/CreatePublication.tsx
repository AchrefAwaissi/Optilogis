import React, { useState, useEffect, ChangeEvent, FormEvent, useCallback, useRef } from 'react';
import axios from 'axios';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faMapMarkerAlt, faCity, faGlobe, faBed,
  faRulerCombined, faCompass, faWheelchair, faBuilding,
  faWarehouse, faCar, faBox, faWineBottle, faTree, faDollarSign, faImage,
  faTimes, faPlus, faMinus
} from "@fortawesome/free-solid-svg-icons";

interface Suggestion {
  display_name: string;
}

const MAX_IMAGES = 10;
const INITIAL_VISIBLE_IMAGES = 5;

interface FormData {
  name: string;
  description: string;
  price: string;
  title: string;
  address: string;
  city: string;
  country: string;
  typeOfHousing: string;
  rooms: string;
  bedrooms: string;
  area: string;
  exposure: string;
  furnished: boolean;
  notFurnished: boolean;
  accessibility: string;
  floor: string;
  annexArea: string;
  parking: boolean;
  garage: boolean;
  basement: boolean;
  storageUnit: boolean;
  cellar: boolean;
  exterior: boolean;
}

const CreatePublication: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const { user } = useAuth();
  const { createItem } = useItems();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'furnished' && checked ? { notFurnished: false } : {}),
      ...(name === 'notFurnished' && checked ? { furnished: false } : {})
    }));

    if (name === 'address') {
      handleAddressChange(value);
    }
  }, []);

  const handleAddressChange = useCallback(async (value: string) => {
    if (value.length > 2) {
      try {
        const response = await axios.get<Suggestion[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions d adresse.:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
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
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - images.length;
      const filesToAdd = selectedFiles.slice(0, remainingSlots);
      
      setImages(prevImages => [...prevImages, ...filesToAdd]);
      
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

      if (selectedFiles.length > remainingSlots) {
        setMessage({ type: 'error', text: `Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s). Les autres ont été ignorées.` });
      }
    }
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevPreviews[index]);
      return updatedPreviews;
    });
  }, []);

  const toggleShowAllImages = useCallback(() => {
    setShowAllImages(prev => !prev);
  }, []);

  const scrollToMessage = useCallback(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });
    images.forEach(image => {
      submitData.append('images', image);
    });

    try {
      const newItem = await createItem(submitData);
      setMessage({ type: 'success', text: 'Publication créée avec succès!' });
      console.log('Nouvel item créé:', newItem);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création de la publication' });
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setTimeout(scrollToMessage, 100);
    }
  }, [formData, images, createItem, scrollToMessage]);

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div className="w-full bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#030303] font-poppins mb-8"
            ref={messageRef}
            >Publier une annonce</h1>

        {message && (
          <div 
            className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de la propriété */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Nom de la propriété <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faHome} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Nom de la propriété"
                  required
                />
              </div>
            </div>

            {/* Prix */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Prix <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faDollarSign} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Prix"
                  required
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Adresse <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Votre adresse"
                  required
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
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
            </div>

            {/* Ville */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Ville <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faCity} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Ville"
                  required
                />
              </div>
            </div>

            {/* Pays */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Pays <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faGlobe} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Pays"
                  required
                />
              </div>
            </div>

            {/* Type de logement */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Type de logement
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faHome} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <select
                  name="typeOfHousing"
                  value={formData.typeOfHousing}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550] appearance-none"
                >
                  <option value="">Sélectionnez une option</option>
                  {['Maison', 'Appartement', 'Studio'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nombre de pièces */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Nombre de pièces
              </label>
              <div className="relative">
              <FontAwesomeIcon icon={faHome} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Nombre de pièces"
                />
              </div>
            </div>

            {/* Nombre de chambres */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Nombre de chambres
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faBed} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Nombre de chambres"
                />
              </div>
            </div>

            {/* Surface en m² */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Surface en m²
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faRulerCombined} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Surface en m²"
                />
              </div>
            </div>

            {/* Exposition */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Exposition
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faCompass} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <select
                  name="exposure"
                  value={formData.exposure}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550] appearance-none"
                >
                  <option value="">Sélectionnez une option</option>
                  {['Nord', 'Sud', 'Est', 'Ouest'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Accessibilité */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Accessibilité
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faWheelchair} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="text"
                  name="accessibility"
                  value={formData.accessibility}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Accessibilité"
                />
              </div>
            </div>

            {/* Étage */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Étage
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faBuilding} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Étage"
                />
              </div>
            </div>

            {/* Surface annexe en m² */}
            <div className="mb-4">
              <label className="block text-[#030303] text-xl font-poppins mb-2">
                Surface annexe en m²
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faWarehouse} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
                <input
                  type="number"
                  name="annexArea"
                  value={formData.annexArea}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
                  placeholder="Surface annexe en m²"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-[#030303] text-xl font-poppins mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
              rows={4}
              placeholder="Description de la propriété"
            ></textarea>
          </div>

          {/* Options */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#030303] font-poppins mb-4">Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'furnished', label: 'Meublé', icon: faHome },
                { name: 'notFurnished', label: 'Non meublé', icon: faHome },
                { name: 'parking', label: 'Parking', icon: faCar },
                { name: 'garage', label: 'Garage', icon: faCar },
                { name: 'basement', label: 'Sous-sol', icon: faBox },
                { name: 'storageUnit', label: 'Box', icon: faBox },
                { name: 'cellar', label: 'Cave', icon: faWineBottle },
                { name: 'exterior', label: 'Extérieur', icon: faTree },
              ].map((option) => (
                <label key={option.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={option.name}
                    checked={formData[option.name as keyof FormData] as boolean}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-[#095550]"
                  />
                  <FontAwesomeIcon icon={option.icon} className="text-[#095550]" />
                  <span className="text-[#030303] font-poppins">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="mt-6">
            <label className="block text-[#030303] text-xl font-poppins mb-2">Images ({images.length}/{MAX_IMAGES})</label>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col w-full h-32 border-4 border-[#095550] border-dashed hover:bg-gray-100 hover:border-gray-300 ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="flex flex-col items-center justify-center pt-7">
                  <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-[#095550] group-hover:text-gray-600" />
                  <p className="pt-1 text-sm tracking-wider text-[#095550] group-hover:text-gray-600">
                    {images.length >= MAX_IMAGES ? 'Limite atteinte' : 'Sélectionnez des images'}
                  </p>
                </div>
                <input 
                  type="file" 
                  name="images" 
                  onChange={handleImageChange} 
                  className="opacity-0" 
                  multiple 
                  accept="image/*"
                  disabled={images.length >= MAX_IMAGES}
                />
              </label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imagePreviews.slice(0, showAllImages ? imagePreviews.length : INITIAL_VISIBLE_IMAGES).map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {!showAllImages && imagePreviews.length > INITIAL_VISIBLE_IMAGES && (
                  <button
                    type="button"
                    onClick={toggleShowAllImages}
                    className="relative w-full h-24 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-gray-600 mr-2" />
                    <span className="text-gray-600 font-bold">{imagePreviews.length - INITIAL_VISIBLE_IMAGES}</span>
                  </button>
                )}
                {showAllImages && imagePreviews.length > INITIAL_VISIBLE_IMAGES && (
                  <button
                    type="button"
                    onClick={toggleShowAllImages}
                    className="relative w-full h-24 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-gray-600 mr-2" />
                    <span className="text-gray-600 font-bold">Réduire</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-start">
            <button type="submit" className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300">
              Créer la publication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(CreatePublication);