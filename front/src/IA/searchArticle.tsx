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

const SearchArticle: React.FC = () => {
  const [apiKey] = useState<string>(process.env.REACT_APP_SPACELY_API_KEY || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imagePublicId) {
      // You can add any additional logic here when the image is uploaded
    }
  }, [imagePublicId]);

  const handleImageUpload = async (file: File) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      handleImageUpload(file);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGenerate = async () => {
    if (!imagePublicId) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        'https://api.spacely.ai/api/v1/generate/furniture-search',
        { imageUrl: cld.image(imagePublicId).toURL() },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      setResult(response.data);
    } catch (err) {
      setError('An error occurred while searching for furniture. Please try again.');
      console.error('Error searching furniture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImagePublicId('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Spacely AI Furniture Search</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Image Upload</label>
        <p className="text-sm text-gray-600 mb-2">Upload JPG / PNG file for the room that you want to use as a template.</p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <button 
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Upload
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept="image/jpeg,image/png"
          />
          {imagePublicId && (
            <div className="mt-4">
              <AdvancedImage
                cldImg={cld.image(imagePublicId).resize(fill().width(300).height(200))}
                className="max-w-full max-h-64 object-contain mx-auto"
              />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">JPG, PNG formats</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button 
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          Reset All
        </button>
        <button 
          onClick={handleGenerate}
          disabled={loading || !imagePublicId}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          Generate
        </button>
      </div>
      
      {loading && <p className="mt-4">Loading...</p>}
      
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Result | ObjectProduct</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default SearchArticle;