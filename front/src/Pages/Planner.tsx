import React, { useState, useRef } from 'react';
import axios from 'axios';

const SpacelyFurniturePlacement: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('sk-6B2mqnjJ2OnbiijddlicX0EqPnE');
  const [roomImageUrl, setRoomImageUrl] = useState<string>('');
  const [productImageUrl, setProductImageUrl] = useState<string>('');
  const [placement, setPlacement] = useState({ x: 582, y: 294, w: 81, h: 135 });
  const [area, setArea] = useState({ x: 0, y: 0, w: 10, h: 10 });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const roomImageRef = useRef<HTMLInputElement>(null);
  const productImageRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string> => {
    // Simule le téléchargement d'une image et retourne une URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, setImageUrl: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setImageUrl(url);
    }
  };

  const handlePlaceFurniture = async () => {
    if (!roomImageUrl || !productImageUrl) {
      setError("Veuillez télécharger les deux images avant de continuer.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const payload = {
      imageUrl: roomImageUrl,
      productImageUrl: productImageUrl,
      placement,
      area
    };

    try {
      const response = await axios.post(
        'https://api.spacely.ai/api/v1/generate/furniture-placement',
        payload,
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponse(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 402) {
          setError("Erreur de paiement : Veuillez vérifier votre abonnement ou vos crédits disponibles.");
        } else {
          setError(`Erreur: ${err.response?.status} - ${err.response?.statusText}`);
        }
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Placement de meubles Spacely AI</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Clé API:</label>
        <input 
          type="text" 
          value={apiKey} 
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Image de la pièce:</label>
        <input 
          type="file" 
          onChange={(e) => handleImageChange(e, setRoomImageUrl)}
          ref={roomImageRef}
          className="hidden" 
        />
        <button 
          onClick={() => roomImageRef.current?.click()} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Télécharger l'image de la pièce
        </button>
        {roomImageUrl && <img src={roomImageUrl} alt="Room" className="mt-2 max-w-xs" />}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Image du produit:</label>
        <input 
          type="file" 
          onChange={(e) => handleImageChange(e, setProductImageUrl)}
          ref={productImageRef}
          className="hidden" 
        />
        <button 
          onClick={() => productImageRef.current?.click()} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Télécharger l'image du produit
        </button>
        {productImageUrl && <img src={productImageUrl} alt="Product" className="mt-2 max-w-xs" />}
      </div>

      {/* Placement and Area inputs (same as before) */}

      <button 
        onClick={handlePlaceFurniture} 
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Placer le meuble
      </button>
      
      {loading && <p className="mt-4">Chargement en cours...</p>}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          {error.includes("Erreur de paiement") && (
            <p className="mt-2">
              Veuillez vérifier votre compte Spacely AI et vous assurer que vous avez suffisamment de crédits ou que votre abonnement est actif.
              <a href="https://spacely.ai/pricing" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                Voir les options d'abonnement
              </a>
            </p>
          )}
        </div>
      )}
      
      {response && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Réponse de l'API:</h3>
          <div className="mt-2 max-h-60 overflow-y-auto bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpacelyFurniturePlacement;