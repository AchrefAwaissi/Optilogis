import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faChevronDown,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FilterCriteria, Location } from '../types';

interface PropertyFilterProps {
  onFilterChange: (criteria: Partial<FilterCriteria>) => void;
  onLocationSelect: (location: Location) => void;
  filterCriteria: FilterCriteria;
}

interface Suggestion {
  label: string;
  lat: string;
  lon: string;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilterChange, onLocationSelect, filterCriteria }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({ location: value });

    if (value.length > 2) {
      try {
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/`, {
          params: {
            q: value,
            limit: 5
          }
        });
        const formattedSuggestions = response.data.features.map((item: any) => ({
          label: item.properties.label,
          lat: item.geometry.coordinates[1],
          lon: item.geometry.coordinates[0]
        }));
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onFilterChange({ location: suggestion.label });
    onLocationSelect({
      location: suggestion.label,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleTypeOfPlaceChange = (type: FilterCriteria['typeOfHousing']) => {
    if (type === '') {
      // Si 'All' est sélectionné, on réinitialise le filtre de type
      onFilterChange({ typeOfHousing: '' });
    } else {
      // Sinon, on bascule la sélection du type
      onFilterChange({ 
        typeOfHousing: filterCriteria.typeOfHousing === type ? '' : type 
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ maxPrice: parseInt(e.target.value) });
  };

  return (
    <div className="flex flex-col h-screen bg-white w-64">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">Filter</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Location</h3>
          <div className="relative">
            <input
              type="text"
              value={filterCriteria.location}
              onChange={handleLocationChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
              placeholder="Enter city or address"
            />
            <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Type of Place</h3>
          <ul>
            {[
              { label: 'All', value: '' },
              { label: 'Studio', value: 'studio' },
              { label: 'Apartment', value: 'appartement' },
              { label: 'Maison', value: 'maison' }
            ].map((type) => (
              <li key={type.value}>
                <label className="flex items-center py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={type.value === '' ? filterCriteria.typeOfHousing === '' : filterCriteria.typeOfHousing === type.value}
                    onChange={() => handleTypeOfPlaceChange(type.value as FilterCriteria['typeOfHousing'])}
                    className="form-checkbox h-5 w-5 text-[#006845] rounded focus:ring-[#006845]"
                  />
                  <span className="ml-3">{type.label}</span>
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
            value={filterCriteria.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>$100</span>
            <span>${filterCriteria.maxPrice}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Size</h3>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                value={filterCriteria.minSize || ''}
                onChange={(e) => onFilterChange({ minSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={filterCriteria.maxSize || ''}
                onChange={(e) => onFilterChange({ maxSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Max"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Square meters</p>
        </div>
      </div>

      <div className="p-4">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-[#006845] text-white rounded-md hover:bg-[#005536]">
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilter;