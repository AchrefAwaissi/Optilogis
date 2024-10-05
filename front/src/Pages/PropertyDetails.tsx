import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen, faBed, faHouse, faCouch,
  faRulerCombined, faCompass, faWheelchair, faBuilding,
  faWarehouse, faCar, faBox, faWineBottle, faTree,
  faShare, faHeart, faExpand, faPlus, faCheckCircle,
  faEnvelope, faTimes, faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF, faTwitter, faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios'; 
import PaymentForm from '../Component/PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY || '');

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
interface NeighborhoodInfo {
  population: string;
  amenities: string[];
  safety: string;
  transport: string[];
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
  const { user, updateUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [visibleImages, setVisibleImages] = useState(4);
  const [selectedImage, setSelectedImage] = useState<string>(
    house?.images.length > 0
      ? `http://localhost:5000/uploads/${house.images[0]}`
      : 'https://via.placeholder.com/800x400'
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showNeighborhoodPopup, setShowNeighborhoodPopup] = useState(false);
  const [neighborhoodInfo, setNeighborhoodInfo] = useState<NeighborhoodInfo>({
    population: '',
    amenities: [],
    safety: '',
    transport: [],
  });

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
  }, [house, user]);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === '3D') {
      setShow3DView(!show3DView);
    } else if (tab === 'quartier') {
      // Remove the popup opening logic from here
      // Just update the map view as needed
      if (map) {
        map.setTilt(0);
        map.setMapTypeId('roadmap');
        if (neighborhoodBoundary) {
          neighborhoodBoundary.setMap(map);
        }
      }
    }
  };

  const handleInfoClick = () => {
    setShowNeighborhoodPopup(true);
    fetchNeighborhoodInfo();
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
      navigate(`/candidature/${house._id}`, { state: { isPremium: true } });
    } else {
      setShowCandidaturePopup(true);
    }
  };

  const handleCandidatureSuccess = async () => {
    setIsProcessingPayment(true);
    try {
      // Simulate API call to update user status (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user status
      updateUser({ ...user, isPremium: true });
      
      setIsProcessingPayment(false);
      setShowSuccessMessage(true);
      
      // Close popup after showing success message
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowCandidaturePopup(false);
          setShowSuccessMessage(false);
          setFadeOut(false);
          navigate(`/candidature/${house._id}`, { state: { isPremium: true } });
        }, 500); // Match this with your CSS transition time
      }, 2000);
    } catch (error) {
      console.error('Error updating user status:', error);
      setIsProcessingPayment(false);
      // Handle error (show error message to user)
    }
  };

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

  const handleShare = (platform: string) => {
    let shareUrl = '';
    const text = `Check out this property: ${house.name} in ${house.city}`;
    const url = window.location.href;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }

    window.open(shareUrl, '_blank');
    setShowSharePopup(false);
  };

  const fetchNeighborhoodInfo = async () => {
    try {
      // Récupérer les coordonnées de la ville depuis l'API Géo
      const geoResponse = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${house.city}&type=municipality&limit=1`);
      if (geoResponse.data.features.length > 0) {
        const [lon, lat] = geoResponse.data.features[0].geometry.coordinates;
        
        // Construire l'URL de l'image statique Google Maps
        const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=12&size=100x100&maptype=satellite&key=${googleMapsApiKey}`;
        
        setNeighborhoodInfo({
          population: 'Environ 50,000 habitants',
          amenities: [
            'Plusieurs parcs et espaces verts',
            'Nombreux restaurants et cafés',
            'Écoles primaires et secondaires à proximité',
            'Centre commercial à 10 minutes à pied'
          ],
          safety: 'Taux de criminalité bas, patrouilles de police régulières',
          transport: [
            'Station de métro à 5 minutes à pied',
            'Arrêts de bus fréquents'
          ],
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du quartier:', error);
    }
  };
  const NeighborhoodPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <button onClick={() => setShowNeighborhoodPopup(false)} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <p className="mb-4"><strong>Population:</strong> {neighborhoodInfo.population}</p>
        <h3 className="text-xl font-semibold mb-2">Commodités</h3>
        <ul className="list-disc pl-5 mb-4">
          {neighborhoodInfo.amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mb-2">Transports</h3>
        <ul className="list-disc pl-5 mb-4">
          {neighborhoodInfo.transport.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p className="mb-4"><strong>Sécurité:</strong> {neighborhoodInfo.safety}</p>
      </div>
    </div>
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
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2"
            onClick={() => {/* Open fullscreen gallery */}}
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>
        {house.images.length > 1 && (
          <div className="flex mt-4 space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {house.images.slice(0, visibleImages).map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${image}`}
                alt={`${house.title} view ${index + 1}`}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md flex-shrink-0 cursor-pointer"
                onClick={() => setSelectedImage(`http://localhost:5000/uploads/${image}`)}
              />
            ))}
            {house.images.length > visibleImages && (
              <div 
                className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center cursor-pointer"
                onClick={() => setVisibleImages(prev => Math.min(prev + 4, house.images.length))}
              >
                <FontAwesomeIcon icon={faPlus} className="text-gray-600 mr-1" />
                <span className="text-sm font-medium text-gray-600">
                  {house.images.length - visibleImages}
                </span>
              </div>
            )}
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
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700"
            onClick={handleInfoClick}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
            Informations
          </button>
          </div>
          <div className="h-64 md:h-80 relative">
            {activeTab === 'quartier' || activeTab === '3D' ? (
              <>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
                {activeTab === 'quartier' && (
                  <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow">
                   
                  </div>
                )}
              </>
            ) : null}
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
            <IconButton icon={faShare} onClick={() => setShowSharePopup(true)} />
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
              className="w-full md:w-auto h-10 bg-teal-700 text-white px-4 py-2 rounded-md text-xs md:text-sm whitespace-nowrap"
            >
              <span className="hidden md:inline">
                {user?.isPremium ? "Déposer ma candidature" : "Devenir premium et candidater"}
              </span>
              <span className="md:hidden">
                {user?.isPremium ? "Candidater" : "Devenir premium"}
              </span>
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
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            {isProcessingPayment ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
                <p className="text-lg font-semibold">Traitement du paiement en cours...</p>
              </div>
            ) : showSuccessMessage ? (
              <div className="text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
                <p>Vous êtes maintenant un utilisateur premium. Redirection vers le formulaire de candidature..</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

{showSharePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Partager</h2>
            <div className="flex space-x-4">
              <button onClick={() => handleShare('facebook')} className="bg-blue-600 text-white p-2 rounded">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button onClick={() => handleShare('twitter')} className="bg-blue-400 text-white p-2 rounded">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button onClick={() => handleShare('linkedin')} className="bg-blue-700 text-white p-2 rounded">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </button>
              <button onClick={() => handleShare('email')} className="bg-gray-500 text-white p-2 rounded">
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>
            <button
              onClick={() => setShowSharePopup(false)}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

{showNeighborhoodPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Informations sur le quartier</h2>
              <button onClick={() => setShowNeighborhoodPopup(false)} className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <p className="mb-4 text-sm text-gray-600"><strong>Population:</strong> {neighborhoodInfo.population}</p>
            
            <details className="mb-3">
              <summary className="font-semibold text-[#095550] cursor-pointer">Commodités</summary>
              <ul className="mt-2 pl-5 text-sm text-gray-600">
                {neighborhoodInfo.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </details>
            
            <details className="mb-3">
              <summary className="font-semibold text-[#095550] cursor-pointer">Transports</summary>
              <ul className="mt-2 pl-5 text-sm text-gray-600">
                {neighborhoodInfo.transport.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </details>
            
            <details className="mb-3">
              <summary className="font-semibold text-[#095550] cursor-pointer">Sécurité</summary>
              <p className="mt-2 text-sm text-gray-600">{neighborhoodInfo.safety}</p>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;