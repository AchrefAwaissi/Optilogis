import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faDollarSign,
  faUserGroup,
  faHome,
  faChartBar,
  faCog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const VerticalNavbar = () => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);

  const iconClass = (path: string) =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
      activeIcon === path 
        ? 'bg-[#006845] text-white' 
        : 'bg-transparent text-gray-400 hover:text-gray-600'
    }`;

  const menuItems = [
    { icon: faDollarSign, label: 'Home', path: '/' },
    { icon: faUserGroup, label: 'Colocation', path: '/matching' },
    { icon: faHome, label: 'Rent', path: '/search' },
    { icon: faChartBar, label: 'Compare', path: '/compare' },
    { icon: faCog, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-64">
      <div className="p-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gray-200 rounded-sm mx-auto"></div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <nav className="flex-1">
        <p className="px-4 py-2 text-sm font-semibold text-gray-500">Menu</p>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path} 
                className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100"
                onClick={() => setActiveIcon(item.path)}
              >
                <div className={iconClass(item.path)}>
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                </div>
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-[#006845] text-white rounded-md hover:bg-[#005536]">
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Login / Logout
        </button>
      </div>
    </div>
  );
};

export default VerticalNavbar;