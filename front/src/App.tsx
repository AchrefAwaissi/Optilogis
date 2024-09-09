import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CombinedNavbar from './Component/VerticalIconNavbar';
import HomePage from './Pages/HomePage';
import PublishPropertyPage from './Pages/PublishPropertyPage';
import SearchPage from './Pages/SearchPage';
import MatchingProfilePage from './Pages/MatchingProfilePage';
import SettingsPage from './Pages/SettingsPage';
import PropertyDetails from './Pages/PropertyDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';


const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <CombinedNavbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006845]"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="text-gray-600 hover:text-gray-800 px-3">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
              </button>
              <div className="ml-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/publish" element={<PublishPropertyPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/matching" element={<MatchingProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/property-details" element={<PropertyDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;