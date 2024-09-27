import React from 'react';
import { Link } from 'react-router-dom';

const Planner: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-center p-6 bg-white-100">
      <div className="overflow-y-auto max-h-[850px] w-full flex flex-wrap justify-center gap-6 p-4">
        
        {/* Furniture Placement Card (Active) */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Ffurniture-placement-thumbnail.gif&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Placement de meubles
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Placez vos meubles dans une pièce vide.
            </div>
            <Link to="/furniture-placement">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300">
                Start
              </button>
            </Link>
          </div>
        </div>

        {/* Color Transfer Card (Active) */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Fcolor-transfer-thumbnail.png&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Changement de couleur
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Changez la couleur de vos murs et de vos meubles en un clic.
            </div>
            <Link to="/color-transfer">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300">
                Start
              </button>
            </Link>
          </div>
        </div>

        {/* Style Transfer Card (Inactive) */}
        <div className="relative bg-gray-200 p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Fstyle-transfer-thumbnail.webp&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Changement de style
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Changez le style de vos meubles en un clic.
            </div>
            <button 
              className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Furniture Search API Card (Inactive) */}
        <div className="relative bg-gray-200 p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Ffurniture-search-thumbnail.png&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Recherche de meubles
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Recherchez des meubles à partir d'une image et visualisez-les.
            </div>
            <button 
              className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Empty Room Card (Inactive) */}
        <div className="relative bg-gray-200 p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Fempty-room.png&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Pièce vide
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Visualisez une pièce vide et ajoutez-y des meubles.
            </div>
            <button 
              className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Planner;
