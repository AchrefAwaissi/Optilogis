import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen, faBed, faHouse, faCouch,
  faRulerCombined, faCompass, faWheelchair, faBuilding,
  faWarehouse, faCar, faBox, faWineBottle, faTree, faDollarSign
} from "@fortawesome/free-solid-svg-icons";
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
  icon: any;
  value: string | number;
  label: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, value, label }) => (
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={icon} className="text-gray-600" />
    </div>
    <div>
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const house: House = location.state?.house;
  const [show3DView, setShow3DView] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string>(
    house.images.length > 0
      ? `http://localhost:5000/uploads/${house.images[0]}`
      : 'https://via.placeholder.com/800x400'
  );

  if (!house) {
    return <div className="p-4">No property details available.</div>;
  }

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
        <div className="mt-4 h-64 md:h-80">
          <StyledGoogleMap lat={44.8378} lng={-0.5792} show3D={show3DView} />
        </div>
      </div>
      <div className="w-full md:w-[40%] mt-4 md:mt-0">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl md:text-3xl font-medium">{house.name}</h1>
        </div>
        <p className="text-sm text-gray-600 mb-4">{`${house.address}, ${house.city}, ${house.country}`}</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <InfoCard icon={faDoorOpen} value={house.rooms} label="Pièces" />
          <InfoCard icon={faBed} value={house.bedrooms} label="Chambres" />
          <InfoCard icon={faRulerCombined} value={`${house.area} m²`} label="Surface" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="text-2xl font-bold mb-2 md:mb-0">${house.price.toLocaleString()}/ mois</div>
          <div className="flex flex-row space-x-2">
            <button className="w-28 md:w-auto h-10 bg-teal-700 text-white px-4 rounded-md text-xs md:text-sm whitespace-nowrap">Louer maintenant</button>
            <button
              className="w-28 md:w-auto h-10 bg-gray-200 text-gray-700 px-4 rounded-md text-xs md:text-sm whitespace-nowrap"
              onClick={() => setShow3DView(!show3DView)}
            >
              {show3DView ? "Vue 2D" : "Visite 3D"}
            </button>
          </div>
        </div>
        <h2 className="text-xl font-medium mt-6 mb-2">Description</h2>
        <p className="text-sm text-gray-600">
          {house.description || "Aucune description disponible."}
        </p>
        <h2 className="text-xl font-medium mt-6 mb-2">Informations et caractéristiques</h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={faHouse} value={house.typeOfHousing} label="Type de logement" />
          <InfoCard icon={faCompass} value={house.exposure} label="Exposition" />
          <InfoCard icon={faBuilding} value={house.floor} label="Étage" />
          <InfoCard icon={faRulerCombined} value={`${house.annexArea} m²`} label="Surface annexe" />
          <InfoCard icon={faWheelchair} value={house.accessibility} label="Accessibilité" />
          <InfoCard icon={faCouch} value={house.furnished ? "Meublé" : "Non meublé"} label="Ameublement" />
        </div>
        <h2 className="text-xl font-medium mt-6 mb-2">Options annexes</h2>
        <div className="grid grid-cols-3 gap-4">
          {house.parking && <InfoCard icon={faCar} value="Oui" label="Parking" />}
          {house.garage && <InfoCard icon={faCar} value="Oui" label="Garage" />}
          {house.basement && <InfoCard icon={faWarehouse} value="Oui" label="Sous-sol" />}
          {house.storageUnit && <InfoCard icon={faBox} value="Oui" label="Box" />}
          {house.cellar && <InfoCard icon={faWineBottle} value="Oui" label="Cave" />}
          {house.exterior && <InfoCard icon={faTree} value="Oui" label="Extérieur" />}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;