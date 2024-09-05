import React from 'react';
import { Heart, Home, Building, Box } from 'lucide-react';
import { House } from '../types';

interface HouseListingsProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
}

const HouseListings: React.FC<HouseListingsProps> = ({ houses, onHouseSelect }) => {
  const getHousingTypeIcon = (type?: string) => {
    if (!type) return null;
    
    switch (type.toLowerCase()) {
      case 'house':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'apartment':
        return <Building className="h-5 w-5 text-green-500" />;
      case 'studio':
        return <Box className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {houses.map((house) => (
        <div
          key={house._id}
          className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => onHouseSelect(house)}
          style={{ height: '180px' }}
        >
          <div className="flex flex-col sm:flex-row h-full">
            <div className="relative sm:w-2/5 h-full">
              <img
                src={house.image ? `http://localhost:5000/uploads/${house.image}` : "/api/placeholder/400/300"}
                alt={`${house.address}, ${house.city}`}
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Added to favorites:', house._id);
                }}
              >
                <Heart className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:w-3/5 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{house.title}</h3>
                  {house.typeOfHousing && (
                    <div className="flex items-center">
                      {getHousingTypeIcon(house.typeOfHousing)}
                      <span className="ml-1 text-sm text-gray-600 capitalize">{house.typeOfHousing}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{house.address}, {house.city}</p>
                <p className="text-gray-800 font-bold">${house.price.toLocaleString()} per month</p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="mr-2">{house.rooms} rooms</span>
                  <span className="mr-2">{house.bedrooms} bedrooms</span>
                  <span>{house.area} m²</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">{house.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HouseListings;