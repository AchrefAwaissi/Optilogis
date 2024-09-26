import React, { useEffect, useState } from "react";
import { House } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface HouseListingsProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
  city: string;
  showFavorites: boolean; // New prop to control whether to show all items or only favorites
}

const truncateAddress = (address: string, maxLength: number) => {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};

const PropertyCard: React.FC<{ house: House; onClick: () => void }> = ({ house, onClick }) => {
  const { user } = useAuth(); // Utilisez le hook useAuth pour obtenir l'utilisateur connecté
  const [isLiked, setIsLiked] = useState(user && house.likes?.includes(user.id));
  const [likeCount, setLikeCount] = useState(house.likes?.length || 0);
  const truncatedAddress = truncateAddress(house.address, 30);

  const imageUrl = house.images && house.images.length > 0
    ? `http://localhost:5000/uploads/${house.images[0]}`
    : 'https://via.placeholder.com/165x155';

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();  // Empêche la propagation de l'événement
    e.stopPropagation(); // Assure que l'événement ne se propage pas au parent

    if (!user) {
      console.log('User must be logged in to like/unlike');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Aucun jeton d authentification trouvé');
      return;
    }

    try {
      const endpoint = `http://localhost:5000/item/${house._id}/like`;
      const method = isLiked ? 'delete' : 'post';
      
      const response = await axios({
        method: method,
        url: endpoint,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setIsLiked(!isLiked);
        setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
        console.log(`Item ${isLiked ? 'unliked' : 'liked'} successfully`);
      }
    } catch (error) {
      console.error('Erreur Ajout ou retrait du like:', error);
    }
  };

  return (
    <div
      className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg flex flex-col sm:flex-row"
      onClick={onClick}
      style={{ maxHeight: '300px' }}
    >
      <div className="relative w-full h-48 sm:w-40 sm:h-40 m-2">
        <div
          className="w-full h-full rounded-xl bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
         <button
          onClick={handleLikeToggle}
          className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 flex items-center space-x-1 z-10"
        >
          <FontAwesomeIcon 
            icon={faHeart} 
            className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-500'}`} 
          />
          <span className="text-sm font-semibold">{likeCount}</span>
        </button>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">{house.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{truncatedAddress}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
              <FontAwesomeIcon icon={faBath} className="mr-1" /> {house.rooms || 'N/A'}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
              <FontAwesomeIcon icon={faBed} className="mr-1" /> {house.bedrooms || 'N/A'}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
              <FontAwesomeIcon icon={faRulerCombined} className="mr-1" /> {house.area || 'N/A'} m²
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-teal-700">€{house.price.toLocaleString()}/ mois</p>
          <button className="px-3 py-2 bg-[#095550] text-white text-sm font-normal rounded-lg hover:bg-[#074440] transition-colors duration-200">
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
};

const HouseListings: React.FC<HouseListingsProps> = ({ houses, onHouseSelect, city, showFavorites }) => {
  const { user } = useAuth();
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // State for sort order

  useEffect(() => {
    let housesToDisplay = showFavorites && user 
      ? houses.filter(house => house.likes?.includes(user.id)) 
      : houses;

    // Sort houses based on the selected order
    housesToDisplay = housesToDisplay.sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    });

    setFilteredHouses(housesToDisplay);
  }, [houses, showFavorites, user, sortOrder]);

  const handleSortPrice = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 pb-20">
      <h2 className="text-2xl font-bold mb-4 self-start w-full">
        {filteredHouses.length} Résultats {showFavorites ? "favoris" : ""} {city ? `à ${city}` : "toutes les villes"}
      </h2>
      <li className="mt-4">  
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Trier par Prix</h3>
        <div className="flex flex-col">
          <label className="flex items-center py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={sortOrder === 'asc'}
              onChange={() => handleSortPrice('asc')}
              className="form-checkbox h-5 w-5 rounded focus:ring-[#095550]"
              style={{ accentColor: '#095550', borderRadius: '7px' }}
            />
            <span className="ml-3">Prix Déroissant</span>
          </label>

          <label className="flex items-center py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={sortOrder === 'desc'}
              onChange={() => handleSortPrice('desc')}
              className="form-checkbox h-5 w-5 rounded focus:ring-[#095550]"
              style={{ accentColor: '#095550', borderRadius: '7px' }}
            />
            <span className="ml-3">Prix Croissant</span>  
          </label>
        </div>
      </li>
      {filteredHouses.map((house) => (
        <PropertyCard
          key={house._id} 
          house={house}
          onClick={() => onHouseSelect(house)}
        />
      ))}
      {showFavorites && filteredHouses.length === 0 && (
        <p className="text-gray-500">Vous n'avez pas encore de favoris.</p>
      )}
    </div>
  );
};

export default HouseListings;
