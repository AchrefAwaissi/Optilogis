// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
// import { faHome, faCar, faPaintBrush, faTshirt, faDog, faDollarSign } from '@fortawesome/free-solid-svg-icons';
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// interface IconImageProps {
//   image: string;
// }

// const IconImage: React.FC<IconImageProps> = ({ image }) => (
//   <div style={{
//     width: '46px',
//     height: '46px',
//     backgroundImage: `url(${image})`,
//     backgroundPosition: 'center center',
//     backgroundSize: 'cover',
//     backgroundRepeat: 'no-repeat',
//   }} />
// );

// interface InfoCardProps {
//   children: React.ReactNode;
// }

// const InfoCard: React.FC<InfoCardProps> = ({ children }) => (
//   <div style={{
//     width: '112px',
//     height: '33px',
//     backgroundColor: '#f8f8fa',
//     borderRadius: '7px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }}>
//     {children}
//   </div>
// );

// interface IconCardProps {
//   icon: IconDefinition;
// }

// const IconCard: React.FC<IconCardProps> = ({ icon }) => (
//   <div className="w-12 h-12 bg-[#f8f8fa] rounded-lg flex items-center justify-center mr-3">
//     <FontAwesomeIcon icon={icon} className="text-xl text-gray-600" />
//   </div>
// );

// const StyledGoogleMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA"
//   });

//   const mapContainerStyle = {
//     width: '100%',
//     height: '329px',
//   };

//   const center = {
//     lat: lat,
//     lng: lng
//   };

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={mapContainerStyle}
//       center={center}
//       zoom={14}
//     />
//   ) : <></>;
// };

// const PropertyDetails: React.FC = () => {
//   return (
//     <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto">
//       <div className="md:w-[calc(60%-4px)] pr-4">
//         <div className="relative">
//           <img
//             src="https://assets.api.uizard.io/api/cdn/stream/206fbfa4-d1c6-4567-8dd8-5c938c9d41fc.png"
//             alt="Sabina Apartments"
//             className="w-full h-80 object-cover rounded-lg"
//           />
//         </div>
//         <div className="flex mt-4 space-x-4 overflow-x-auto">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <img
//               key={i}
//               src={`https://assets.api.uizard.io/api/cdn/stream/ddbedb3b-c12e-44d4-8f1b-f37bc426eeb0.png`}
//               alt={`Apartment view ${i}`}
//               className="w-24 h-24 object-cover rounded-md flex-shrink-0"
//             />
//           ))}
//         </div>
//         <div className="mt-4">
//           <StyledGoogleMap lat={44.8378} lng={-0.5792} />
//         </div>
//       </div>
//       <div className="md:w-[40%] mt-4 md:mt-0">
//         <div className="flex justify-between items-center mb-2">
//           <h1 className="text-3xl font-medium">Sabina Apartments</h1>
//           <div className="flex space-x-2">
//             <IconImage image="https://assets.api.uizard.io/api/cdn/stream/d1af5f09-e073-4e6e-8fca-5bc2db4764a9.png" />
//             <IconImage image="https://assets.api.uizard.io/api/cdn/stream/377f2073-9441-44d8-8d7e-dc62d9417357.png" />
//           </div>
//         </div>
//         <p className="text-sm text-gray-600 mb-4">201 Grand Key Loop E, Destin, FL</p>
//         <div className="flex items-center space-x-4 mb-4">
//           <InfoCard>
//             <FontAwesomeIcon icon={faHome} className="mr-2" />
//             <span>6</span>
//           </InfoCard>
//           <InfoCard>
//             <FontAwesomeIcon icon={faHome} className="mr-2" />
//             <span>5</span>
//           </InfoCard>
//           <InfoCard>
//             <span>3,675 sqft</span>
//           </InfoCard>
//         </div>
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-2xl font-bold">$ 3,975/ month</div>
//           <div className="flex space-x-2">
//             <button className="bg-teal-700 text-white px-4 py-2 rounded-md">Rent now</button>
//             <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">View 3D tour</button>
//           </div>
//         </div>
//         <h2 className="text-xl font-medium mt-6 mb-2">Overview</h2>
//         <p className="text-sm text-gray-600">
//           A favorite of tv personalities and athletes. You cannot find anything like it in
//           the city. Great city wide access. Complete renovation. Designer custom
//           furnishings. Huge flat yard with bluestone patio, screened porch, and
//           professional landscaping. Located minutes from major transportation to
//           the city, close to schools, shopping malls, Rock river park and 2 blocks
//           Buckingham side station.
//         </p>
//         <h2 className="text-xl font-medium mt-6 mb-2">Property Information & Features</h2>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div className="flex items-center">
//             <IconCard icon={faHome} />
//             <span><strong>Type:</strong> Single Family</span>
//           </div>
//           <div className="flex items-center">
//             <IconCard icon={faCar} />
//             <span><strong>Parking:</strong> Detached Garage</span>
//           </div>
//           <div className="flex items-center">
//             <IconCard icon={faPaintBrush} />
//             <span><strong>Flooring:</strong> Hardwood/ Tile</span>
//           </div>
//           <div className="flex items-center">
//             <IconCard icon={faTshirt} />
//             <span><strong>Amenities:</strong> Washer/ Dryer/ Dishwasher</span>
//           </div>
//           <div className="flex items-center">
//             <IconCard icon={faDog} />
//             <span><strong>Pets:</strong> Cats/ Dogs allowed</span>
//           </div>
//           <div className="flex items-center">
//             <IconCard icon={faDollarSign} />
//             <span><strong>Deposit & Fees:</strong> $ 1,485</span>
//           </div>
//         </div>
//         <div className="mt-6 bg-gray-100 p-4 rounded-md">
//           <h3 className="text-lg font-medium mb-2">Get up to 20% off on the first rental</h3>
//           <button className="text-orange-500 font-medium">Explore more →</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetails;

















































