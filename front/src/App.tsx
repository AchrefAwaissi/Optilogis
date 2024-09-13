import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CombinedNavbar from './Component/VerticalIconNavbar';
import HorizontalNavbar from './Component/HorizontalNavbar';
import HomePage from './Pages/HomePage';
import PublishPropertyPage from './Pages/PublishPropertyPage';
import SearchPage from './Pages/SearchPage';
import MatchingProfilePage from './Pages/MatchingProfilePage';
import SettingsPage from './Pages/SettingsPage';
import PropertyDetails from './Pages/PropertyDetails';
import AuthPopup from './Component/AuthPopup';

interface User {
  username: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuthPopup(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <CombinedNavbar onAuthClick={() => setShowAuthPopup(true)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoggedIn && user && (
            <HorizontalNavbar user={user} onLogout={handleLogout} />
          )}

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
      {showAuthPopup && (
        <AuthPopup
          onClose={() => setShowAuthPopup(false)}
          onLogin={handleLogin}
        />
      )}
    </Router>
  );
};

export default App;