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
import SignIn from './Component/SignIn';
import SignUp from './Component/SignUp';

interface User {
  username: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAuthClick = (signup: boolean = false) => {
    setIsSignUp(signup);
    setShowAuthModal(true);
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <CombinedNavbar onAuthClick={() => handleAuthClick(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HorizontalNavbar
            user={user}
            onLogout={handleLogout}
            onSignInClick={() => handleAuthClick(false)}
            onSignUpClick={() => handleAuthClick(true)}
          />

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
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          {isSignUp ? (
            <SignUp
              onClose={() => setShowAuthModal(false)}
              onToggleForm={toggleAuthMode}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <SignIn
              onClose={() => setShowAuthModal(false)}
              onToggleForm={toggleAuthMode}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      )}
    </Router>
  );
};

export default App;