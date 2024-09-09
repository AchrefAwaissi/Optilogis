import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import { useLocation, Navigate } from 'react-router-dom';
import { House } from '../types';

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  
  if (!location.state || !('house' in location.state)) {
    return <Navigate to="/" replace />;
  }

  const { house } = location.state as { house: House };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <div className="flex flex-col md:flex-row gap-8 p-8">
        <div className="md:w-[600px] flex-shrink-0">
          <img 
            className="w-full h-[600px] object-cover border border-black/10" 
            src={house.image ? `http://localhost:5000/uploads/${house.image}` : "https://via.placeholder.com/600x600"} 
            alt={house.title || 'House'} 
          />
        </div>
        <div className="flex-grow flex flex-col gap-6">
          <h1 className="text-5xl font-normal font-['DM Sans']">{house.title || 'Untitled Property'}</h1>
          
          <p className="text-[#111111]/70 text-lg font-normal font-['DM Sans']">
            {house.description || "No description available."}
          </p>
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-['DM Sans']">Caractéristique</h2>
            <ul className="list-disc pl-5 text-[#111111]/70 text-lg font-normal font-['DM Sans']">
              <li>Type: {house.typeOfHousing || 'N/A'}</li>
              <li>Rooms: {house.rooms || 'N/A'}</li>
              <li>Bedrooms: {house.bedrooms || 'N/A'}</li>
              <li>Area: {house.area ? `${house.area} m²` : 'N/A'}</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-['DM Sans']">Additional Info</h2>
            <div className="flex flex-wrap gap-4 text-[#111111]/70 text-lg font-normal font-['DM Sans']">
              <span>Surface : {house.area ? `${house.area} m²` : "N/A"}</span>
              <span>|</span>
              <span>Chambres : {house.bedrooms || "N/A"}</span>
              <span>|</span>
              <span>Address: {house.address}, {house.city}, {house.country}</span>
            </div>
          </div>
          
          <div className="h-[201px] p-6 bg-white rounded-3xl shadow border border-[#111111]/10 flex-col justify-start items-start gap-[22px] inline-flex">
            <div className="self-stretch justify-start items-center gap-8 inline-flex">
              <div className="flex-col justify-center items-start gap-0.5 inline-flex">
                <div className="text-[#111111]/70 text-lg font-medium font-['DM Sans'] leading-[25.20px]">Price</div>
                <div className="text-[#111111] text-[40px] font-normal font-['DM Sans'] leading-[48px]">${house.price.toLocaleString()}</div>
              </div>
              <div className="grow shrink basis-0 h-[70px] px-8 py-4 bg-[#111111] rounded-[100px] border border-[#111111]/10 justify-center items-center gap-2.5 flex">
                <div className="text-white text-xl font-normal font-['DM Sans'] leading-normal">Contacter l'agence</div>
                <FontAwesomeIcon icon={faArrowRight} className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="self-stretch justify-start items-start gap-2 inline-flex">
              <div className="grow shrink basis-0 h-14 p-5 bg-neutral-50 rounded-[100px] border border-[#111111]/10 justify-center items-center gap-2.5 flex">
                <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-[#111111]" />
                <div className="text-[#111111] text-lg font-normal font-['DM Sans'] leading-[25.20px]">Favorites</div>
              </div>
              <div className="grow shrink basis-0 h-14 p-5 bg-neutral-50 rounded-[100px] border border-[#111111]/10 justify-center items-center gap-2.5 flex">
                <FontAwesomeIcon icon={faShare} className="w-6 h-6 text-[#111111]" />
                <div className="text-[#111111] text-lg font-normal font-['DM Sans'] leading-[25.20px]">Share</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;