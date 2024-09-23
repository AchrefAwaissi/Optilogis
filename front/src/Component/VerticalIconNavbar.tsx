import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlus,
  faHome,
  faCube,
  faAddressBook,
  faCog,
  faSignOutAlt,
  IconDefinition,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../image/logoa.png";

interface MenuItem {
  icon: IconDefinition;
  label: string;
  path: string;
}

interface VerticalIconNavbarProps {
  onAuthClick: () => void;
  isAuthenticated: boolean; // Nouvelle prop pour gérer la connexion de l'utilisateur
}

const VerticalIconNavbar: React.FC<VerticalIconNavbarProps> = ({ onAuthClick, isAuthenticated }) => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState<string>(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const iconClass = (path: string): string =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeIcon === path
      ? "bg-white text-[#095550] shadow-md"
      : "bg-gray-100 text-[#095550] hover:bg-gray-200 hover:text-[#095550]"
    }`;

  const navItemClass = (path: string): string =>
    `flex items-center w-full px-4 py-3 transition-all duration-300 ${activeIcon === path
      ? "bg-gray-100 text-[#095550]"
      : "text-[#095550] hover:bg-gray-50 hover:text-[#095550]"
    }`;

  // Affiche uniquement "Add" et "Settings" si l'utilisateur est connecté
  const menuItems: MenuItem[] = [
    { icon: faHome, label: "Home", path: "/" },
    ...(isAuthenticated ? [{ icon: faPlus, label: "Add", path: "/publish" }] : []), // Condition pour afficher "Add"
    { icon: faCube, label: "3D", path: "/Planner" },
    ...(isAuthenticated ? [{ icon: faList, label: "My Items", path: "/manage-items" }] : []), // Condition pour afficher "My items"
    { icon: faAddressBook, label: "Contact", path: "/contact" },
    ...(isAuthenticated ? [{ icon: faCog, label: "Settings", path: "/settings" }] : []), // Condition pour afficher "Settings"
  ];

  return (
    <nav
      ref={navRef}
      className={`hidden md:flex bg-white h-screen shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        } flex-col`}
    >
      <div className="flex justify-center py-6 bg-white">
        <img src={logo} alt="Logo" className="w-24 h-30 object-contain transition-all duration-300" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={navItemClass(item.path)}
            onClick={() => {
              setActiveIcon(item.path);
              if (!isOpen) {
                toggleNavbar();
              }
            }}
          >
            <div className={iconClass(item.path)}>
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
            </div>
            <span className={`ml-4 font-medium ${isOpen ? "" : "hidden"}`}>{item.label}</span>
          </Link>
        ))}
      </div>
      {!isAuthenticated && (
        <div className="p-4">
          <button
            onClick={onAuthClick}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#095550] text-white rounded-lg hover:bg-[#073d3a] transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            <span className={isOpen ? "" : "hidden"}>Sign In</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default VerticalIconNavbar;