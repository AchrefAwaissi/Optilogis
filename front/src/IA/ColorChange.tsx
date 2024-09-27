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

const ColorChange: React.FC = () => {
  const [apiKey] = useState<string>('sk-v8IV8Sh86ea2F64kzIofgRIs1Kk');
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [roomImagePublicId, setRoomImagePublicId] = useState<string>('');
  const [area, setArea] = useState<'wall' | 'ceiling' | 'floor'>('wall');
  const [color, setColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const roomImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (roomImagePublicId) {
      // You can add any additional logic here when the room image is uploaded
    }
  }, [roomImagePublicId]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const response = await axios.post<{ public_id: string }>(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      setRoomImagePublicId(response.data.public_id);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading the image. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRoomImage(file);
      handleImageUpload(file);
    }
  };

  const handleColorTransfer = async () => {
    if (!roomImagePublicId) {
      setError("Please upload a room image before continuing.");
      return;
    }

    if (!color) {
      setError("Please specify a color before continuing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ data: string }>(
        'https://api.spacely.ai/api/v1/generate/color-transfer',
        {
          imageUrl: cld.image(roomImagePublicId).toURL(),
          area,
          color
        },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const refId = response.data.data;
      await checkResult(refId);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error: ${err.response?.status} - ${err.response?.statusText}`);
      } else {
        setError('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const checkResult = async (refId: string) => {
    const maxAttempts = 10;
    const delayBetweenAttempts = 3000; // 3 seconds

    const pollResult = async (attemptCount: number): Promise<void> => {
      if (attemptCount >= maxAttempts) {
        setError("The generation took too long. Please try again.");
        setLoading(false);
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

        if (response.data.data.status === 'processing') {
          setTimeout(() => pollResult(attemptCount + 1), delayBetweenAttempts);
        } else if (response.data.data.status === 'success' && response.data.data.result && response.data.data.result.length > 0) {
          const imageUrl = response.data.data.result[0];
          setResultImageUrl(imageUrl);
          setLoading(false);
        } else {
          setError('The generation failed or did not produce a result.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error retrieving the result:', err);
        setError('Error retrieving the result. Please try again.');
        setLoading(false);
      }
    };

    pollResult(0);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Changement de couleur</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Images de la pièce:</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-64 flex items-center justify-center"
          onClick={() => roomImageInputRef.current?.click()}
        >
          {roomImagePublicId ? (
            <AdvancedImage
              cldImg={cld.image(roomImagePublicId).resize(fill().width(300).height(200))}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <p>Cliquez pour charger une image de la pièce</p>
          )}
        </div>
        <input 
          type="file" 
          ref={roomImageInputRef}
          onChange={handleImageChange}
          className="hidden" 
          accept="image/*"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Zone à peindre:</label>
        <select 
          value={area} 
          onChange={(e) => setArea(e.target.value as 'wall' | 'ceiling' | 'floor')}
          className="w-full p-2 border rounded"
        >
          <option value="wall">Mur</option>
          <option value="ceiling">Plafond</option>
          <option value="floor">Sol</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Color:</label>
        <input 
          type="text" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div className="flex justify-center mb-4">
        <button 
          onClick={handleColorTransfer} 
          disabled={loading}
          className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Générarion...' : 'Générer'}
        </button>
      </div>
      
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}

      {resultImageUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <img src={resultImageUrl} alt="Résultat" className="w-full border rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default ColorChange;