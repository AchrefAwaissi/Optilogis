import React from "react";
import { House } from "../types";

interface HouseListingsProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
  city: string;
}

const truncateAddress = (address: string, maxLength: number) => {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};

const PropertyCard: React.FC<{ house: House; onClick: () => void }> = ({ house, onClick }) => {
  const truncatedAddress = truncateAddress(house.address, 30);

  // Use the first image from the array, or a placeholder if the array is empty
  const imageUrl = house.images && house.images.length > 0
    ? `http://localhost:5000/uploads/${house.images[0]}`
    : 'https://via.placeholder.com/165x155';

  return (
    <div
      className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg flex flex-col sm:flex-row"
      onClick={onClick}
    >
      <div
        className="w-full h-48 sm:w-40 sm:h-40 m-2 rounded-xl bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">{house.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{truncatedAddress}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">= {house.rooms || 'N/A'}</span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">= {house.bedrooms || 'N/A'}</span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">{house.area || 'N/A'} m²</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-teal-700">${house.price.toLocaleString()}/ mois</p>
          <button className="px-3 py-2 bg-blue-600 text-white text-sm font-normal rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
};

const HouseListings: React.FC<HouseListingsProps> = ({ houses, onHouseSelect, city }) => {
  console.log("HouseListings rendered with:", { housesCount: houses.length, city });

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4 self-start w-full">
        {houses.length} Résultats {city || "toutes les villes"}
      </h2>
      {houses.map((house) => (
        <PropertyCard
          key={house._id}
          house={house}
          onClick={() => onHouseSelect(house)}
        />
      ))}
    </div>
  );
};

export default HouseListings;