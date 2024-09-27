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
    'chambre', 'salle_de_bain', 'salon', 'salle_à_manger', 'cuisine', 'chambre_et_salon',
    'salon_et_salle_à_manger', 'salle_à_manger_et_cuisine', 'bureau', 'salle_de_sport', 'bureau_à_domicile',
    'chambre_d_enfant', 'salon_salle_à_manger', 'petite_cuisine', 'petit_salon', 'toilettes', 'dressing',
    'patio', 'petit_jardin'
];

const spaceStyles = [
    'moderne', 'minimaliste', 'contemporain', 'halloween', 'wes_anderson', 'traditionnel', 'rustique',
    'loft_industriel', 'scandinave', 'milieu_de_siècle', 'zen', 'moderne_chinois', 'côtier', 'tropical',
    'y2k', 'style_thaï_moderne', 'film_de_magicien_célèbre', 'ryokan', 'espace'
];

  const spaceColors = Array.from({ length: 40 }, (_, i) => `set_${i + 1}`);
  const materials = [
    'papier_poster', 'papier_vinyle', 'tissu_poster', 'tissu_en_herbe',
    'aluminium', 'or', 'bronze', 'cuivre', 'nickel', 'étain', 'fer', 'acier', 'cadmium',
    'zinc', 'stratifié', 'placage', 'panneau_de_particules', 'mdf', 'hdf', 'panneau_de_particules', 'liège',
    'teck', 'chêne', 'pin', 'cerisier', 'érable', 'noyer', 'bouleau', 'cèdre', 'frêne',
    'aulne', 'mélèze', 'tissu', 'soie', 'cuir', 'rayonne', 'coton', 'polyester', 'velours',
    'microfibre', 'briques_en_argile', 'briques_en_béton', 'briques_de_construction', 'briques_sable_chaux',
    'briques_en_cendres_volantes', 'briques_résistantes_au_feu', 'marbre', 'mosaïque', 'carrelage_en_béton', 
    'carrelage_en_pierre', 'carrelage_en_granit', 'terracotta', 'carrelage_en_porcelain', 'ardoise', 
    'carrelage_en_verre', 'carrelage_en_calcaire', 'carrelage_en_résine', 'grès', 'carrelage_de_carière', 
    'carrelage_en_vinyle', 'béton'
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
        <h2 className="text-2xl font-bold mb-4">Spacely IA : Pièce Vide</h2>    
  
        <div className="mb-4">
          <label className="block mb-2">Image de la pièce</label>
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
              "Cliquer pour télécharger l'image"
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
          <label className="block mb-2">Type d'espace</label>
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
          <label className="block mb-2">Style d'espace</label>
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
          <label className="block mb-2">Type de rénovation</label>
          <select 
            value={renovateType} 
            onChange={(e) => setRenovateType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="residential">Résidentiel</option>
            <option value="commercial">Commercial</option>
            <option value="exterior">Extérieur</option>
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-2">Couleurs</label>
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
          <label className="block mb-2">Matériaux</label>
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
            Par défaut
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !imagePublicId}
            className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Générer
          </button>
        </div>
  
        {loading && <p className="text-center mt-4">Chargement...</p>}
        
        {error && <p className="text-red-500 mt-4">{error}</p>}
  
        {result.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Résultat</h3>
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