import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart, faShare, faHome, faCar, faPaintBrush, faTshirt, faDog, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useLocation, Navigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { House } from '../types';

const IconImage: React.FC<{ image: string }> = ({ image }) => (
  <div style={{
    width: '46px',
    height: '46px',
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }} />
);

const InfoCard: React.FC<{ icon: any; value: string | number }> = ({ icon, value }) => (
  <div className="w-28 h-10 bg-[#f8f8fa] rounded-lg flex items-center justify-center">
    <FontAwesomeIcon icon={icon} className="mr-2" />
    <span>{value}</span>
  </div>
);

const StyledGoogleMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA"
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '329px' }}
      center={{ lat, lng }}
      zoom={14}
    />
  ) : <></>;
};

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  
  if (!location.state || !('house' in location.state)) {
    return <Navigate to="/" replace />;
  }

  const { house } = location.state as { house: House };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <div className="flex flex-col md:flex-row gap-8 p-8">
        <div className="md:w-[500px] flex-shrink-0">
          <img 
            className="w-full h-[400px] object-cover rounded-lg border border-black/10" 
            src={house.image ? `http://localhost:5000/uploads/${house.image}` : "https://via.placeholder.com/600x600"} 
            alt={house.title || 'House'} 
          />
          <div className="flex mt-4 space-x-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src="https://via.placeholder.com/150"
                alt={`Apartment view ${i}`}
                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
              />
            ))}
          </div>
          <div className="mt-4">
            <StyledGoogleMap lat={house.latitude || 0} lng={house.longitude || 0} />
          </div>
        </div>
        <div className="flex-grow flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-normal font-['DM Sans']">{house.title || 'Untitled Property'}</h1>
            <div className="flex space-x-2">
              <IconImage image="https://assets.api.uizard.io/api/cdn/stream/d1af5f09-e073-4e6e-8fca-5bc2db4764a9.png" />
              <IconImage image="https://assets.api.uizard.io/api/cdn/stream/377f2073-9441-44d8-8d7e-dc62d9417357.png" />
            </div>
          </div>
          
          <p className="text-[#111111]/70 text-lg font-normal font-['DM Sans']">
            {house.address}, {house.city}, {house.country}
          </p>
          
          <div className="flex items-center space-x-4 mb-4">
            <InfoCard icon={faHome} value={house.rooms || 'N/A'} />
            <InfoCard icon={faHome} value={house.bedrooms || 'N/A'} />
            <InfoCard icon={faHome} value={house.area ? `${house.area} m²` : 'N/A'} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">$ {house.price?.toLocaleString() || 'N/A'}/ month</div>
            <div className="flex space-x-2">
              <button className="bg-teal-700 text-white px-4 py-2 rounded-md">Rent now</button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">View 3D tour</button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-['DM Sans']">Overview</h2>
            <p className="text-[#111111]/70 text-lg font-normal font-['DM Sans']">
              {house.description || "No description available."}
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-['DM Sans']">Property Information & Features</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <InfoCard icon={faHome} value={house.typeOfHousing || 'N/A'} />
                <span className="ml-2"><strong>Type:</strong> {house.typeOfHousing || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <InfoCard icon={faCar} value="N/A" />
                <span className="ml-2"><strong>Parking:</strong> To be completed</span>
              </div>
              <div className="flex items-center">
                <InfoCard icon={faPaintBrush} value="N/A" />
                <span className="ml-2"><strong>Flooring:</strong> To be completed</span>
              </div>
              <div className="flex items-center">
                <InfoCard icon={faTshirt} value="N/A" />
                <span className="ml-2"><strong>Amenities:</strong> To be completed</span>
              </div>
              <div className="flex items-center">
                <InfoCard icon={faDog} value="N/A" />
                <span className="ml-2"><strong>Pets:</strong> To be completed</span>
              </div>
              <div className="flex items-center">
                <InfoCard icon={faDollarSign} value={house.price?.toString() || 'N/A'} />
                <span className="ml-2"><strong>Deposit & Fees:</strong> To be completed</span>
              </div>
            </div>
          </div>
          
          <div className="h-[201px] p-6 bg-white rounded-3xl shadow border border-[#111111]/10 flex-col justify-start items-start gap-[22px] inline-flex">
            <div className="self-stretch justify-start items-center gap-8 inline-flex">
              <div className="flex-col justify-center items-start gap-0.5 inline-flex">
                <div className="text-[#111111]/70 text-lg font-medium font-['DM Sans'] leading-[25.20px]">Price</div>
                <div className="text-[#111111] text-[40px] font-normal font-['DM Sans'] leading-[48px]">${house.price?.toLocaleString() || 'N/A'}</div>
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