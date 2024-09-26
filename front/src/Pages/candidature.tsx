import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faSpinner, faHome, faCoins, faInfoCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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

interface LocationState {
  isPremium?: boolean;
}

const Candidature: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const { isPremium } = location.state as LocationState || {};
  const [dossierUrl, setDossierUrl] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token d\'authentification non trouvé');
        }
        const response = await axios.get<Item>(`http://13.49.240.163/item/${itemId}`, {
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

    if (!isPremium) {
      navigate('/');
    }
  }, [itemId, isPremium, navigate]);

  const isValidDossierFacileUrl = (url: string) => {
    const regex = /^https:\/\/locataire\.dossierfacile\.logement\.gouv\.fr\/file\/[a-f0-9-]{36}$/;
    return regex.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setDossierUrl(url);
    setIsUrlValid(isValidDossierFacileUrl(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!isUrlValid) {
      setError("L'URL du dossier n'est pas valide. Veuillez entrer une URL DossierFacile correcte.");
      setIsSubmitting(false);
      return;
    }

    if (!item) {
      setError("Impossible d'identifier le bien immobilier.");
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
        userId: user.id,
        dossierFacileUrl: dossierUrl,
        ownerIds: [item.userId]
      };

      await axios.post(
        'http://13.49.240.163/dossiers', 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissionSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status} ${err.response?.data.message || err.response?.statusText}`);
      } else {
        setError('Une erreur est survenue lors de la soumission du dossier. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-[#095550] mb-4" />
          <h1 className="text-3xl font-bold text-[#095550] mb-4">Candidature envoyée !</h1>
          <p className="text-xl mb-6">Votre dossier a été soumis avec succès.</p>
          <p className="text-gray-700 mb-6">
            Le propriétaire examinera votre candidature et vous contactera prochainement.
          </p>
          <Link
            to="/"
            className="bg-[#095550] hover:bg-[#074440] text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#095550] mb-4 text-center">Candidature</h1>
        
        {item && (
          <div className="mb-6 text-center">
            <FontAwesomeIcon icon={faHome} className="text-4xl text-[#095550] mb-2" />
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600">{item.address}, {item.city}</p>
            <p className="text-lg font-bold mt-2 flex items-center justify-center">
              <FontAwesomeIcon icon={faCoins} className="text-[#095550] mr-2" />
              €{item.price}/mois
            </p>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="flex items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-2 mt-1" />
            <span>
              Pour finaliser votre candidature, vous devez fournir un lien vers votre dossier DossierFacile. 
              {!showDetails && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="text-blue-600 hover:underline ml-1 focus:outline-none"
                >
                  Afficher plus
                  <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
                </button>
              )}
            </span>
          </p>
          {showDetails && (
            <div className="mt-2">
              <p>Si vous n'avez pas encore de dossier, suivez ces étapes :</p>
              <ol className="list-decimal list-inside mt-2 ml-5">
                <li>Rendez-vous sur <a href="https://www.dossierfacile.logement.gouv.fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DossierFacile</a></li>
                <li>Créez un compte</li>
                <li>Soumettez vos documents</li>
                <li>Une fois validé, vous recevrez un lien à utiliser ci-dessous</li>
              </ol>
              <button
                onClick={() => setShowDetails(false)}
                className="text-blue-600 hover:underline mt-2 focus:outline-none"
              >
                Afficher moins
                <FontAwesomeIcon icon={faChevronUp} className="ml-1" />
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="dossierUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Lien DossierFacile
            </label>
            <input
              id="dossierUrl"
              type="url"
              value={dossierUrl}
              onChange={handleUrlChange}
              placeholder="https://locataire.dossierfacile.logement.gouv.fr/file/..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isUrlValid ? 'border-[#095550] focus:ring-[#095550]' : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {dossierUrl && (
              <p className={`text-sm mt-1 ${isUrlValid ? 'text-[#095550]' : 'text-red-500'}`}>
                {isUrlValid ? (
                  <><FontAwesomeIcon icon={faCheckCircle} /> URL valide</>
                ) : (
                  <><FontAwesomeIcon icon={faExclamationTriangle} /> URL non valide</>
                )}
              </p>
            )}
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded transition duration-300 ${
              isSubmitting || !isUrlValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#095550] hover:bg-[#074440] text-white font-bold'
            }`}
            disabled={isSubmitting || !isUrlValid}
          >
            {isSubmitting ? (
              <><FontAwesomeIcon icon={faSpinner} spin /> Envoi en cours...</>
            ) : (
              'Envoyer ma candidature'
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/"
            className="text-[#095550] hover:text-[#074440] font-medium"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Candidature;