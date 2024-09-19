import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, faMapMarkerAlt, faCity, faGlobe, faBed, 
  faRulerCombined, faCompass, faWheelchair, faBuilding, 
  faWarehouse, faCar, faBox, faWineBottle, faTree, faDollarSign, faImage 
} from "@fortawesome/free-solid-svg-icons";

interface Suggestion {
  display_name: string;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '40px',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    width: '600px',
    margin: '20px auto',
  },
  title: {
    color: '#5c5c5c',
    fontSize: '36px',
    fontWeight: 700,
    marginBottom: '30px',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative' as const,
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    height: '60px',
    backgroundColor: '#ffffff',
    borderRadius: '30px',
    border: '1px solid #c0c0c0',
    padding: '0 20px 0 50px',
    fontSize: '18px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    height: '120px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #c0c0c0',
    padding: '15px 20px 15px 50px',
    fontSize: '18px',
    outline: 'none',
    resize: 'vertical' as const,
  },
  icon: {
    position: 'absolute' as const,
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    color: '#6b4db3',
    fontSize: '20px',
  },
  select: {
    width: '100%',
    height: '60px',
    backgroundColor: '#ffffff',
    borderRadius: '30px',
    border: '1px solid #c0c0c0',
    padding: '0 20px 0 50px',
    fontSize: '18px',
    outline: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 20px top 50%',
    backgroundSize: '12px auto',
  },
  checkbox: {
    marginRight: '10px',
  },
  button: {
    cursor: 'pointer',
    width: '100%',
    height: '60px',
    border: '0',
    borderRadius: '30px',
    backgroundColor: '#6b4db3',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 600,
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '15px',
    textAlign: 'center' as const,
    fontSize: '14px',
  },
  success: {
    color: '#2ecc71',
    marginBottom: '15px',
    textAlign: 'center' as const,
    fontSize: '14px',
  },
};

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
    <div style={styles.container}>
      <h1 style={styles.title}>Créer une publication</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHome} style={styles.icon} />
          <input
            type="text"
            name="name"
            placeholder="Nom de la propriété"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHome} style={{...styles.icon, top: '30px'}} />
          <textarea
            name="description"
            placeholder="Description de la propriété"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows={3}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faDollarSign} style={styles.icon} />
          <input
            type="number"
            name="price"
            placeholder="Prix"
            value={formData.price}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHome} style={styles.icon} />
          <input
            type="text"
            name="title"
            placeholder="Titre de l'annonce"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
          <input
            type="text"
            name="address"
            placeholder="Adresse de la propriété"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              backgroundColor: '#ffffff',
              border: '1px solid #c0c0c0',
              borderRadius: '10px',
              marginTop: '5px',
              maxHeight: '200px',
              overflowY: 'auto',
              listStyle: 'none',
              padding: 0,
            }}>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faCity} style={styles.icon} />
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faGlobe} style={styles.icon} />
          <input
            type="text"
            name="country"
            placeholder="Pays"
            value={formData.country}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHome} style={styles.icon} />
          <select
            name="typeOfHousing"
            value={formData.typeOfHousing}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Sélectionnez un type de logement</option>
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="studio">Studio</option>
          </select>
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHome} style={styles.icon} />
          <input
            type="number"
            name="rooms"
            placeholder="Nombre de pièces"
            value={formData.rooms}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faBed} style={styles.icon} />
          <input
            type="number"
            name="bedrooms"
            placeholder="Nombre de chambres"
            value={formData.bedrooms}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faRulerCombined} style={styles.icon} />
          <input
            type="number"
            name="area"
            placeholder="Surface en m²"
            value={formData.area}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faCompass} style={styles.icon} />
          <select
            name="exposure"
            value={formData.exposure}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Sélectionnez l'exposition</option>
            <option value="nord">Nord</option>
            <option value="sud">Sud</option>
            <option value="est">Est</option>
            <option value="ouest">Ouest</option>
          </select>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
          <label style={{display: 'flex', alignItems: 'center', fontSize: '16px', color: '#5c5c5c'}}>
            <input
              type="checkbox"
              name="furnished"
              checked={formData.furnished}
              onChange={handleChange}
              style={{marginRight: '10px', width: '20px', height: '20px'}}
            />
            Meublé
          </label>
          <label style={{display: 'flex', alignItems: 'center', fontSize: '16px', color: '#5c5c5c'}}>
            <input
              type="checkbox"
              name="notFurnished"
              checked={formData.notFurnished}
              onChange={handleChange}
              style={{marginRight: '10px', width: '20px', height: '20px'}}
            />
            Non meublé
          </label>
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faWheelchair} style={styles.icon} />
          <input
            type="text"
            name="accessibility"
            placeholder="Accessibilité"
            value={formData.accessibility}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faBuilding} style={styles.icon} />
          <input
            type="number"
            name="floor"
            placeholder="Étage"
            value={formData.floor}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faWarehouse} style={styles.icon} />
          <input
            type="number"
            name="annexArea"
            placeholder="Surface annexe en m²"
            value={formData.annexArea}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={{marginBottom: '20px'}}>
          <p style={{fontSize: '16px', color: '#5c5c5c', marginBottom: '10px'}}>Options annexes</p>
          {[
            { name: 'parking', icon: faCar, label: 'Parking' },
            { name: 'garage', icon: faCar, label: 'Garage' },
            { name: 'basement', icon: faWarehouse, label: 'Sous-sol' },
            { name: 'storageUnit', icon: faBox, label: 'Box' },
            { name: 'cellar', icon: faWineBottle, label: 'Cave' }
          ].map((option) => (
            <label key={option.name} style={{display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '16px', color: '#5c5c5c'}}>
              <input
                type="checkbox"
                name={option.name}
                checked={formData[option.name as keyof typeof formData] as boolean}
                onChange={handleChange}
                style={{marginRight: '10px', width: '20px', height: '20px'}}
              />
              <FontAwesomeIcon icon={option.icon} style={{marginRight: '10px', fontSize: '20px', color: '#6b4db3'}} />
              {option.label}
            </label>
          ))}
        </div>
        <label style={{display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '16px', color: '#5c5c5c'}}>
          <input
            type="checkbox"
            name="exterior"
            checked={formData.exterior}
            onChange={handleChange}
            style={{marginRight: '10px', width: '20px', height: '20px'}}
          />
          <FontAwesomeIcon icon={faTree} style={{marginRight: '10px', fontSize: '20px', color: '#6b4db3'}} />
          Extérieur
        </label>
        <div style={styles.inputContainer}>
          <FontAwesomeIcon icon={faImage} style={{...styles.icon, top: '30px'}} />
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            style={{...styles.input, paddingTop: '15px', paddingBottom: '15px', height: 'auto'}}
            multiple
          />
        </div>
        <button type="submit" style={styles.button}>
          Créer la publication
        </button>
      </form>
      {message && (
        <div style={message.includes('Erreur') ? styles.error : styles.success}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CreatePublication;