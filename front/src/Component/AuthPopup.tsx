import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface User {
  username: string;
}

interface AuthPopupProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ onClose, onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSuccessfulAuth = (userData: User) => {
    onLogin(userData);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      {isSignIn ? (
        <SignIn onClose={onClose} onToggleForm={toggleForm} onSuccess={handleSuccessfulAuth} />
      ) : (
        <SignUp onClose={onClose} onToggleForm={toggleForm} onSuccess={handleSuccessfulAuth} />
      )}
    </div>
  );
};

export default AuthPopup;