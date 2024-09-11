import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../image/logoa.png";

interface User {
  username: string;
}

interface HorizontalNavbarProps {
  user: User;
  onLogout: () => void;
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto mr-4" />
          <span className="text-white text-xl font-semibold">Welcome, {user.username}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white hover:text-blue-200">Home</Link>
          <Link to="/publish" className="text-white hover:text-blue-200">Colocation</Link>
          <Link to="/search" className="text-white hover:text-blue-200">Rent</Link>
          <Link to="/compare" className="text-white hover:text-blue-200">Compare</Link>
          <Link to="/settings" className="text-white hover:text-blue-200">Settings</Link>
          <button onClick={onLogout} className="text-white hover:text-blue-200">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavbar;