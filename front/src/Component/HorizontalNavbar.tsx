import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../image/logoa.png";

interface User {
  username: string;
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
        <Link to="/settings" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
          Settings
        </Link>
      )}
    </>
  );

  return (
    <nav className={`bg-white shadow-md ${user ? 'block' : 'lg:hidden'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain transition-all duration-300" />
          </div>
          <div className="hidden lg:block">
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLinks />
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            {user && (
              <div className="ml-4 flex items-center md:ml-6">
                <span className="text-gray-800 mr-2">Welcome, {user.username}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
    <NavLinks />
  </div>
  <div className="pt-4 pb-3 border-t border-gray-200">
    {user ? (
      <div className="flex items-center px-5">
        <div className="ml-3">
          <div className="text-base font-medium leading-none text-gray-800">Welcome, {user.username}</div>
        </div>
        <button
          onClick={onLogout}
          className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    ) : (
      <div className="mt-3 px-2 space-y-2">
        <button
          onClick={onSignInClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </button>
        <button
          onClick={onSignUpClick}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </div>
    )}
  </div>
</div>
    </nav>
  );
};

export default HorizontalNavbar;