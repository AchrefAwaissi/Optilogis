import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../image/house.png';
import Search from '../image/Group 238736.png';
import DollarIcon from '../image/dollar.png';
import ShareIcon from '../image/share.png';
import SettingsIcon from '../image/setting-2.png';
import PortalIcon from '../image/portal.png';
import MatchingIcon from '../image/percent.png'; 

const VerticalIconNavbar: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-16 h-screen bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col items-center pt-4">
        <Link to="/search" className="mb-8">
          <img src={Search} alt="Search" className="w-6 h-6" />
        </Link>
        <div className="text-sm font-medium mb-4">Menu</div>
        <div className="flex flex-col items-center space-y-6">
          <Link to="/" className="w-10 h-10 flex items-center justify-center">
            <img src={HomeIcon} alt="Home" className="w-6 h-6" />
          </Link>
          <Link to="/publish" className="w-10 h-10 flex items-center justify-center">
            <img src={ShareIcon} alt="Publish" className="w-6 h-6" />
          </Link>
          <Link to="/search" className="w-10 h-10 flex items-center justify-center">
            <img src={DollarIcon} alt="Search" className="w-6 h-6" />
          </Link>
          <Link to="/matching" className="w-10 h-10 flex items-center justify-center">
            <img src={MatchingIcon} alt="Matching" className="w-6 h-6" />
          </Link>
          <Link to="/settings" className="w-10 h-10 flex items-center justify-center">
            <img src={SettingsIcon} alt="Settings" className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <Link to="/portal" className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
          <img src={PortalIcon} alt="Portal" className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default VerticalIconNavbar;