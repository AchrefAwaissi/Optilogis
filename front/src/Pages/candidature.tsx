import React from 'react';
import { useLocation, Link } from 'react-router-dom';
 
const Candidature: React.FC = () => {
  const location = useLocation();
  const isPremium = location.state?.isPremium;
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Félicitations !</h1>
        {isPremium ? (
          <p className="text-xl mb-6">Vous êtes maintenant un utilisateur premium !</p>
        ) : (
          <p className="text-xl mb-6">Votre candidature a été soumise avec succès !</p>
        )}
        <p className="text-gray-600 mb-8">
          Nous avons bien reçu votre candidature et nous vous contacterons bientôt pour la suite du processus.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};
 
export default Candidature;