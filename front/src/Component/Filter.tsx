import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faChevronDown,
  faBuilding,
  faTimes,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FilterCriteria, Location } from '../types';

interface PropertyFilterProps {
  onFilterChange: (criteria: Partial<FilterCriteria>) => void;
  onLocationSelect: (location: Location) => void;
  filterCriteria: FilterCriteria;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface Suggestion {
  label: string;
  lat: string;
  lon: string;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({
  onFilterChange,
  onLocationSelect,
  filterCriteria,
  isOpen = false,
  onToggle
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(isOpen);

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
        console.error('Erreur lors de la récupération des suggestions de localisation:', error);
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
      onFilterChange({ typeOfHousing: '' });
    } else {
      onFilterChange({ 
        typeOfHousing: filterCriteria.typeOfHousing === type ? '' : type 
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ maxPrice: parseInt(e.target.value) });
  };

  const toggleFilter = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsFilterOpen(!isFilterOpen);
    }
  };

  return (
    <>
      {!onToggle && (
        <div className="md:hidden">
          <button 
            onClick={toggleFilter}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50"
          >
            <FontAwesomeIcon icon={isFilterOpen ? faTimes : faFilter} />
          </button>
        </div>
      )}

      <div className={`
        ${onToggle ? '' : 'fixed inset-0 bg-white z-40'}
        overflow-y-auto transition-transform duration-300 ease-in-out
        md:relative md:inset-auto md:block md:bg-transparent
        ${onToggle ? '' : isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {!onToggle && (
          <div className="p-4 md:sticky md:top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">Filtres</h2>
            <button onClick={toggleFilter} className="md:hidden absolute top-4 right-4 text-gray-500">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Localisation</h3>
          <div className="relative">
            <input
              type="text"
              value={filterCriteria.location}
              onChange={handleLocationChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
              placeholder="Entrez une ville ou une adresse"
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
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Type de logement</h3>
          <ul>
            {[
              { label: 'Tous', value: '' },
              { label: 'Studio', value: 'studio' },
              { label: 'Appartement', value: 'appartement' },
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
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Fourchette de prix</h3>
          <input
            type="range"
            min="100"
            max="10000"
            value={filterCriteria.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>100€</span>
            <span>{filterCriteria.maxPrice}€</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Superficie</h3>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                value={filterCriteria.minSize || ''}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  onFilterChange({ minSize: value });
                  if (filterCriteria.maxSize && value > filterCriteria.maxSize) {
                    onFilterChange({ maxSize: value });
                  }
                }}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={filterCriteria.maxSize || ''}
                onChange={(e) => {
                  const value = Math.max(filterCriteria.minSize || 0, parseInt(e.target.value) || 0);
                  onFilterChange({ maxSize: value });
                }}
                min={filterCriteria.minSize || 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Max"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Mètres carrés</p>
        </div>
      </div>
    </>
  );
};

export default PropertyFilter;