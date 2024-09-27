import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faChevronDown,
  faBuilding,
  faTimes,
  faFilter,
  faBed,
  faDoorOpen,
  faRulerCombined,
  faCouch,
  faWheelchair,
  faLayerGroup,
  faWarehouse
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
    onFilterChange({
      typeOfHousing: filterCriteria.typeOfHousing === type ? '' : type
    });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ minPrice: parseInt(e.target.value), maxPrice: filterCriteria.maxPrice });
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ maxPrice: parseInt(e.target.value), minPrice: filterCriteria.minPrice });
  };

  const handleRangeChange = (
    field: 'Size' | 'Rooms' | 'Bedrooms' | 'Floor' | 'AnnexArea',
    value: number,
    isMin: boolean
  ) => {
    if (value < 0) {
      return; 
    }
  
    const maxLimit = 10000; 
    if (value > maxLimit) {
      return; 
    }
  
    const fieldName = isMin ? `min${field}` : `max${field}`;
    onFilterChange({ [fieldName]: value });
  };
  
  

  const handleCheckboxChange = (field: keyof FilterCriteria) => {
    onFilterChange({ [field]: !filterCriteria[field] });
  };

  const handleAccessibilityChange = () => {
    onFilterChange({ accessibility: filterCriteria.accessibility ? '' : 'true' });
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
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
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
        pb-20
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
              placeholder="ville ou adresse"
              style={{ borderRadius: '7px' }}
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
                    className="form-checkbox h-5 w-5 rounded focus:ring-[#095550]" style={{ accentColor: '#095550', borderRadius: '7px' }}
                  />
                  <span className="ml-3">{type.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Fourchette de prix</h3>

        <div className="flex justify-between mb-2">
          <input
            type="number"
            min="100"
            max={filterCriteria.maxPrice || 15000}
            value={filterCriteria.minPrice || 100}
            onChange={handleMinPriceChange}
            className="w-1/2 mr-2 border border-gray-300 rounded-md p-1"
            placeholder="Prix minimum"
          />
          <input
            type="number"
            min={filterCriteria.minPrice || 100}
            max="15000"
            value={filterCriteria.maxPrice || 15000}
            onChange={handleMaxPriceChange}
            className="w-1/2 border border-gray-300 rounded-md p-1"
            placeholder="Prix maximum"
          />
        </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>100€</span>
            <span>{filterCriteria.maxPrice}€</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Surface habitable (m²)</h3>
          <div className="flex space-x-2">
            <input
              type="number"
              value={filterCriteria.minSize}
              onChange={(e) => handleRangeChange('Size', parseInt(e.target.value) || 0, true)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
              placeholder="Min"
            />
            <input
              type="number"
              value={filterCriteria.maxSize}
              onChange={(e) => handleRangeChange('Size', parseInt(e.target.value) || 0, false)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
              placeholder="Max"
            />
          </div>
        </div>

        <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Nombre de pièces</h3>
<div className="flex space-x-2">
  <input
    type="number"
    min="0" // Limiter à 0
    value={filterCriteria.minRooms || 0} 
    onChange={(e) => handleRangeChange('Rooms', parseInt(e.target.value) || 0, true)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Min"
  />
  <input
    type="number"
    min="0" 
    value={filterCriteria.maxRooms || 0} 
    onChange={(e) => handleRangeChange('Rooms', parseInt(e.target.value) || 0, false)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Max"
  />
</div>

        </div>

        <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Nombre de chambres</h3>
<div className="flex space-x-2">
  <input
    type="number"
    min="0" // Limiter à 0 pour éviter les valeurs négatives
    value={filterCriteria.minBedrooms || 0} // Assurez-vous que la valeur par défaut est 0
    onChange={(e) => handleRangeChange('Bedrooms', parseInt(e.target.value) || 0, true)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Min"
  />
  <input
    type="number"
    min="0" // Limiter à 0 pour éviter les valeurs négatives
    value={filterCriteria.maxBedrooms || 0} // Assurez-vous que la valeur par défaut est 0
    onChange={(e) => handleRangeChange('Bedrooms', parseInt(e.target.value) || 0, false)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Max"
  />
</div>

        </div>

        <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Étage</h3>
<div className="flex space-x-2">
  <input
    type="number"
    min="0" // Limiter à 0 pour éviter les valeurs négatives
    value={filterCriteria.minFloor || 0} // Assurez-vous que la valeur par défaut est 0
    onChange={(e) => handleRangeChange('Floor', parseInt(e.target.value) || 0, true)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Min"
  />
  <input
    type="number"
    min="0" // Limiter à 0 pour éviter les valeurs négatives
    value={filterCriteria.maxFloor || 0} // Assurez-vous que la valeur par défaut est 0
    onChange={(e) => handleRangeChange('Floor', parseInt(e.target.value) || 0, false)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Max"
  />
</div>

        </div>

        <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Surface annexe (m²)</h3>
<div className="flex space-x-2">
  <input
    type="number"
    min="0" // Limiter à 0 pour éviter les valeurs négatives
    value={filterCriteria.minAnnexArea || 0} // Assurez-vous que la valeur par défaut est 0
    onChange={(e) => handleRangeChange('AnnexArea', parseInt(e.target.value) || 0, true)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Min"
  />
  <input
    type="number"
    min="0" // Limiter à 0 pour éviter les valeurs négatives
    value={filterCriteria.maxAnnexArea || 0} // Assurez-vous que la valeur par défaut est 0
    onChange={(e) => handleRangeChange('AnnexArea', parseInt(e.target.value) || 0, false)}
    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006845]"
    placeholder="Max"
  />
</div>

        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Options</h3>
          <label className="flex items-center py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={filterCriteria.furnished}
              onChange={() => handleCheckboxChange('furnished')}
              className="form-checkbox h-5 w-5 rounded focus:ring-[#095550]"
              style={{ accentColor: '#095550' }}
            />
            <span className="ml-3">Meublé</span>
            <FontAwesomeIcon icon={faCouch} className="ml-2 text-gray-400" />
          </label>
          <label className="flex items-center py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={filterCriteria.accessibility !== ''}
              onChange={handleAccessibilityChange}
              className="form-checkbox h-5 w-5 rounded focus:ring-[#095550]"
              style={{ accentColor: '#095550' }}
            />
            <span className="ml-3">Accessible PMR</span>
            <FontAwesomeIcon icon={faWheelchair} className="ml-2 text-gray-400" />
          </label>
        </div>
      </div>
    </>
  );
};

export default PropertyFilter;