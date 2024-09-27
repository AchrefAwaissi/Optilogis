import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
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
import Candidature from './Pages/candidature';
import ManageItems from './Component/ManageItemsPage';
import Planner from './Pages/Planner';
import StyleTransfer from './IA/StyleTransfer';
import SearchArticle from './IA/searchArticle';
import EmptyRoom from './IA/EmptyRoom';
import FurniturePlacement from './IA/FurniturePlacement';
import ColorChange from './IA/ColorChange';
import Contact from './Pages/Contact';

interface User {
  username: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
}

interface Location {
  location: string;
  lat: number;
  lon: number;
}   
// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { user, signout } = useAuth();

  const handleAuthSuccess = (userData: User) => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    signout();
  };

  const handleAuthClick = (signup: boolean = false) => {
    setIsSignUp(signup);
    setShowAuthModal(true);
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleFavoritesToggle = () => {
    setShowFavorites(!showFavorites);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // Cette fonction sera passée à la fois à HorizontalNavbar et à HomePage
  };

  return (
    <Router>
      <ItemProvider>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-[1920px] h-full max-h-[1080px] bg-white shadow-xl overflow-hidden">
            <div className="flex h-full">
              <CombinedNavbar
                onAuthClick={() => handleAuthClick(false)}
                isAuthenticated={!!user}
              />
              <div className="flex-1 flex flex-col overflow-hidden">
                <HorizontalNavbar
                  user={user}
                  onLogout={handleLogout}
                  onSignInClick={() => handleAuthClick(false)}
                  onSignUpClick={() => handleAuthClick(true)}
                  onFavoritesToggle={handleFavoritesToggle}
                  showFavorites={showFavorites}
                  onLocationSelect={handleLocationSelect}
                />

                <main className="flex-1 overflow-hidden">
                  <Routes>
                    <Route path="/" element={<HomePage 
                    showFavorites={showFavorites}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleLocationSelect}
                     />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/property-details" element={<PropertyDetails />} />
                    <Route path="/Planner" element={<Planner />} />
                    <Route path="/style-transfer" element={<StyleTransfer />} />
                    <Route path="/search-article" element={<SearchArticle />} />
                    <Route path="/furniture-placement" element={<FurniturePlacement />} />
                    <Route path="/empty-room" element={<EmptyRoom />} />
                    <Route path="/color-transfer" element={<ColorChange />}/>
                    <Route path="/contact" element={<Contact />}/>

                    {/* Protected Routes */}
                    <Route path="/publish" element={
                      <ProtectedRoute>
                        <PublishPropertyPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/matching" element={
                      <ProtectedRoute>
                        <MatchingProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/candidature/:itemId" element={
                      <ProtectedRoute>
                        <Candidature />
                      </ProtectedRoute>
                    } />
                    <Route path="/Planner" element={
                      <ProtectedRoute>
                        <Planner />
                      </ProtectedRoute>
                    } />
                    <Route path="/manage-items" element={
                      <ProtectedRoute>
                        <ManageItems />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
              </div>
            </div>
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
      </ItemProvider>
    </Router>
  );
};

const AppWithAuth: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;