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

const EmptyRoom: React.FC = () => {
  const [apiKey] = useState<string>('sk-iYiywwNzEzcDy-ZarW4fwNWscUs');
  const [image, setImage] = useState<File | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string>('');
  const [spaceType, setSpaceType] = useState<string>('bedroom');
  const [spaceStyle, setSpaceStyle] = useState<string>('modern');
  const [renovateType, setRenovateType] = useState<string>('residential');
  const [spaceColor, setSpaceColor] = useState<string>('set_3');
  const [materialsIds, setMaterialsIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const spaceTypes = [
    'bedroom', 'bathroom', 'living_room', 'dining_room', 'kitchen', 'bed_and_living_room',
    'living_and_dining_room', 'dining_and_kitchen', 'working_room', 'home_gym', 'home_office',
    'kids_room', 'living_dining', 'small_kitchen', 'small_living_room', 'toilet', 'walk_in_closet',
    'patio', 'small_garden'
  ];

  const spaceStyles = [
    'modern', 'minimalist', 'contemporary', 'halloween', 'wes_anderson', 'traditional', 'rustic',
    'industrial_loft', 'scandinavian', 'mid_century', 'zen', 'modern_chinese', 'coastal', 'tropical',
    'y2k', 'modern_thai_style', 'famous_wizard_movie', 'ryokan', 'space'
  ];

  const spaceColors = Array.from({ length: 40 }, (_, i) => `set_${i + 1}`);

  const materials = [
    'paper_wallpaper', 'vinyl_wallpaper', 'fabric_wallpaper', 'grass_cloth_wallpaper',
    'aluminum', 'gold', 'bronze', 'copper', 'nickle', 'tin', 'iron', 'steel', 'cadmium',
    'zinc', 'laminate', 'veneer', 'ply_board', 'mdf', 'hdf', 'particle_board', 'cork',
    'teck_wood', 'oak', 'pine', 'cherry', 'maple', 'walnut', 'birch', 'cedar', 'ash',
    'alder', 'larch', 'fabric', 'silk', 'leather', 'rayon', 'cotton', 'polyester', 'velvet',
    'microfiber', 'clay_bricks', 'concrete_bricks', 'engineering_bricks', 'sand_lime_bricks',
    'fly_ash_bricks', 'firebricks', 'marble', 'mosaic', 'cement_tile', 'stone_tile', 'granite_tile',
    'teracotta', 'porceline_tile', 'slate', 'glass_tile', 'lime_stone_tile', 'resin_tile',
    'sand_stone', 'quarry_tile', 'vinyl_composition_tile', 'concrete'
  ];

  useEffect(() => {
    if (imagePublicId) {
      // Vous pouvez ajouter ici une logique supplémentaire lorsque l'image est téléchargée
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

  const handleMaterialChange = (material: string) => {
    setMaterialsIds(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const handleSubmit = async () => {
    if (!imagePublicId) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult([]);

    try {
      const response = await axios.post(
        'https://api.spacely.ai/api/v1/generate/empty-room',
        {
          imageUrl: cld.image(imagePublicId).toURL(),
          spaceType,
          spaceStyle,
          renovateType,
          spaceColor,
          materialsIds
        },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      setResult(response.data.outputImages);
    } catch (err) {
      setError('An error occurred while processing the room. Please try again.');
      console.error('Error processing room:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImagePublicId('');
    setSpaceType('bedroom');
    setSpaceStyle('modern');
    setRenovateType('residential');
    setSpaceColor('set_3');
    setMaterialsIds([]);
    setResult([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-4 max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">Spacely AI Empty Room</h2>    
  
        <div className="mb-4">
          <label className="block mb-2">Room Image:</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={handleUpload}
          >
            {imagePublicId ? (
              <AdvancedImage
                cldImg={cld.image(imagePublicId).resize(fill().width(300).height(200))}
                className="max-w-full max-h-64 object-contain mx-auto"
              />
            ) : (
              "Click to upload image"
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept="image/*"
          />
        </div>
  
        <div className="mb-4">
          <label className="block mb-2">Space Type:</label>
          <select 
            value={spaceType} 
            onChange={(e) => setSpaceType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {spaceTypes.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-2">Space Style:</label>
          <select 
            value={spaceStyle} 
            onChange={(e) => setSpaceStyle(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {spaceStyles.map(style => (
              <option key={style} value={style}>{style.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-2">Renovate Type:</label>
          <select 
            value={renovateType} 
            onChange={(e) => setRenovateType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="exterior">Exterior</option>
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-2">Space Color:</label>
          <select 
            value={spaceColor} 
            onChange={(e) => setSpaceColor(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {spaceColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-2">Materials:</label>
          <div className="flex flex-wrap gap-2 overflow-y-scroll max-h-48">
            {materials.map(material => (
              <button
                key={material}
                onClick={() => handleMaterialChange(material)}
                className={`px-2 py-1 rounded ${
                  materialsIds.includes(material) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {material.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
  
        <div className="flex justify-between mb-4">
          <button 
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Reset All
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !imagePublicId}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            Generate
          </button>
        </div>
  
        {loading && <p className="text-center mt-4">Processing...</p>}
        
        {error && <p className="text-red-500 mt-4">{error}</p>}
  
        {result.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Results:</h3>
            <div className="grid grid-cols-2 gap-4">
              {result.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Result ${index + 1}`} className="w-full rounded-lg shadow-md" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}

export default EmptyRoom;