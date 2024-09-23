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

interface User {
  username: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
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
  const { user, signout } = useAuth();

  const handleAuthSuccess = (userData: User) => {
    // This might not be necessary if your AuthContext handles user state
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

  return (
    <Router>
      <ItemProvider>
        <div className="flex h-screen overflow-hidden">
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
            />

            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<HomePage showFavorites={showFavorites} />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/property-details" element={<PropertyDetails />} />

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