import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

const CLOUD_NAME = 'dxynfkwzx';
// Configure Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUD_NAME
  }
});

interface Placement {
  x: number;
  y: number;
  w: number;
  h: number;
}

const FurniturePlacement: React.FC = () => {
  const [apiKey] = useState<string>('sk-iYiywwNzEzcDy-ZarW4fwNWscUs');
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [roomImagePublicId, setRoomImagePublicId] = useState<string>('');
  const [productImagePublicId, setProductImagePublicId] = useState<string>('');
  const [placement, setPlacement] = useState<Placement>({ x: 0, y: 0, w: 100, h: 100 });
  const [area, setArea] = useState<Placement>({ x: 0, y: 0, w: 300, h: 300 });
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (roomImagePublicId && productImagePublicId) {
      drawImages();
    }
  }, [roomImagePublicId, productImagePublicId, placement, area]);

  const drawImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const roomImg = new Image();
    roomImg.crossOrigin = "Anonymous";
    roomImg.onload = () => {
      canvas.width = roomImg.width;
      canvas.height = roomImg.height;
      ctx.drawImage(roomImg, 0, 0, canvas.width, canvas.height);

      const productImg = new Image();
      productImg.crossOrigin = "Anonymous";
      productImg.onload = () => {
        ctx.drawImage(productImg, placement.x, placement.y, placement.w, placement.h);
        
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(placement.x, placement.y, placement.w, placement.h);

        ctx.strokeStyle = 'green';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(area.x, area.y, area.w, area.h);
        ctx.setLineDash([]);
      };
      productImg.src = cld.image(productImagePublicId).toURL();
    };
    roomImg.src = cld.image(roomImagePublicId).toURL();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacement(prev => ({
      ...prev,
      x: Math.round(x),
      y: Math.round(y)
    }));
  };

  const handlePlacementChange = (key: keyof Placement, value: string) => {
    setPlacement(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const handleAreaChange = (key: keyof Placement, value: string) => {
    setArea(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const handleImageUpload = async (file: File, setImagePublicId: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const response = await axios.post<{ public_id: string }>(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      setImagePublicId(response.data.public_id);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
    }
  };

  const handleRoomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRoomImage(file);
      handleImageUpload(file, setRoomImagePublicId);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
      handleImageUpload(file, setProductImagePublicId);
    }
  };

  const handlePlaceFurniture = async () => {
    if (!roomImagePublicId || !productImagePublicId) {
      setError("Veuillez télécharger les images de la pièce et du produit avant de continuer.");
      return;
    }
  
    setLoading(true);
    setGenerating(true);
    setError(null);
    setResultImageUrl(null);
  
    try {
      console.log('Envoi de la requête à Spacely API...');
      console.log('URLs des images:', {
        room: cld.image(roomImagePublicId).toURL(),
        product: cld.image(productImagePublicId).toURL()
      });
      console.log('Placement:', placement);
      console.log('Area:', area);
  
      const response = await axios.post<{ data: string }>(
        'https://api.spacely.ai/api/v1/generate/furniture-placement',
        {
          imageUrl: cld.image(roomImagePublicId).toURL(),
          productImageUrl: cld.image(productImagePublicId).toURL(),
          placement,
          area
        },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Réponse de Spacely API:', response.data);
      const refId = response.data.data;
      setLoading(false);
      await checkResult(refId);
    } catch (err) {
      console.error('Erreur lors de l\'appel à Spacely API:', err);
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status} - ${err.response?.statusText}`);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
      setLoading(false);
      setGenerating(false);
    }
  };

  const checkResult = async (refId: string) => {
    const maxAttempts = 10;
    const delayBetweenAttempts = 10000; // 10 secondes
  
    const pollResult = async (attemptCount: number): Promise<void> => {
      if (attemptCount >= maxAttempts) {
        setError("La génération a pris trop de temps. Veuillez réessayer.");
        setGenerating(false);
        return;
      }
  
      try {
        const response = await axios.get<{ 
          data: { 
            status: string, 
            result: string[], 
            webhookUrl: string 
          } 
        }>(
          `https://api.spacely.ai/api/v1/generate/poll-result?refId=${refId}`,
          {
            headers: {
              'X-API-KEY': apiKey,
            }
          }
        );
  
        console.log(`Tentative ${attemptCount + 1}: Réponse de l'API Spacely:`, response.data);
  
        if (response.data.data.status === 'processing') {
          console.log(`Génération toujours en cours. Nouvelle tentative dans ${delayBetweenAttempts / 1000} secondes.`);
          setTimeout(() => pollResult(attemptCount + 1), delayBetweenAttempts);
        } else if (response.data.data.status === 'success' && response.data.data.result && response.data.data.result.length > 0) {
          const imageUrl = response.data.data.result[0];
          console.log('Génération réussie. URL de l\'image résultante:', imageUrl);
          setResultImageUrl(imageUrl);
          setGenerating(false);
        } else {
          setError('La génération a échoué ou n\'a pas produit de résultat.');
          setGenerating(false);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du résultat:', err);
        setError('Erreur lors de la récupération du résultat. Veuillez réessayer.');
        setGenerating(false);
      }
    };
  
    pollResult(0);
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Placement de Meubles avec Spacely AI</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Image de la pièce</h3>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleRoomImageChange}
              className="w-full p-2 border rounded bg-white"
              disabled={loading || generating}
            />
            {roomImagePublicId && (
              <AdvancedImage
                cldImg={cld.image(roomImagePublicId).resize(fill().width(300).height(200))}
                className="w-full h-auto rounded shadow-md"
              />
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Image du produit</h3>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleProductImageChange}
              className="w-full p-2 border rounded bg-white"
              disabled={loading || generating}
            />
            {productImagePublicId && (
              <AdvancedImage
                cldImg={cld.image(productImagePublicId).resize(fill().width(300).height(200))}
                className="w-full h-auto rounded shadow-md"
              />
            )}
          </div>
        </div>
    
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Placement (x, y, w, h)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['x', 'y', 'w', 'h'] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{key.toUpperCase()}</label>
                <input
                  type="number"
                  value={placement[key]}
                  onChange={(e) => handlePlacementChange(key, e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                  placeholder={key.toUpperCase()}
                  disabled={loading || generating}
                />
              </div>
            ))}
          </div>
        </div>
    
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Zone (x, y, w, h)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['x', 'y', 'w', 'h'] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{key.toUpperCase()}</label>
                <input
                  type="number"
                  value={area[key]}
                  onChange={(e) => handleAreaChange(key, e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                  placeholder={key.toUpperCase()}
                  disabled={loading || generating}
                />
              </div>
            ))}
          </div>
        </div>
    
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Aperçu du placement</h3>
          <div className="border rounded-lg bg-white p-4 shadow-inner">
            <canvas 
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-96 object-contain cursor-crosshair"
            />
          </div>
          <p className="text-sm text-gray-600">Cliquez pour déplacer le meuble. Le rectangle vert montre la contrainte de zone.</p>
        </div>
    
        <div className="flex justify-center">
          <button 
            onClick={handlePlaceFurniture} 
            disabled={loading || generating || !roomImagePublicId || !productImagePublicId}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
              loading || generating || !roomImagePublicId || !productImagePublicId
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Envoi en cours...' : generating ? 'Génération en cours...' : 'Générer'}
          </button>
        </div>
        
        {(loading || generating) && (
          <p className="text-center mt-4 text-lg text-blue-600">
            {loading ? 'Envoi de la requête...' : 'Génération de l\'image en cours... Cela peut prendre quelques instants.'}
          </p>
        )}
        
        {error && <p className="text-center mt-4 text-lg text-red-500">{error}</p>}
    
        {resultImageUrl && (
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold text-center">Résultat</h3>
            <img 
              src={resultImageUrl} 
              alt="Résultat du placement de meuble" 
              className="w-full border rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FurniturePlacement;