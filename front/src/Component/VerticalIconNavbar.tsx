// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faSearch,
//   faDollarSign,
//   faUserGroup,
//   faHome,
//   faChartBar,
//   faCog,
//   faSignOutAlt,
//   faBell,
//   faUser,
//   faBars
// } from '@fortawesome/free-solid-svg-icons';

// const TopNavbar: React.FC = () => {
//   const location = useLocation();
//   const [activeIcon, setActiveIcon] = useState(location.pathname);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const iconClass = (path: string) =>
//     `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
//       activeIcon === path
//         ? 'bg-[#006845] text-white'
//         : 'bg-transparent text-gray-400 hover:text-gray-600'
//     }`;

//   const menuItems = [
//     { icon: faDollarSign, label: 'Home', path: '/' },
//     { icon: faUserGroup, label: 'Colocation', path: '/matching' },
//     { icon: faHome, label: 'Rent', path: '/search' },
//     { icon: faChartBar, label: 'Compare', path: '/compare' },
//     { icon: faCog, label: 'Settings', path: '/settings' },
//   ];

//   return (
//     <>
//       {/* Top Navbar */}
//       <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <button 
//                   onClick={() => setIsDrawerOpen(!isDrawerOpen)}
//                   className="mr-2 text-gray-500 hover:text-gray-700"
//                 >
//                   <FontAwesomeIcon icon={faBars} />
//                 </button>
//                 <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center">
//                   <span className="text-xs font-bold">LOGO</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <button className="text-gray-600 hover:text-gray-800 px-3">
//                   <FontAwesomeIcon icon={faBell} className="text-xl" />
//                 </button>
//               </div>
//               <div className="ml-3 relative">
//                 <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                   <FontAwesomeIcon icon={faUser} className="text-gray-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Side Drawer */}
//       <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
//         <div className="h-full flex flex-col">
//           <div className="p-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
//               />
//               <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>

//           <nav className="flex-1">
//             <p className="px-4 py-2 text-sm font-semibold text-gray-500">Menu</p>
//             <ul>
//               {menuItems.map((item, index) => (
//                 <li key={index}>
//                   <Link
//                     to={item.path}
//                     className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100"
//                     onClick={() => {
//                       setActiveIcon(item.path);
//                       setIsDrawerOpen(false);
//                     }}
//                   >
//                     <div className={iconClass(item.path)}>
//                       <FontAwesomeIcon icon={item.icon} className="text-lg" />
//                     </div>
//                     <span className="ml-3">{item.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           <div className="p-4">
//             <button className="w-full flex items-center justify-center px-4 py-2 bg-[#006845] text-white rounded-md hover:bg-[#005536]">
//               <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
//               Login / Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Overlay to close drawer when clicking outside */}
//       {isDrawerOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsDrawerOpen(false)}
//         ></div>
//       )}

//       {/* Main Content Area */}
//       <main className="pt-16">
//         {/* Your Filter, Map, and HouseListings components will go here */}
//       </main>
//     </>
//   );
// };

// export default TopNavbar;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faUserGroup,
  faHome,
  faChartBar,
  faCog,
  faSignOutAlt,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const VerticalIconNavbar: React.FC = () => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);

  const iconClass = (path: string) =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
      activeIcon === path
        ? 'bg-[#006845] text-white'
        : 'bg-transparent text-gray-400 hover:text-gray-600'
    }`;

  const navItemClass = (path: string) =>
    `flex items-center w-full px-4 py-3 transition-all duration-200 ${
      activeIcon === path
        ? 'text-[#006845]'
        : 'text-gray-600 hover:text-[#006845]'
    }`;

  const menuItems = [
    { icon: faDollarSign, label: 'Home', path: '/' },
    { icon: faUserGroup, label: 'Colocation', path: '/publish' },
    { icon: faHome, label: 'Rent', path: '/search' },
    { icon: faChartBar, label: 'Compare', path: '/compare' },
    { icon: faCog, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="flex justify-center py-4">
        <div className="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center">
          <span className="text-xs font-bold">LOGO</span>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4">
  <button className="w-12 flex items-center justify-center px-4 py-2 bg-[#006845] text-white rounded-md hover:bg-[#005536]">
    <FontAwesomeIcon 
      icon={faSignOutAlt} 
    />
  </button>
</div>

    </nav>
  );
};

export default VerticalIconNavbar;