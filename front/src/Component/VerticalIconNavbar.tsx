import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUserGroup,
  faHome,
  faChartBar,
  faCog,
  faSignOutAlt,
  faSearch,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../image/logoa.png";

interface MenuItem {
  icon: IconDefinition;
  label: string;
  path: string;
}

interface VerticalIconNavbarProps {
  onAuthClick: () => void;
}

const VerticalIconNavbar: React.FC<VerticalIconNavbarProps> = ({ onAuthClick }) => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState<string>(location.pathname);

  const iconClass = (path: string): string =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
      activeIcon === path
        ? "bg-white text-blue-600 shadow-md"
        : "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700"
    }`;

  const navItemClass = (path: string): string =>
    `flex items-center w-full px-6 py-3 transition-all duration-300 ${
      activeIcon === path
        ? "bg-blue-100 text-blue-700"
        : "text-blue-600 hover:bg-blue-50 hover:text-blue-800"
    }`;

  const menuItems: MenuItem[] = [
    { icon: faDollarSign, label: "Home", path: "/" },
    { icon: faUserGroup, label: "Colocation", path: "/publish" },
    { icon: faHome, label: "Rent", path: "/search" },
    { icon: faChartBar, label: "Compare", path: "/compare" },
    { icon: faCog, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="w-64 bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col h-screen shadow-lg">
      <div className="flex justify-center py-6 bg-blue-100">
        <img src={logo} alt="Logo" className="w-36 h-24 object-contain" />
      </div>
      <div className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-800 placeholder-blue-300"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={navItemClass(item.path)}
            onClick={() => setActiveIcon(item.path)}
          >
            <div className={iconClass(item.path)}>
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
            </div>
            <span className="ml-4 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-6">
        <button
          onClick={onAuthClick}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span>Sign In / Sign Up</span>
        </button>
      </div>
    </nav>
  );
};

export default VerticalIconNavbar;