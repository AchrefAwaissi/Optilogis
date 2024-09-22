import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Item {
    _id: string;
    name: string;
    description: string;
    price: number;
    address: string;
    city: string;
    country: string;
    images: string[];
    userId: string;
    latitude?: number;
    longitude?: number;
  }

const Candidature: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const isPremium = location.state?.isPremium;
  const [dossierUrl, setDossierUrl] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Item>(`http://localhost:5000/item/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItem(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des informations de l\'item', err);
        setError('Impossible de charger les informations de l\'item');
      }
    };

    if (itemId) {
      fetchItem();
    } else {
      setError('Identifiant de l\'item manquant');
    }
  }, [itemId]);

  const isValidDossierFacileUrl = (url: string) => {
    const regex = /^https:\/\/locataire\.dossierfacile\.logement\.gouv\.fr\/file\/[a-f0-9-]{36}$/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!isValidDossierFacileUrl(dossierUrl)) {
      setError("L'URL du dossier n'est pas valide. Veuillez entrer une URL DossierFacile correcte.");
      setIsSubmitting(false);
      return;
    }

    if (!item) {
      setError("Impossible d'identifier l'item.");
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      setError("Vous devez être connecté pour soumettre un dossier.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const payload = { 
        userId: user.id, // Utilisez l'ID de l'utilisateur du contexte d'authentification
        dossierFacileUrl: dossierUrl,
        ownerIds: [item.userId]
      };

      console.log('Payload being sent:', payload);

      const response = await axios.post(
        'http://localhost:5000/dossiers', 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response received:', response.data);

      navigate('/success', { state: { urlSubmitted: true } });
    } catch (err) {
      console.error('Error details:', err);
      if (axios.isAxiosError(err)) {
        console.error('Response data:', err.response?.data);
        setError(`Erreur: ${err.response?.status} ${err.response?.statusText}`);
      } else {
        setError('Une erreur est survenue lors de la soumission du dossier. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Félicitations !</h1>
        {isPremium ? (
          <p className="text-xl mb-6">Vous êtes maintenant un utilisateur premium !</p>
        ) : (
          <p className="text-xl mb-6">Votre candidature a été soumise avec succès !</p>
        )}
        <p className="text-gray-600 mb-8">
          Nous avons bien reçu votre candidature. Vous pouvez maintenant ajouter le lien vers votre dossier DossierFacile.
        </p>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="url"
            value={dossierUrl}
            onChange={(e) => setDossierUrl(e.target.value)}
            placeholder="https://locataire.dossierfacile.logement.gouv.fr/file/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien du dossier'}
          </button>
        </form>

        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 inline-block"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Candidature;