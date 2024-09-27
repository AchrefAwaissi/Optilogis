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

const StyleTransfer: React.FC = () => {
  const [apiKey] = useState<string>('sk-iYiywwNzEzcDy-ZarW4fwNWscUs');
  const [roomImagePublicId, setRoomImagePublicId] = useState<string>('');
  const [styleImagePublicId, setStyleImagePublicId] = useState<string>('');
  const [spaceType, setSpaceType] = useState<string>('bedroom');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImages, setResultImages] = useState<string[]>([]);

  const roomImageInputRef = useRef<HTMLInputElement>(null);
  const styleImageInputRef = useRef<HTMLInputElement>(null);

  const spaceTypes = [
    'bedroom', 'bathroom', 'living_room', 'dining_room', 'kitchen',
    'bed_and_living_room', 'living_and_dining_room', 'dining_and_kitchen',
    'working_room', 'home_gym', 'home_office', 'kids_room', 'living_dining',
    'small_kitchen', 'small_living_room', 'toilet', 'walk_in_closet',
    'patio', 'small_garden'
  ];

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
      setError('Error uploading the image. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImagePublicId: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0], setImagePublicId);
    }
  };

  const handleStyleTransfer = async () => {
    if (!roomImagePublicId || !styleImagePublicId) {
      setError("Please upload both room and style images before continuing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultImages([]);

    try {
      const response = await axios.post(
        'https://api.spacely.ai/api/v1/generate/style-transfer',
        {
          imageUrl: cld.image(roomImagePublicId).toURL(),
          styleImageUrl: cld.image(styleImagePublicId).toURL(),
          spaceType: spaceType,
          renovateType: 'residential'
        },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      setResultImages(response.data.outputImages || []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error: ${err.response?.status} - ${err.response?.statusText}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoomImagePublicId('');
    setStyleImagePublicId('');
    setSpaceType('bedroom');
    setResultImages([]);
    setError(null);
    if (roomImageInputRef.current) roomImageInputRef.current.value = '';
    if (styleImageInputRef.current) styleImageInputRef.current.value = '';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Style Transfer</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Room Image:</label>
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
              <p>Click to upload room image</p>
            )}
          </div>
          <input 
            type="file" 
            ref={roomImageInputRef}
            onChange={(e) => handleImageChange(e, setRoomImagePublicId)}
            className="hidden" 
            accept="image/*"
          />
        </div>
        <div>
          <label className="block mb-2">Style Image:</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-64 flex items-center justify-center"
            onClick={() => styleImageInputRef.current?.click()}
          >
            {styleImagePublicId ? (
              <AdvancedImage
                cldImg={cld.image(styleImagePublicId).resize(fill().width(300).height(200))}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p>Click to upload style image</p>
            )}
          </div>
          <input 
            type="file" 
            ref={styleImageInputRef}
            onChange={(e) => handleImageChange(e, setStyleImagePublicId)}
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>
  
      <div className="mb-4">
        <label className="block mb-2">Renovate Type:</label>
        <select 
          value="residential"
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        >
          <option value="residential">Residential</option>
        </select>
      </div>
  
      <div className="mb-4">
        <label className="block mb-2">Space Type:</label>
        <select 
          value={spaceType} 
          onChange={(e) => setSpaceType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {spaceTypes.map(type => (
            <option key={type} value={type}>
              {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>
  
      <div className="flex justify-between mb-4">
        <button 
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          Reset All
        </button>
        <button 
          onClick={handleStyleTransfer} 
          disabled={loading || !roomImagePublicId || !styleImagePublicId}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          Generate
        </button>
      </div>
      
      {loading && <p className="text-center mt-4">Loading...</p>}
      
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
  
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Results:</h3>
        <div className="overflow-y-auto max-h-80">
          {resultImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {resultImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Style Transfer Result ${index + 1}`} className="w-full border rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Result image {index + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );  
}

export default StyleTransfer;