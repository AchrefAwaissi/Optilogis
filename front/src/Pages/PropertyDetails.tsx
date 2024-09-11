import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHome, faCar, faPaintBrush, faTshirt, faDog, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import StyledGoogleMap from './StyledGoogleMap'; // Assurez-vous que ce chemin d'importation est correct

interface House {
  _id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  rooms: number;
  bedrooms: number;
  area: number;
  image: string;
  description?: string;
}

interface IconImageProps {
  image: string;
}

const IconImage: React.FC<IconImageProps> = ({ image }) => (
  <div style={{
    width: '46px',
    height: '46px',
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }} />
);

interface InfoCardProps {
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ children }) => (
  <div style={{
    width: '112px',
    height: '33px',
    backgroundColor: '#f8f8fa',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {children}
  </div>
);

interface IconCardProps {
  icon: IconDefinition;
}

const IconCard: React.FC<IconCardProps> = ({ icon }) => (
  <div className="w-12 h-12 bg-[#f8f8fa] rounded-lg flex items-center justify-center mr-3">
    <FontAwesomeIcon icon={icon} className="text-xl text-gray-600" />
  </div>
);

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const house: House = location.state?.house;

  if (!house) {
    return <div>No property details available.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto">
      <div className="md:w-[calc(60%-4px)] pr-4">
        <div className="relative">
          <img
            src={house.image ? `http://localhost:5000/uploads/${house.image}` : 'https://via.placeholder.com/800x400'}
            alt={house.title}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div className="flex mt-4 space-x-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={house.image ? `http://localhost:5000/uploads/${house.image}` : 'https://via.placeholder.com/100x100'}
              alt={`${house.title} view ${i}`}
              className="w-24 h-24 object-cover rounded-md flex-shrink-0"
            />
          ))}
        </div>
        <div className="mt-4">
          <StyledGoogleMap lat={44.8378} lng={-0.5792} />
        </div>
      </div>
      <div className="md:w-[40%] mt-4 md:mt-0">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-medium">{house.title}</h1>
          <div className="flex space-x-2">
            <IconImage image="https://assets.api.uizard.io/api/cdn/stream/d1af5f09-e073-4e6e-8fca-5bc2db4764a9.png" />
            <IconImage image="https://assets.api.uizard.io/api/cdn/stream/377f2073-9441-44d8-8d7e-dc62d9417357.png" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{`${house.address}, ${house.city}`}</p>
        <div className="flex items-center space-x-4 mb-4">
          <InfoCard>
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>{house.rooms}</span>
          </InfoCard>
          <InfoCard>
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>{house.bedrooms}</span>
          </InfoCard>
          <InfoCard>
            <span>{house.area} sqft</span>
          </InfoCard>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">${house.price.toLocaleString()}/ month</div>
          <div className="flex space-x-2">
            <button className="bg-teal-700 text-white px-4 py-2 rounded-md">Rent now</button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">View 3D tour</button>
          </div>
        </div>
        <h2 className="text-xl font-medium mt-6 mb-2">Overview</h2>
        <p className="text-sm text-gray-600">
          {house.description || "No description available."}
        </p>
        <h2 className="text-xl font-medium mt-6 mb-2">Property Information & Features</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <IconCard icon={faHome} />
            <span><strong>Type:</strong> Single Family</span>
          </div>
          <div className="flex items-center">
            <IconCard icon={faCar} />
            <span><strong>Parking:</strong> Not specified</span>
          </div>
          <div className="flex items-center">
            <IconCard icon={faPaintBrush} />
            <span><strong>Flooring:</strong> Not specified</span>
          </div>
          <div className="flex items-center">
            <IconCard icon={faTshirt} />
            <span><strong>Amenities:</strong> Not specified</span>
          </div>
          <div className="flex items-center">
            <IconCard icon={faDog} />
            <span><strong>Pets:</strong> Not specified</span>
          </div>
          <div className="flex items-center">
            <IconCard icon={faDollarSign} />
            <span><strong>Deposit & Fees:</strong> Not specified</span>
          </div>
        </div>
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Get up to 20% off on the first rental</h3>
          <button className="text-orange-500 font-medium">Explore more →</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;