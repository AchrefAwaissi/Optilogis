import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faSignOutAlt,
  faHeart,
  faBell,
  faSignInAlt,
  faUserPlus,
  faMapMarkerAlt,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import logo from "../image/logoa.png"; // Ensure the path is correct
import axios from 'axios';

interface User {
  username: string;
  profilePhotoPath: string;
}

interface HorizontalNavbarProps {
  user: User | null;
  onLogout: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onFavoritesToggle: () => void;
  showFavorites: boolean;
  onFilterChange: (filter: { location?: string; typeOfHousing?: string }) => void; // Added onFilterChange
  onLocationSelect: (location: { location: string; lat: number; lon: number }) => void; // Added onLocationSelect
}

interface Suggestion {
  label: string;
  lat: string;
  lon: string;
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({
  user,
  onLogout,
  onSignInClick,
  onSignUpClick,
  onFavoritesToggle,
  showFavorites,
  onFilterChange,
  onLocationSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleLogoutClick = () => {
    closeDropdown();
    onLogout();
  };

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationSearch(value); // Update local state
    onFilterChange({ location: value }); // Update location filter

    if (value.length > 2) {
      try {
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/`, {
          params: {
            q: value,
            limit: 5,
          },
        });
        const formattedSuggestions = response.data.features.map((item: any) => ({
          label: item.properties.label,
          lat: item.geometry.coordinates[1],
          lon: item.geometry.coordinates[0],
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Trigger search on Enter key
      if (locationSearch) {
        onFilterChange({ location: locationSearch });
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onFilterChange({ location: suggestion.label }); // Update location filter
    onLocationSelect({
      location: suggestion.label,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setLocationSearch(suggestion.label); // Update the search field with selected suggestion
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const NavLinks = () => (
    <>
      <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Home
      </Link>
      <Link to="/publish" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Publish
      </Link>
      <Link to="/manage-items" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        My items
      </Link>
      <Link to="/search" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Search
      </Link>
      <Link to="/matching" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Matching
      </Link>
    </>
  );

  const MobileNavbar = () => (
    <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50 lg:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block mt-4 text-gray-800 hover:text-blue-600 mr-4">
            Home
          </Link>
          <div className="flex flex-col mt-2">
            <button
              onClick={onSignInClick}
              className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm mb-2"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-1 text-[#095550]" />
              Sign In
            </button>
            <button
              onClick={onSignUpClick}
              className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm"
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-1 text-[#095550]" />
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );

  const FullNavbar = () => (
    <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain lg:hidden" />
            <div className="text-xl font-semibold text-gray-800 ml-2">
              Bienvenue, {user?.username}
            </div>
          </div>

          <div className="hidden lg:flex flex-grow justify-center mx-4">
            <div className="relative">
              <input
                type="text"
                value={locationSearch}
                onChange={handleLocationChange}
                onKeyPress={handleKeyPress} // Add key press event
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
                placeholder="Rechercher une ville ou une adresse"
                style={{ borderRadius: '7px' }}
                onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
              />
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
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
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-800 hover:text-blue-600 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                    <button
                      onClick={onFavoritesToggle}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                    >
                      {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={onSignInClick}
                  className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-1 text-[#095550]" />
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1 text-[#095550]" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <>
      <MobileNavbar />
      <FullNavbar />
    </>
  );
};

export default HorizontalNavbar;
