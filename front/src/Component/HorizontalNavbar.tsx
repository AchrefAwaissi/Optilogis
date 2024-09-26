import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOutAlt, faHeart, faSearch, faBell, faSignInAlt, faUserPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import logo from "../image/logoa.png";
import { getApiUrl } from '../utils/url';

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
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ 
  user, 
  onLogout, 
  onSignInClick, 
  onSignUpClick,
  onFavoritesToggle,
  showFavorites 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleSettingsClick = () => {
    closeDropdown();
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    closeDropdown();
    onLogout();
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

  // Mobile navbar for non-logged in users
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

  // Full navbar for logged in users (both mobile and PC)
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
            <div className="flex items-center bg-gray-100 rounded-lg w-full max-w-md h-10 px-3">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-lg mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none w-full text-gray-500 text-sm"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={onFavoritesToggle}
              className={`text-gray-500 hover:text-red-500 p-2 rounded flex items-center justify-center ${showFavorites ? 'text-red-500' : ''}`}
              aria-label="Favorites"
            >
              <FontAwesomeIcon icon={faHeart} className="text-[#095550]" />
            </button>
            <FontAwesomeIcon icon={faBell} className="text-gray-500 text-xl cursor-pointer" />
            <div className="relative" ref={dropdownRef}>
              <img 
                src={user?.profilePhotoPath || '/default-avatar.png'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover cursor-pointer" 
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLinks />
          <div className="flex items-center bg-gray-100 rounded-lg w-full h-10 px-3 mt-2">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-lg mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-gray-500 text-sm"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={onFavoritesToggle}
              className={`text-gray-500 hover:text-red-500 p-2 rounded flex items-center justify-center ${showFavorites ? 'text-red-500' : ''}`}
              aria-label="Favorites"
            >
              <FontAwesomeIcon icon={faHeart} className="text-[#095550]" />
            </button>
            <FontAwesomeIcon icon={faBell} className="text-gray-500 text-xl cursor-pointer" />
            <img src={getApiUrl(user?.profilePhotoPath) || '/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            <button
              onClick={handleSettingsClick}
              className="text-gray-500 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
            <button
              onClick={handleLogoutClick}
              className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-1 text-[#095550]" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );

  return user ? <FullNavbar /> : <MobileNavbar />;
};

export default HorizontalNavbar;