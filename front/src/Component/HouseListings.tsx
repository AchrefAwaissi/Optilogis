import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Maximize2, BedDouble, Square } from 'lucide-react';

interface House {
  _id: string;
  image: string;
  price: number;
  address: string;
  city: string;
  typeOfHousing: string;
  title: string;
  rooms: number;
  bedrooms: number;
  area: number;
  name: string;
  description: string;
}

interface HouseListingsProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
}

const HouseListings: React.FC<HouseListingsProps> = ({ houses, onHouseSelect }) => {
  const navigate = useNavigate();

  const handleCardClick = (house: House) => {
    onHouseSelect(house);
    navigate(`/property/${house._id}`);
  };

  const HouseCard: React.FC<House> = ({
    _id,
    image,
    price,
    address,
    city,
    typeOfHousing,
    title,
    rooms,
    bedrooms,
    area
  }) => (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md w-[350px] h-[150px] mb-4 cursor-pointer flex"
      onClick={() => handleCardClick({
        _id, image, price, address, city, typeOfHousing, title, rooms, bedrooms, area,
        name: '',
        description: ''
      })}
    >
      <div className="relative w-[150px] h-[150px]">
        <img
          src={image ? `http://localhost:5000/uploads/${image}` : "/api/placeholder/150/150"}
          alt={`${address}, ${city}`}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      <div className="p-2 w-[200px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs font-semibold">{typeOfHousing || 'maison'}</span>
            </div>
            <span className="text-sm font-bold text-blue-600">{price.toLocaleString()} €</span>
          </div>
          <h2 className="text-sm font-semibold mb-1 truncate">{title}</h2>
          <p className="text-gray-600 text-xs mb-1 truncate">{address}, {city}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Maximize2 className="h-3 w-3 mr-1 text-gray-500" />
            <span className="text-xs">{area} m²</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="h-3 w-3 mr-1 text-gray-500" />
            <span className="text-xs">{bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-3 w-3 mr-1 text-gray-500" />
            <span className="text-xs">{rooms}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{houses.length} Résultats</h1>
      <div className="flex flex-wrap gap-4">
        {houses.map((house) => (
          <HouseCard key={house._id} {...house} />
        ))}
      </div>
    </div>
  );
};

export default HouseListings;