import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faChevronDown, 
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

const PropertyFilter: React.FC = () => {
  const handleLocationChange = () => {
    // To be implemented
  };

  const handleSuggestionClick = () => {
    // To be implemented
  };

  const handlePriceChange = () => {
    // To be implemented
  };

  const handleTypeOfPlaceChange = () => {
    // To be implemented
  };

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-64">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Filter</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Location</h3>
          <div className="relative">
            <input
              type="text"
              onChange={handleLocationChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
              placeholder="Scotland"
            />
            <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Suggestions list placeholder */}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Type of Place</h3>
          <ul>
            {['All', 'Office', 'Building', 'Shop', 'Apartment', 'House'].map((type) => (
              <li key={type}>
                <label className="flex items-center py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={handleTypeOfPlaceChange}
                    className="form-checkbox h-5 w-5 text-[#006845] rounded focus:ring-[#006845]"
                  />
                  <span className="ml-3">{type}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Price Range</h3>
          <input
            type="range"
            min="100"
            max="10000"
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>$100</span>
            <span>$10000</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Size</h3>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Max"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Square feet</p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-[#006845] text-white rounded-md hover:bg-[#005536]">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilter;