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
  const [isOpen, setIsOpen] = useState(false);

  const iconClass = (path: string): string =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
      activeIcon === path
        ? "bg-white text-blue-600 shadow-md"
        : "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700"
    }`;

  const navItemClass = (path: string): string =>
    `flex items-center w-full px-4 py-3 transition-all duration-300 ${
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
    <nav
      className={`hidden md:flex bg-gradient-to-b from-blue-50 to-blue-100 h-screen shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex-col`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex justify-center py-6 bg-blue-100">
        <img src={logo} alt="Logo" className="w-12 h-12 object-contain transition-all duration-300" />
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
            <span className={`ml-4 font-medium ${isOpen ? "" : "hidden"}`}>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-6">
        <button
          onClick={onAuthClick}
          className={`w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300`}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className={`${isOpen ? "mr-2" : ""}`} />
          <span className={isOpen ? "" : "hidden"}>Sign In / Sign Up</span>
        </button>
      </div>
    </nav>
  );
};

export default VerticalIconNavbar;