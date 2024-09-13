import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from "../image/logoa.png";

interface User {
  username: string;
}

interface HorizontalNavbarProps {
  user: User;
  onLogout: () => void;
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ user, onLogout }) => {
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
        Colocation
      </Link>
      <Link to="/search" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Rent
      </Link>
      <Link to="/compare" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Compare
      </Link>
      <Link to="/settings" className="block mt-4 lg:inline-block lg:mt-0 text-gray-800 hover:text-blue-600 mr-4">
        Settings
      </Link>
    </>
  );

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-shrink-0 text-gray-800 mr-6">
            <img src={logo} alt="Logo" className="h-10 w-auto mr-4" />
            <span className="text-xl font-semibold">Welcome, {user.username}</span>
          </div>
          <div className="block lg:hidden">
            <button
              onClick={toggleMenu}
              className="flex items-center px-3 py-2 border rounded text-gray-800 border-gray-400 hover:text-blue-600 hover:border-blue-600"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
          </div>
          <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`}>
            <div className="text-sm lg:flex-grow">
              <NavLinks />
            </div>
            <div>
              <button 
                onClick={onLogout} 
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-gray-800 border-gray-400 hover:border-blue-600 hover:text-blue-600 hover:bg-white mt-4 lg:mt-0"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavbar;