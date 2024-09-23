import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen, faBed, faHouse, faCouch,
  faRulerCombined, faCompass, faWheelchair, faBuilding,
  faWarehouse, faCar, faBox, faWineBottle, faTree,
  faShare, faHeart, faExpand, faDollarSign
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios'; 
import PaymentForm from '../Component/PaymentForm';

const stripePromise = loadStripe('pk_live_cI4tcOUyxlMYq9uSo8ZAKFfv00gI78MHLK');

interface House {
  likes: string[];
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
  latitude: number;
  longitude: number;
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
  isLiked?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, isLiked }) => (
  <button
    className={`w-[46px] h-[46px] bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200 ${
      isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
);

const truncateAddress = (address: string, maxLength: number = 50): string => {
  if (address.length <= maxLength) return address;
  return address.substr(0, maxLength) + '...';
};

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const house: House = location.state?.house;
  const [show3DView, setShow3DView] = useState(false);
  const [activeTab, setActiveTab] = useState('3D');
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [webGLOverlayView, setWebGLOverlayView] = useState<google.maps.WebGLOverlayView | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [neighborhoodBoundary, setNeighborhoodBoundary] = useState<google.maps.Circle | null>(null);
  const [showCandidaturePopup, setShowCandidaturePopup] = useState(false);
  const { user } = useAuth(); // Use the auth context
  const [isLiked, setIsLiked] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string>(
    house?.images.length > 0
      ? `http://localhost:5000/uploads/${house.images[0]}`
      : 'https://via.placeholder.com/800x400'
  );

  const addNeighborhoodBoundary = (map: google.maps.Map) => {
    const center = new google.maps.LatLng(house.latitude, house.longitude);
    const radius = 100;

    const circle = new google.maps.Circle({
      strokeColor: "#0f766e",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0f766e",
      fillOpacity: 0.35,
      map: map,
      center: center,
      radius: radius
    });

    setNeighborhoodBoundary(circle);
  };

  useEffect(() => {
    if (!house) return;

    if (user && house) {
      setIsLiked(house.likes?.includes(user.id) || false);
    }

    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
      version: "beta",
      libraries: ["maps"]
    });

    loader.load().then(() => {
      if (mapRef.current && !map) {
        const mapOptions: google.maps.MapOptions = {
          center: { lat: house.latitude, lng: house.longitude },
          zoom: 18,
          tilt: 45,
          heading: 0,
          mapId: process.env.REACT_APP_GOOGLE_MAPS_MAP_ID,
          mapTypeId: 'hybrid',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);

        addNeighborhoodBoundary(newMap);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const markerGeometry = new THREE.ConeGeometry(5, 20, 32);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
        scene.add(markerMesh);

        const overlay = new google.maps.WebGLOverlayView();

        overlay.onAdd = () => {
          // Pas besoin d'initialisation supplémentaire ici
        };

        overlay.onContextRestored = ({ gl }) => {
          renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
          renderer.setPixelRatio(window.devicePixelRatio);
        };

        overlay.onDraw = ({ gl, transformer }) => {
          const latLngAltitudeLiteral = {
            lat: house.latitude,
            lng: house.longitude,
            altitude: 100,
          };

          const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
          camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

          renderer.resetState();
          renderer.render(scene, camera);
          gl.flush();

          overlay.requestRedraw();
        };

        overlay.setMap(newMap);
        setWebGLOverlayView(overlay);

        setIsMapLoaded(true);
      }
    }).catch((e) => {
      console.error('Erreur lors du chargement de la bibliothèque Google Maps.: ', e);
    });
  }, [house]);

  useEffect(() => {
    if (map && isMapLoaded) {
      if (activeTab === 'quartier') {
        map.setTilt(0);
        map.setMapTypeId('roadmap');
        if (neighborhoodBoundary) {
          neighborhoodBoundary.setMap(map);
        }
      } else if (activeTab === '3D') {
        map.setTilt(show3DView ? 45 : 0);
        map.setMapTypeId(show3DView ? 'hybrid' : 'roadmap');
        if (neighborhoodBoundary) {
          neighborhoodBoundary.setMap(null);
        }
      }
    }
  }, [activeTab, show3DView, map, isMapLoaded, neighborhoodBoundary]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === '3D') {
      setShow3DView(!show3DView);
    }
  };

  const handleMapInteraction = () => {
    if (map && sceneRef.current && cameraRef.current) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const tilt = map.getTilt();
      const heading = map.getHeading();

      // Update 3D scene based on map state
      // This is where you would update your 3D objects' positions, rotations, etc.
    }
  };

  useEffect(() => {
    if (map && isMapLoaded) {
      ['center_changed', 'zoom_changed', 'tilt_changed', 'heading_changed'].forEach(eventName => {
        map.addListener(eventName, handleMapInteraction);
      });
    }
  }, [map, isMapLoaded]);

  const handleCandidatureClick = () => {
    if (user?.isPremium) {
      // Si l'utilisateur est premium, naviguer directement vers la page de candidature
      navigate(`/candidature/${house._id}`, { state: { isPremium: true } });
    } else {
      // Sinon, afficher le popup de paiement
      setShowCandidaturePopup(true);
    }
  };

  const handleCandidatureSuccess = () => {
    setShowCandidaturePopup(false);
    navigate(`/candidature/${house._id}`, { state: { isPremium: true } });
  };

  if (!house) {
    return <div className="p-4">No property details available.</div>;
  }

  const truncatedAddress = truncateAddress(`${house.address}, ${house.city}, ${house.country}`);

  const handleLikeToggle = async () => {
    if (!user) {
      console.log('User must be logged in to like/unlike');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Pas de Token trouvé');
      return;
    }

    try {
      const endpoint = `http://localhost:5000/item/${house._id}/like`;
      const method = isLiked ? 'delete' : 'post';
      console.log(`Sending ${method.toUpperCase()} request to ${endpoint}`);
      
      const response = await axios({
        method: method,
        url: endpoint,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      if (response.data) {
        setIsLiked(!isLiked);
        console.log(`Item ${isLiked ? 'unliked' : 'liked'} successfully`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          if (error.response.status === 401) {
            console.error('Echec Authentification, veuillez réessayer.');
            // Here you might want to redirect to login page or refresh the token
          }
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto h-screen overflow-y-auto">
      <div className="w-full md:w-[60%] md:pr-4">
        <div className="relative">
          <img
            src={selectedImage}
            alt={house.title}
            className="w-full h-48 md:h-80 object-cover rounded-lg"
          />
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2"
            onClick={() => {/* Open fullscreen gallery */}}
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
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
              onClick={() => handleTabChange('3D')}
            >
              {show3DView ? "Vue 2D" : "Vue 3D"}
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'quartier' ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleTabChange('quartier')}
            >
              Voir quartier
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'infos' ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleTabChange('infos')}
            >
              Informations
            </button>
          </div>
          <div className="h-64 md:h-80 relative">
            {activeTab === 'quartier' || activeTab === '3D' ? (
              <>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
                {activeTab === 'quartier' && (
                  <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Temps de trajet entre ce bien et d'autres adresses (travail, école...)</h3>
                    <button className="bg-red-500 text-white px-4 py-2 rounded text-sm">
                      Calculer un temps de trajet
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p>Additional Information Placeholder</p>
              </div>
            )}
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
            <IconButton icon={faShare} onClick={() => console.log('Partager cliqué')} />
            <IconButton 
              icon={faHeart}
              onClick={handleLikeToggle}
              isLiked={isLiked}
            />
          </div>
        </div>
        <div className="flex space-x-4 mb-6">
          <SmallInfoCard icon={faDoorOpen} value={house.rooms} label="Pièces" />
          <SmallInfoCard icon={faBed} value={house.bedrooms} label="Chambres" />
          <SmallInfoCard icon={faRulerCombined} value={`${house.area} m²`} label="Surface" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-[25px] font-bold text-[#095550] mb-2 md:mb-0">€{house.price.toLocaleString()}/ mois</div>
          <div className="flex flex-row space-x-2">
          <button
            onClick={handleCandidatureClick}
            className="w-28 md:w-auto h-10 bg-teal-700 text-white px-4 rounded-md text-xs md:text-sm whitespace-nowrap"
          >
            {user?.isPremium ? "Déposer ma candidature" : "Devenir premium et candidater"}
          </button>
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
      {showCandidaturePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Déposer une candidature</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm onSuccess={handleCandidatureSuccess} />
            </Elements>
            <button
              onClick={() => setShowCandidaturePopup(false)}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
