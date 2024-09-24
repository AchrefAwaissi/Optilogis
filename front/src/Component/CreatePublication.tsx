// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHome, faMapMarkerAlt, faCity, faGlobe, faBed,
//   faRulerCombined, faCompass, faCar, faBox, faWineBottle, faTree, faDollarSign, faImage
// } from "@fortawesome/free-solid-svg-icons";
// import { useItems } from '../contexts/ItemContext';
// import { useAuth } from '../contexts/AuthContext';

// interface FormData {
//   name: string;
//   description: string;
//   price: string;
//   title: string;
//   address: string;
//   city: string;
//   country: string;
//   typeOfHousing: string;
//   rooms: string;
//   bedrooms: string;
//   area: string;
//   exposure: string;
//   furnished: boolean;
//   notFurnished: boolean;
//   accessibility: string;
//   floor: string;
//   annexArea: string;
//   parking: boolean;
//   garage: boolean;
//   basement: boolean;
//   storageUnit: boolean;
//   cellar: boolean;
//   exterior: boolean;
// }

// const CreatePublication: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     description: '',
//     price: '',
//     title: '',
//     address: '',
//     city: '',
//     country: '',
//     typeOfHousing: '',
//     rooms: '',
//     bedrooms: '',
//     area: '',
//     exposure: '',
//     furnished: false,
//     notFurnished: false,
//     accessibility: '',
//     floor: '',
//     annexArea: '',
//     parking: false,
//     garage: false,
//     basement: false,
//     storageUnit: false,
//     cellar: false,
//     exterior: false
//   });
//   const [images, setImages] = useState<File[]>([]);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const { user } = useAuth();
//   const { createItem } = useItems();

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (name === 'furnished' && checked) {
//       setFormData(prev => ({ ...prev, notFurnished: false }));
//     } else if (name === 'notFurnished' && checked) {
//       setFormData(prev => ({ ...prev, furnished: false }));
//     }
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(Array.from(e.target.files));
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setMessage(null);

//     const submitData = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       submitData.append(key, value.toString());
//     });
//     images.forEach(image => {
//       submitData.append('images', image);
//     });

//     try {
//       const newItem = await createItem(submitData);
//       setMessage({ type: 'success', text: 'Publication créée avec succès!' });
//       console.log('Nouvel item créé:', newItem);
//       // Reset form here if needed
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Erreur lors de la création de la publication' });
//       console.error('Erreur lors de l\'envoi:', error);
//     }
//   };

//   const InputField: React.FC<{ label: string; name: keyof FormData; type?: string; icon: any; required?: boolean }> = ({ label, name, type = 'text', icon, required }) => (
//     <div className="mb-4">
//       <label className="block text-[#030303] text-xl font-poppins mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <FontAwesomeIcon icon={icon} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
//         <input
//           type={type}
//           name={name}
//           value={formData[name] as string}
//           onChange={handleChange}
//           className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
//           placeholder={`Your ${label}`}
//           required={required}
//         />
//       </div>
//     </div>
//   );

//   const SelectField: React.FC<{ label: string; name: keyof FormData; options: string[]; icon: any; required?: boolean }> = ({ label, name, options, icon, required }) => (
//     <div className="mb-4">
//       <label className="block text-[#030303] text-xl font-poppins mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <FontAwesomeIcon icon={icon} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
//         <select
//           name={name}
//           value={formData[name] as string}
//           onChange={handleChange}
//           className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550] appearance-none"
//           required={required}
//         >
//           <option value="">Sélectionnez une option</option>
//           {options.map(option => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-[#030303] font-poppins mb-8">Publier une annonce</h1>

//         {message && (
//           <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InputField label="Nom de la propriété" name="name" icon={faHome} />
//             <InputField label="Prix" name="price" type="number" icon={faDollarSign} required />
//             <InputField label="Adresse" name="address" icon={faMapMarkerAlt} required />
//             <InputField label="Ville" name="city" icon={faCity} required />
//             <InputField label="Pays" name="country" icon={faGlobe} required />
//             <SelectField
//               label="Type de logement"
//               name="typeOfHousing"
//               options={['Maison', 'Appartement', 'Studio']}
//               icon={faHome}
//             />
//             <InputField label="Nombre de pièces" name="rooms" type="number" icon={faHome} />
//             <InputField label="Nombre de chambres" name="bedrooms" type="number" icon={faBed} />
//             <InputField label="Surface en m²" name="area" type="number" icon={faRulerCombined} />
//             <SelectField
//               label="Exposition"
//               name="exposure"
//               options={['Nord', 'Sud', 'Est', 'Ouest']}
//               icon={faCompass}
//             />
//           </div>

//           <div className="mt-6">
//             <label className="block text-[#030303] text-xl font-poppins mb-2">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
//               rows={4}
//               placeholder="Description de la propriété"
//             ></textarea>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-xl font-bold text-[#030303] font-poppins mb-4">Options</h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {[
//                 { name: 'furnished', label: 'Meublé', icon: faHome },
//                 { name: 'notFurnished', label: 'Non meublé', icon: faHome },
//                 { name: 'parking', label: 'Parking', icon: faCar },
//                 { name: 'garage', label: 'Garage', icon: faCar },
//                 { name: 'basement', label: 'Sous-sol', icon: faBox },
//                 { name: 'storageUnit', label: 'Box', icon: faBox },
//                 { name: 'cellar', label: 'Cave', icon: faWineBottle },
//                 { name: 'exterior', label: 'Extérieur', icon: faTree },
//               ].map((option) => (
//                 <label key={option.name} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     name={option.name}
//                     checked={formData[option.name as keyof FormData] as boolean}
//                     onChange={handleChange}
//                     className="form-checkbox h-5 w-5 text-[#095550]"
//                   />
//                   <FontAwesomeIcon icon={option.icon} className="text-[#095550]" />
//                   <span className="text-[#030303] font-poppins">{option.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6">
//             <label className="block text-[#030303] text-xl font-poppins mb-2">Images</label>
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col w-full h-32 border-4 border-[#095550] border-dashed hover:bg-gray-100 hover:border-gray-300">
//                 <div className="flex flex-col items-center justify-center pt-7">
//                   <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-[#095550] group-hover:text-gray-600" />
//                   <p className="pt-1 text-sm tracking-wider text-[#095550] group-hover:text-gray-600">
//                     Sélectionnez des images
//                   </p>
//                 </div>
//                 <input type="file" name="images" onChange={handleImageChange} className="opacity-0" multiple />
//               </label>
//             </div>
//           </div>

//           <div className="mt-8 flex justify-start">
//             <button type="submit" className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300">
//               Créer la publication
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreatePublication;











import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faMapMarkerAlt, faCity, faGlobe, faBed,
  faRulerCombined, faCompass, faWheelchair, faBuilding,
  faWarehouse, faCar, faBox, faWineBottle, faTree, faDollarSign, faImage,
  faTimes,
  faPlus,
  faMinus
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'address') {
      handleAddressChange(value);
    }

    if (name === 'furnished' && checked) {
      setFormData(prev => ({ ...prev, notFurnished: false }));
    } else if (name === 'notFurnished' && checked) {
      setFormData(prev => ({ ...prev, furnished: false }));
    }
  };

  const handleAddressChange = async (value: string) => {
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - images.length;
      const filesToAdd = selectedFiles.slice(0, remainingSlots);
      
      setImages(prevImages => [...prevImages, ...filesToAdd]);
      
      // Générer des aperçus pour les nouvelles images
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

      if (selectedFiles.length > remainingSlots) {
        setMessage({ type: 'error', text: `Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s). Les autres ont été ignorées.` });
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      URL.revokeObjectURL(prevPreviews[index]);
      return updatedPreviews;
    });
  };

  const toggleShowAllImages = () => {
    setShowAllImages(prev => !prev);
  };

  useEffect(() => {
    // Nettoyer les URLs des aperçus lorsque le composant est démonté
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      // Reset form here if needed
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création de la publication' });
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const InputField: React.FC<{ label: string; name: keyof FormData; type?: string; icon: any; required?: boolean }> = ({ label, name, type = 'text', icon, required }) => (
    <div className="mb-4">
      <label className="block text-[#030303] text-xl font-poppins mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <FontAwesomeIcon icon={icon} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
        <input
          type={type}
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550]"
          placeholder={`${label}`}
          required={required}
        />
      </div>
    </div>
  );

  const SelectField: React.FC<{ label: string; name: keyof FormData; options: string[]; icon: any; required?: boolean }> = ({ label, name, options, icon, required }) => (
    <div className="mb-4">
      <label className="block text-[#030303] text-xl font-poppins mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <FontAwesomeIcon icon={icon} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#095550]" />
        <select
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          className="w-full bg-[#f9f9f9] text-[#030303] text-lg font-light font-poppins p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#095550] appearance-none"
          required={required}
        >
          <option value="">Sélectionnez une option</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#030303] font-poppins mb-8">Publier une annonce</h1>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nom de la propriété" name="name" icon={faHome} required />
            <InputField label="Prix" name="price" type="number" icon={faDollarSign} required />
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
            <InputField label="Ville" name="city" icon={faCity} required />
            <InputField label="Pays" name="country" icon={faGlobe} required />
            <SelectField
              label="Type de logement"
              name="typeOfHousing"
              options={['Maison', 'Appartement', 'Studio']}
              icon={faHome}
            />
            <InputField label="Nombre de pièces" name="rooms" type="number" icon={faHome} />
            <InputField label="Nombre de chambres" name="bedrooms" type="number" icon={faBed} />
            <InputField label="Surface en m²" name="area" type="number" icon={faRulerCombined} />
            <SelectField
              label="Exposition"
              name="exposure"
              options={['Nord', 'Sud', 'Est', 'Ouest']}
              icon={faCompass}
            />
            <InputField label="Accessibilité" name="accessibility" icon={faWheelchair} />
            <InputField label="Étage" name="floor" type="number" icon={faBuilding} />
            <InputField label="Surface annexe en m²" name="annexArea" type="number" icon={faWarehouse} />
          </div>

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

export default CreatePublication;