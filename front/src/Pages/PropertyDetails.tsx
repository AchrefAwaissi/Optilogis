import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen, faBed, faHouse, faCouch,
  faRulerCombined, faCompass, faWheelchair, faBuilding,
  faWarehouse, faCar, faBox, faWineBottle, faTree, faDollarSign,
  faShare, faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useLocation } from 'react-router-dom';
import StyledGoogleMap from './StyledGoogleMap';

interface House {
  _id: string;
  name: string;
  description: string;
  price: number;
  title: string;
  address: string;
  city: string;
  country: string;
  typeOfHousing: string;
  rooms: number;
  bedrooms: number;
  area: number;
  exposure: string;
  furnished: boolean;
  notFurnished: boolean;
  accessibility: string;
  floor: number;
  annexArea: number;
  parking: boolean;
  garage: boolean;
  basement: boolean;
  storageUnit: boolean;
  cellar: boolean;
  exterior: boolean;
  images: string[];
}

interface InfoCardProps {
  icon: IconDefinition;
  value: string | number;
  label: string;
}

const SmallInfoCard: React.FC<InfoCardProps> = ({ icon, value, label }) => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={icon} className="text-gray-600 text-xs" />
    </div>
    <div className="text-sm">
      <span className="font-semibold">{value}</span> {label}
    </div>
  </div>
);

const LargeInfoCard: React.FC<InfoCardProps> = ({ icon, value, label }) => (
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={icon} className="text-gray-600 text-sm" />
    </div>
    <div>
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

interface IconButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick }) => (
  <button
    className="w-[46px] h-[46px] bg-gray-100 rounded-full flex items-center justify-center"
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className="text-gray-600" />
  </button>
);

const truncateAddress = (address: string, maxLength: number = 50): string => {
  if (address.length <= maxLength) return address;
  return address.substr(0, maxLength) + '...';
};

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const house: House = location.state?.house;
  const [show3DView, setShow3DView] = useState(false);
  const [activeTab, setActiveTab] = useState('3D');

  const [selectedImage, setSelectedImage] = useState<string>(
    house.images.length > 0
      ? `http://localhost:5000/uploads/${house.images[0]}`
      : 'https://via.placeholder.com/800x400'
  );

  if (!house) {
    return <div className="p-4">No property details available.</div>;
  }

  const truncatedAddress = truncateAddress(`${house.address}, ${house.city}, ${house.country}`);

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto h-screen overflow-y-auto">
      <div className="w-full md:w-[60%] md:pr-4">
        <div className="relative">
          <img
            src={selectedImage}
            alt={house.title}
            className="w-full h-48 md:h-80 object-cover rounded-lg"
          />
        </div>
        {house.images.length > 1 && (
          <div className="flex mt-4 space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {house.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${image}`}
                alt={`${house.title} view ${index + 1}`}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md flex-shrink-0 cursor-pointer"
                onClick={() => setSelectedImage(`http://localhost:5000/uploads/${image}`)}
              />
            ))}
          </div>
        )}
        <div className="mt-4">
          <div className="flex space-x-2 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === '3D' ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => {
                setActiveTab('3D');
                setShow3DView(!show3DView);
              }}
            >
<<<<<<< HEAD
              {show3DView ? "Vue 2D" : "Visite 3D"}
=======
              {show3DView ? "Vue 2D" : "Vue 3D"}
>>>>>>> origin/jk
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'quartier' ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('quartier')}
            >
              Voir quartier
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'infos' ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('infos')}
            >
              Informations
            </button>
          </div>
          <div className="h-64 md:h-80">
            <StyledGoogleMap lat={44.8378} lng={-0.5792} show3D={show3DView} />
          </div>
        </div>
      </div>
      <div className="w-full md:w-[40%] mt-4 md:mt-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-[#2c2c2c] mb-2">{house.name}</h1>
            <p className="text-sm text-[#3e3e3e]">{truncatedAddress}</p>
          </div>
          <div className="flex space-x-2">
            <IconButton icon={faShare} onClick={() => console.log('Share clicked')} />
            <IconButton icon={faBookmark} onClick={() => console.log('Save clicked')} />
          </div>
        </div>
        <div className="flex space-x-4 mb-6">
          <SmallInfoCard icon={faDoorOpen} value={house.rooms} label="Pièces" />
          <SmallInfoCard icon={faBed} value={house.bedrooms} label="Chambres" />
          <SmallInfoCard icon={faRulerCombined} value={`${house.area} m²`} label="Surface" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-[25px] font-bold text-[#095550] mb-2 md:mb-0">${house.price.toLocaleString()}/ mois</div>
          <div className="flex flex-row space-x-2">
<<<<<<< HEAD
            <button className="w-28 md:w-auto h-10 bg-teal-700 text-white px-4 rounded-md text-xs md:text-sm whitespace-nowrap">Louer maintenant</button>
=======
            <button className="w-28 md:w-auto h-10 bg-teal-700 text-white px-4 rounded-md text-xs md:text-sm whitespace-nowrap">Louer</button>
>>>>>>> origin/jk
          </div>
        </div>
        <h2 className="text-[23px] font-medium text-[#2c2c2c] mb-4">Description</h2>
        <p className="text-[15px] text-[#575757] leading-[23px] mb-8">
          {house.description || "Aucune description disponible."}
        </p>
        <h2 className="text-[23px] font-medium text-[#2c2c2c] mb-4">Informations et caractéristiques</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <LargeInfoCard icon={faHouse} value={house.typeOfHousing} label="Type de logement" />
          <LargeInfoCard icon={faCompass} value={house.exposure} label="Exposition" />
          <LargeInfoCard icon={faBuilding} value={house.floor} label="Étage" />
          <LargeInfoCard icon={faRulerCombined} value={`${house.annexArea} m²`} label="Surface annexe" />
          <LargeInfoCard icon={faWheelchair} value={house.accessibility} label="Accessibilité" />
          <LargeInfoCard icon={faCouch} value={house.furnished ? "Meublé" : "Non meublé"} label="Ameublement" />
        </div>
        <h2 className="text-[23px] font-medium text-[#2c2c2c] mb-4">Options annexes</h2>
        <div className="grid grid-cols-3 gap-4">
          {house.parking && <LargeInfoCard icon={faCar} value="Oui" label="Parking" />}
          {house.garage && <LargeInfoCard icon={faCar} value="Oui" label="Garage" />}
          {house.basement && <LargeInfoCard icon={faWarehouse} value="Oui" label="Sous-sol" />}
          {house.storageUnit && <LargeInfoCard icon={faBox} value="Oui" label="Box" />}
          {house.cellar && <LargeInfoCard icon={faWineBottle} value="Oui" label="Cave" />}
          {house.exterior && <LargeInfoCard icon={faTree} value="Oui" label="Extérieur" />}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;