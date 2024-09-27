import React from 'react';
import { Link } from 'react-router-dom';

const Planner: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-center p-6 bg-white-100">
      <div className="overflow-y-auto max-h-[600px] w-full flex flex-wrap justify-center gap-6 p-4">
        
        {/* Color Transfer Card */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Fcolor-transfer-thumbnail.png&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Changement de Couleur
            </div>
            <div className="text-[#807f7f] text-base mb-4">
            Changez la couleur de votre chambre selon votre teinte préférée.</div>
            <Link to="/color-transfer">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                Commencez
              </button>
            </Link>
          </div>
        </div>

        {/* Style Transfer Card */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Fstyle-transfer-thumbnail.webp&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Changement de style
            </div>
            <div className="text-[#807f7f] text-base mb-4">
            Redessinez et rendez votre espace en vous basant sur une image de référence.
            </div>
            <Link to="/style-transfer">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Commencez
              </button>
            </Link>
          </div>
        </div>

        {/* Furniture Search API Card */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Ffurniture-search-thumbnail.png&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              API de recherche de meubles
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Recherchez des meubles à partir de notre base de données d'articles
            </div>
            <Link to="/search-article">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Commencez
              </button>
            </Link>
          </div>
        </div>

        {/* Empty Room Card */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Fempty-room.png&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Chambre vide
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Créez une chambre vide et ajoutez des meubles à votre guise.
            </div>
            <Link to="/empty-room">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Commencez
              </button>
            </Link>
          </div>
        </div>

        {/* Furniture Placement Card */}
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xl w-full sm:w-[300px]">
          <div className="w-full h-[200px] bg-center bg-cover rounded-t-lg" 
               style={{ backgroundImage: 'url(https://enterprise.spacely.ai/_next/image?url=%2Fimages%2Fdemo%2Ffurniture-placement-thumbnail.gif&w=3840&q=50)' }}>
          </div>
          <div className="p-4">
            <div className="text-[#111212] text-xl font-bold mb-2">
              Placement de meubles
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Placez des meubles dans une pièce vide et visualisez le résultat.
            </div>
            <Link to="/furniture-placement">
              <button className="bg-[#095550] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#074440] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Commencez
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Planner;