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
              Furniture Placement
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Paste your preferred furniture within the room.
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
              Color Transfer
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Change the color of your room to your preferred shade.
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
              Style Transfer
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Redesign and render your space based on a reference image.
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
              Furniture Search API
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Product discovery with our Home Product Search API.
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
              Empty Room
            </div>
            <div className="text-[#807f7f] text-base mb-4">
              Furnish your empty space with furniture, Furniture Placement. Paste your preferred furniture within the room.
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
