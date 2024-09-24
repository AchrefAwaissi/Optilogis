import React, { useState, useRef } from 'react';
import axios from 'axios';

const SearchArticle: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('sk-v8IV8Sh86ea2F64kzIofgRIs1Kk');
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const base64Image = reader.result as string;

        const response = await axios.post(
          'https://api.spacely.ai/api/v1/generate/furniture-search',
          { image: base64Image },
          {
            headers: {
              'X-API-KEY': apiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        setResult(response.data);
      };
    } catch (err) {
      setError('An error occurred while searching for furniture. Please try again.');
      console.error('Error searching furniture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
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
          {image && <p className="mt-2">File selected: {image.name}</p>}
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
          disabled={loading || !image}
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