import React, { useState, useRef } from 'react';
import axios from 'axios';

const ColorChange: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('sk-v8IV8Sh86ea2F64kzIofgRIs1Kk');
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [roomImagePreview, setRoomImagePreview] = useState<string | null>(null);
  const [area, setArea] = useState<'wall' | 'ceiling' | 'floor'>('wall');
  const [color, setColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const roomImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRoomImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setRoomImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorTransfer = async () => {
    if (!roomImage) {
      setError("Please upload a room image before continuing.");
      return;
    }

    if (!color) {
      setError("Please specify a color before continuing.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', roomImage);
    formData.append('area', area);
    formData.append('color', color);

    try {
      const response = await axios.post(
        'https://api.spacely.ai/api/v1/generate/color-transfer',
        formData,
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResultImage(response.data.resultImageUrl);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error: ${err.response?.status} - ${err.response?.data?.message || err.response?.statusText}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4"> Color Transfer</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Room Image:</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-64 flex items-center justify-center"
          onClick={() => roomImageInputRef.current?.click()}
        >
          {roomImagePreview ? (
            <img src={roomImagePreview} alt="Room" className="max-w-full max-h-full object-contain" />
          ) : (
            <p>Click to upload room image</p>
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
        <label className="block mb-2">Area to Paint:</label>
        <select 
          value={area} 
          onChange={(e) => setArea(e.target.value as 'wall' | 'ceiling' | 'floor')}
          className="w-full p-2 border rounded"
        >
          <option value="wall">Wall</option>
          <option value="ceiling">Ceiling</option>
          <option value="floor">Floor</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Color:</label>
        <input 
          type="text" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          placeholder="e.g., sky blue"
          className="w-full p-2 border rounded" 
        />
      </div>

      <div className="flex justify-center mb-4">
        <button 
          onClick={handleColorTransfer} 
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}

      {resultImage && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <img src={resultImage} alt="Color Transfer Result" className="w-full border rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default ColorChange;