import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouseChimney,
  faSearch,
  faDollarSign,
  faShareNodes,
  faGear,
  faUserGroup,
  faDoorOpen
} from '@fortawesome/free-solid-svg-icons';

const VerticalIconNavbar: React.FC = () => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);

  const iconClass = (path: string, isLastIcon: boolean = false) =>
    `w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
      activeIcon === path 
        ? 'bg-[#006845] text-white' 
        : `bg-transparent ${isLastIcon ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`
    }`;

  return (
    <div className="flex flex-col items-center w-16 h-screen bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col items-center pt-4">
        <Link to="/search" className="mb-8" onClick={() => setActiveIcon('/search')}>
          <div className={iconClass('/search')}>
            <FontAwesomeIcon icon={faSearch} className="text-base" /> {/* Ajustement de la taille de l'icône */}
          </div>
        </Link>
        <div className="text-sm font-medium mb-4">Menu</div>
        <div className="flex flex-col items-center space-y-6">
          <Link to="/" onClick={() => setActiveIcon('/')}>
            <div className={iconClass('/')}>
              <FontAwesomeIcon icon={faHouseChimney} className="text-base" /> {/* Ajustement de la taille de l'icône */}
            </div>
          </Link>
          <Link to="/publish" onClick={() => setActiveIcon('/publish')}>
            <div className={iconClass('/publish')}>
              <FontAwesomeIcon icon={faShareNodes} className="text-base" /> {/* Ajustement de la taille de l'icône */}
            </div>
          </Link>
          <Link to="/matching" onClick={() => setActiveIcon('/matching')}>
            <div className={iconClass('/matching')}>
            <FontAwesomeIcon icon={faDollarSign} className="fa-solid fa-house-chimney-heart" />
            </div>
          </Link>
          <Link to="/matching" onClick={() => setActiveIcon('/matching')}>
            <div className={iconClass('/matching')}>
              <FontAwesomeIcon icon={faUserGroup} className="text-base" /> {/* Ajustement de la taille de l'icône */}
            </div>
          </Link>
          <Link to="/settings" onClick={() => setActiveIcon('/settings')}>
            <div className={iconClass('/settings')}>
              <FontAwesomeIcon icon={faGear} className="text-base" /> {/* Ajustement de la taille de l'icône */}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <Link to="/portal" onClick={() => setActiveIcon('/portal')}>
          <div className={iconClass('/portal', true)}>
            <FontAwesomeIcon icon={faDoorOpen} className="text-base" /> {/* Ajustement de la taille de l'icône */}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VerticalIconNavbar;
