import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOutAlt, faHeart, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import logo from "../image/logoa.png";

interface User {
  username: string;
  profilePhotoPath: string;
}

interface HorizontalNavbarProps {
  user: User | null;
  onLogout: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ user, onLogout, onSignInClick, onSignUpClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFavoritesClick = () => {
    console.log('Afficher les annonces favorites');
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Home
      </Link>
      <Link to="/publish" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Publish
      </Link>
      <Link to="/search" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Search
      </Link>
      <Link to="/matching" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Matching
      </Link>
      {user && (
        <>
          <Link to="/settings" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
            Settings
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      {user && (
        <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="lg:hidden">
                  <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <div className="hidden lg:block text-xl font-semibold text-gray-800">
                  Bienvenue, {user.username}
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
                  onClick={handleFavoritesClick}
                  className="text-gray-500 hover:text-red-500 p-2 rounded flex items-center justify-center"
                  aria-label="Favorites"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-[#095550]" />
                </button>
                <FontAwesomeIcon icon={faBell} className="text-gray-500 text-xl cursor-pointer" />
                <img src={user.profilePhotoPath || '/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <button
                  onClick={onLogout}
                  className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-1 text-[#095550]" />
                  Logout
                </button>
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

          <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
                  onClick={handleFavoritesClick}
                  className="text-gray-500 hover:text-red-500 p-2 rounded flex items-center justify-center"
                  aria-label="Favorites"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-[#095550]" />
                </button>
                <FontAwesomeIcon icon={faBell} className="text-gray-500 text-xl cursor-pointer" />
                <img src={user.profilePhotoPath || '/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <button
                  onClick={onLogout}
                  className="bg-black-500 hover:text-blue-600 text-black py-1 px-2 rounded flex items-center text-sm"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-1 text-[#095550]" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default HorizontalNavbar;


