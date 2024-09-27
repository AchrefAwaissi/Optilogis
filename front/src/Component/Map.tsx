// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
// import axios from 'axios';
// import { X, School, Star, ExternalLink, Hospital, ShoppingCart, Utensils, Bus, Car, Bike } from 'lucide-react';
// import { House, MapProps, EnhancedPOI, POIType } from '../types';
// import { useGoogleMapsLoader, mapContainerStyle, defaultCenter, defaultZoom, getMarkerIcon, getGoogleMapsUrl } from './googleMapsConfig';

// interface PlaceResult extends google.maps.places.PlaceResult {
//   rating?: number;
//   user_ratings_total?: number;
//   place_id?: string;
// }

// interface UpdatedMapProps extends Omit<MapProps, 'center'> {
//   center?: { lat: number; lng: number } | [number, number];
// }

// const MapComponent: React.FC<UpdatedMapProps> = ({ 
//   houses, 
//   selectedLocation, 
//   onLocationSelect,
//   center = defaultCenter, 
//   zoom = defaultZoom 
// }) => {
//   const { isLoaded, loadError } = useGoogleMapsLoader();

//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(() => {
//     if (Array.isArray(center)) {
//       return { lat: center[0], lng: center[1] };
//     } else {
//       return center;
//     }
//   });
//   const [mapZoom] = useState(zoom);
//   const [pois, setPois] = useState<EnhancedPOI[]>([]);
//   const [showPois, setShowPois] = useState({
//     school: true,
//     hospital: true,
//     supermarket: true,
//     restaurant: true
//   });
//   const [searchRadius, setSearchRadius] = useState(1000);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
//   const [currentCircle, setCurrentCircle] = useState<google.maps.Circle | null>(null);

//   useEffect(() => {
//     if (selectedLocation) {
//       setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lon });
//       map?.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lon });
//     }
//   }, [selectedLocation, map]);

//   const fetchPOIs = useCallback(async (lat: number, lon: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const query = `
//         [out:json];
//         (
//           node["amenity"="school"](around:${searchRadius},${lat},${lon});
//           way["amenity"="school"](around:${searchRadius},${lat},${lon});
//           relation["amenity"="school"](around:${searchRadius},${lat},${lon});
//           node["amenity"="hospital"](around:${searchRadius},${lat},${lon});
//           way["amenity"="hospital"](around:${searchRadius},${lat},${lon});
//           relation["amenity"="hospital"](around:${searchRadius},${lat},${lon});
//           node["shop"="supermarket"](around:${searchRadius},${lat},${lon});
//           way["shop"="supermarket"](around:${searchRadius},${lat},${lon});
//           relation["shop"="supermarket"](around:${searchRadius},${lat},${lon});
//           node["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
//           way["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
//           relation["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
//         );
//         out center;
//       `;
//       const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: query } });
//       const newPois: EnhancedPOI[] = await Promise.all(response.data.elements.map(async (el: any) => {
//         const poiType: POIType = el.tags.amenity === 'school' ? 'school' :
//                                  el.tags.amenity === 'hospital' ? 'hospital' :
//                                  el.tags.amenity === 'restaurant' ? 'restaurant' :
//                                  el.tags.shop === 'supermarket' ? 'supermarket' : 'school';
//         const poi: EnhancedPOI = {
//           id: el.id.toString(),
//           name: el.tags.name || 'Unnamed POI',
//           lat: el.lat || el.center.lat,
//           lon: el.lon || el.center.lon,
//           type: poiType,
//           additionalInfo: el.tags['school:type'] || el.tags.healthcare || el.tags.shop || el.tags.cuisine || el.tags.amenity,
//           rating: 0,
//           userRatingsTotal: 0,
//           placeId: '',
//         };
        
//         const placeDetails = await fetchGooglePlaceDetails(poi.name, poi.lat, poi.lon);
//         if (placeDetails) {
//           poi.rating = placeDetails.rating || 0;
//           poi.userRatingsTotal = placeDetails.user_ratings_total || 0;
//           poi.placeId = placeDetails.place_id || '';
//         }

//         return poi;
//       }));

//       setPois(newPois);
//     } catch (err) {
//       setError('Failed to fetch POIs. Please try again.');
//       console.error('Error fetching POIs:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchRadius]);

//   useEffect(() => {
//     if (selectedHouse && selectedHouse.latitude && selectedHouse.longitude) {
//       fetchPOIs(selectedHouse.latitude, selectedHouse.longitude);
//     }
//   }, [selectedHouse, fetchPOIs, searchRadius]);

//   useEffect(() => {
//     if (map && selectedHouse && selectedHouse.latitude && selectedHouse.longitude) {
//       if (currentCircle) {
//         currentCircle.setMap(null);
//       }
//       const newCircle = new google.maps.Circle({
//         center: { lat: selectedHouse.latitude, lng: selectedHouse.longitude },
//         radius: searchRadius,
//         map: map,
//         fillColor: 'blue',
//         fillOpacity: 0.1,
//         strokeColor: 'blue',
//         strokeOpacity: 1,
//         strokeWeight: 1,
//       });
//       setCurrentCircle(newCircle);
//     }
//   }, [map, selectedHouse, searchRadius]);

//   const fetchGooglePlaceDetails = async (name: string, lat: number, lon: number): Promise<PlaceResult | null> => {
//     if (!isLoaded || !map) return null;
    
//     const service = new google.maps.places.PlacesService(map);
//     const request: google.maps.places.FindPlaceFromQueryRequest = {
//       query: name,
//       fields: ['name', 'rating', 'user_ratings_total', 'place_id'],
//       locationBias: new google.maps.LatLng(lat, lon),
//     };

//     return new Promise((resolve) => {
//       service.findPlaceFromQuery(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
//           resolve(results[0] as PlaceResult);
//         } else {
//           resolve(null);
//         }
//       });
//     });
//   };

//   const handleHouseClick = (house: House) => {
//     setSelectedHouse(house);
//     setShowFilters(true);
//     if (house.latitude && house.longitude) {
//       onLocationSelect({ location: house.address, lat: house.latitude, lon: house.longitude });
//     }
//   };

//   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//     const R = 6371;
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2)
//     ; 
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     const d = R * c;
//     return d;
//   };

//   const deg2rad = (deg: number) => {
//     return deg * (Math.PI/180);
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex items-center">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             size={16}
//             fill={rating >= star ? "gold" : "none"}
//             stroke="gold"
//           />
//         ))}
//         <span className="ml-1">{rating.toFixed(1)}</span>
//       </div>
//     );
//   };

//   const filteredPois = useMemo(() => pois.filter(poi => showPois[poi.type]), [pois, showPois]);

//   const renderPOIMarker = (poi: EnhancedPOI) => (
//     <Marker
//       key={poi.id}
//       position={{ lat: poi.lat, lng: poi.lon }}
//       icon={{
//         url: getMarkerIcon(poi.type),
//         scaledSize: new window.google.maps.Size(30, 30)
//       }}
//       onClick={() => setActiveInfoWindow(poi.id)}
//     >
//       {activeInfoWindow === poi.id && (
//         <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
//           <div>
//             <h3 className="font-bold">{poi.name}</h3>
//             <p>Type: {poi.additionalInfo}</p>
//             {selectedHouse && selectedHouse.latitude && selectedHouse.longitude && (
//               <p>Distance: {calculateDistance(selectedHouse.latitude, selectedHouse.longitude, poi.lat, poi.lon).toFixed(2)} km</p>
//             )}
//             {poi.rating > 0 && (
//               <div className="mt-2">
//                 {renderStars(poi.rating)}
//                 <p className="text-sm text-gray-500">({poi.userRatingsTotal} reviews)</p>
//               </div>
//             )}
//             {poi.placeId && (
//               <a
//                 href={getGoogleMapsUrl(poi.placeId)}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center mt-2 text-blue-500 hover:underline"
//               >
//                 View on Google Maps
//                 <ExternalLink size={14} className="ml-1" />
//               </a>
//             )}
//           </div>
//         </InfoWindow>
//       )}
//     </Marker>
//   );

//   if (loadError) {
//     return <div>Map cannot be loaded right now, sorry.</div>;
//   }

//   return isLoaded ? (
//     <div className="relative">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={mapCenter}
//         zoom={mapZoom}
//         onLoad={setMap}
//         onUnmount={() => setMap(null)}
//       >
//         {houses.map((house) => (
//           <Marker
//             key={house._id}
//             position={{ lat: house.latitude || 0, lng: house.longitude || 0 }}
//             onClick={() => handleHouseClick(house)}
//           />
//         ))}
//         {filteredPois.map(renderPOIMarker)}
//       </GoogleMap>

//       <div className="absolute bottom-2 left-2 bg-white p-3 w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/3 xl:w-2/4 rounded shadow-md max-h-64 overflow-auto">
//         <div className="mb-2">
//           <h3 className="font-bold text-base sm:text-lg mb-2">Explorateur de quartier</h3>
//           <button 
//             onClick={() => setShowFilters(!showFilters)} 
//             className="text-gray-500 hover:text-gray-700"
//           >
//             {showFilters ? (
//               <X size={16} />
//             ) : (
//               <span className="text-xs sm:text-sm">
//                 <span className="block">Découvrir les alentours</span>
//               </span>
//             )}
//           </button>
//         </div>

//         {showFilters && selectedHouse && (
//           <>
//             <p className="mb-2 text-xs">Sélectionné: {selectedHouse.title}</p>
//             <div className="mb-2">
//               <label className="block text-sm font-medium text-gray-700">Rayon</label>
//               <select 
//                 value={searchRadius} 
//                 onChange={(e) => setSearchRadius(parseInt(e.target.value))}
//                 className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
//               >
//                 <option value={1000}>1 km</option>
//                 <option value={2000}>2 km</option>
//                 <option value={3000}>3 km</option>
//                 <option value={5000}>5 km</option>
//                 <option value={10000}>10 km</option>
//               </select>
//             </div>

//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id="showSchools"
//                 checked={showPois.school}
//                 onChange={() => setShowPois(prev => ({ ...prev, school: !prev.school }))}
//                 className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                 style={{ accentColor: '#095550', borderRadius: '7px' }}
//               />
//               <label htmlFor="showSchools" className="flex items-center">
//                 <School className="mr-1 text-green-600" />
//                 <span className="text-xs">Écoles ({pois.filter(poi => poi.type === 'school').length})</span>
//               </label>
//             </div>

//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id="showHospitals"
//                 checked={showPois.hospital}
//                 onChange={() => setShowPois(prev => ({ ...prev, hospital: !prev.hospital }))}
//                 className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
//                 style={{ accentColor: '#095550', borderRadius: '7px' }}
//               />
//               <label htmlFor="showHospitals" className="flex items-center">
//                 <Hospital className="mr-1 text-red-500" />
//                 <span className="text-xs">Hôpitaux ({pois.filter(poi => poi.type === 'hospital').length})</span>
//               </label>
//             </div>

//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id="showSupermarkets"
//                 checked={showPois.supermarket}
//                 onChange={() => setShowPois(prev => ({ ...prev, supermarket: !prev.supermarket }))}
//                 className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
//                 style={{ accentColor: '#095550', borderRadius: '7px' }}
//               />
//               <label htmlFor="showSupermarkets" className="flex items-center">
//                 <ShoppingCart className="mr-1 text-yellow-600" />
//                 <span className="text-xs">Supermarchés ({pois.filter(poi => poi.type === 'supermarket').length})</span>
//               </label>
//             </div>

//             <div className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id="showRestaurants"
//                 checked={showPois.restaurant}
//                 onChange={() => setShowPois(prev => ({ ...prev, restaurant: !prev.restaurant }))}
//                 className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
//                 style={{ accentColor: '#095550', borderRadius: '7px' }}
//               />
//               <label htmlFor="showRestaurants" className="flex items-center">
//                 <Utensils className="mr-1 text-yellow-600" />
//                 <span className="text-xs">Restaurants ({pois.filter(poi => poi.type === 'restaurant').length})</span>
//               </label>
//             </div>
//           </>
//         )}

//         {loading && <p className="mt-2 text-sm">Chargement...</p>}
//         {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
//       </div>
//     </div>
//   ) : <></>;
// };

// export default MapComponent;







import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { X, School, Star, ExternalLink, Hospital, ShoppingCart, Utensils, Bus, Car, Bike } from 'lucide-react';
import { House, MapProps, EnhancedPOI, POIType } from '../types';
import { useGoogleMapsLoader, mapContainerStyle, defaultCenter, defaultZoom, getMarkerIcon, getGoogleMapsUrl } from './googleMapsConfig';
import { faBus, faCar, faBicycle, faSchool, faHospital, faShoppingCart, faUtensils } from '@fortawesome/free-solid-svg-icons'
interface PlaceResult extends google.maps.places.PlaceResult {
  rating?: number;
  user_ratings_total?: number;
  place_id?: string;
}

interface UpdatedMapProps extends Omit<MapProps, 'center'> {
  center?: { lat: number; lng: number } | [number, number];
}

const MapComponent: React.FC<UpdatedMapProps> = ({ 
  houses, 
  selectedLocation, 
  onLocationSelect,
  center = defaultCenter, 
  zoom = defaultZoom 
}) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(() => {
    if (Array.isArray(center)) {
      return { lat: center[0], lng: center[1] };
    } else {
      return center;
    }
  });
  const [mapZoom] = useState(zoom);
  const [pois, setPois] = useState<EnhancedPOI[]>([]);
  const [showPois, setShowPois] = useState({
    school: true,
    hospital: true,
    supermarket: true,
    restaurant: true
  });
  const [searchRadius, setSearchRadius] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
  const [transitAddress, setTransitAddress] = useState('');
  const [transitRoutes, setTransitRoutes] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeDetails, setRouteDetails] = useState<{
    transit: { distance: string; duration: string } | null;
    driving: { distance: string; duration: string } | null;
    bicycling: { distance: string; duration: string } | null;
  }>({
    transit: null,
    driving: null,
    bicycling: null,
  });

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lon });
      map?.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lon });
    }
  }, [selectedLocation, map]);

  useEffect(() => {
    if (isLoaded && map) {
      const renderer = new google.maps.DirectionsRenderer();
      renderer.setMap(map);
      setDirectionsRenderer(renderer);
    }
  }, [isLoaded, map]);

  const handleRouteSearch = (travelMode: google.maps.TravelMode) => {
    if (!selectedHouse || !transitAddress) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: selectedHouse.latitude!, lng: selectedHouse.longitude! },
        destination: transitAddress,
        travelMode: travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setTransitRoutes(result);
          directionsRenderer?.setDirections(result);

          const route = result.routes[0];
          const distance = route.legs[0].distance?.text || 'N/A';
          const duration = route.legs[0].duration?.text || 'N/A';

          setRouteDetails(prev => ({
            ...prev,
            [travelMode.toLowerCase()]: { distance, duration },
          }));
        } else {
          console.error(`Error fetching ${travelMode} routes:`, status);
          setError(`Failed to fetch ${travelMode} routes. Please try again.`);
        }
      }
    );
  };

  const fetchPOIs = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const query = `
        [out:json];
        (
          node["amenity"="school"](around:${searchRadius},${lat},${lon});
          way["amenity"="school"](around:${searchRadius},${lat},${lon});
          relation["amenity"="school"](around:${searchRadius},${lat},${lon});
          node["amenity"="hospital"](around:${searchRadius},${lat},${lon});
          way["amenity"="hospital"](around:${searchRadius},${lat},${lon});
          relation["amenity"="hospital"](around:${searchRadius},${lat},${lon});
          node["shop"="supermarket"](around:${searchRadius},${lat},${lon});
          way["shop"="supermarket"](around:${searchRadius},${lat},${lon});
          relation["shop"="supermarket"](around:${searchRadius},${lat},${lon});
          node["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
          way["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
          relation["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
        );
        out center;
      `;
      const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: query } });
      const newPois: EnhancedPOI[] = await Promise.all(response.data.elements.map(async (el: any) => {
        const poiType: POIType = el.tags.amenity === 'school' ? 'school' :
                                 el.tags.amenity === 'hospital' ? 'hospital' :
                                 el.tags.amenity === 'restaurant' ? 'restaurant' :
                                 el.tags.shop === 'supermarket' ? 'supermarket' : 'school';
        const poi: EnhancedPOI = {
          id: el.id.toString(),
          name: el.tags.name || 'Unnamed POI',
          lat: el.lat || el.center.lat,
          lon: el.lon || el.center.lon,
          type: poiType,
          additionalInfo: el.tags['school:type'] || el.tags.healthcare || el.tags.shop || el.tags.cuisine || el.tags.amenity,
          rating: 0,
          userRatingsTotal: 0,
          placeId: '',
        };
        
        const placeDetails = await fetchGooglePlaceDetails(poi.name, poi.lat, poi.lon);
        if (placeDetails) {
          poi.rating = placeDetails.rating || 0;
          poi.userRatingsTotal = placeDetails.user_ratings_total || 0;
          poi.placeId = placeDetails.place_id || '';
        }

        return poi;
      }));

      setPois(newPois);
    } catch (err) {
      setError('Failed to fetch POIs. Please try again.');
      console.error('Error fetching POIs:', err);
    } finally {
      setLoading(false);
    }
  }, [searchRadius]);

  useEffect(() => {
    if (selectedHouse && selectedHouse.latitude && selectedHouse.longitude) {
      fetchPOIs(selectedHouse.latitude, selectedHouse.longitude);
    }
  }, [selectedHouse, fetchPOIs]);

  const fetchGooglePlaceDetails = async (name: string, lat: number, lon: number): Promise<PlaceResult | null> => {
    if (!isLoaded || !map) return null;
    
    const service = new google.maps.places.PlacesService(map);
    const request: google.maps.places.FindPlaceFromQueryRequest = {
      query: name,
      fields: ['name', 'rating', 'user_ratings_total', 'place_id'],
      locationBias: new google.maps.LatLng(lat, lon),
    };

    return new Promise((resolve) => {
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          resolve(results[0] as PlaceResult);
        } else {
          resolve(null);
        }
      });
    });
  };

  const handleHouseClick = (house: House) => {
    setSelectedHouse(house);
    setShowFilters(true);
    if (house.latitude && house.longitude) {
      onLocationSelect({ location: house.address, lat: house.latitude, lon: house.longitude });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={rating >= star ? "gold" : "none"}
            stroke="gold"
          />
        ))}
        <span className="ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const filteredPois = pois.filter(poi => showPois[poi.type]);

  const renderPOIMarker = (poi: EnhancedPOI) => (
    <Marker
      key={poi.id}
      position={{ lat: poi.lat, lng: poi.lon }}
      icon={{
        url: getMarkerIcon(poi.type),
        scaledSize: new window.google.maps.Size(30, 30)
      }}
      onClick={() => setActiveInfoWindow(poi.id)}
    >
      {activeInfoWindow === poi.id && (
        <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
          <div>
            <h3 className="font-bold">{poi.name}</h3>
            <p>Type: {poi.additionalInfo}</p>
            {selectedHouse && selectedHouse.latitude && selectedHouse.longitude && (
              <p>Distance: {calculateDistance(selectedHouse.latitude, selectedHouse.longitude, poi.lat, poi.lon).toFixed(2)} km</p>
            )}
            {poi.rating > 0 && (
              <div className="mt-2">
                {renderStars(poi.rating)}
                <p className="text-sm text-gray-500">({poi.userRatingsTotal} reviews)</p>
              </div>
            )}
            {poi.placeId && (
              <a
                href={getGoogleMapsUrl(poi.placeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center mt-2 text-blue-500 hover:underline"
              >
                View on Google Maps
                <ExternalLink size={14} className="ml-1" />
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </Marker>
  );

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={mapZoom}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
      >
        {houses.map((house) => (
          <Marker
            key={house._id}
            position={{ lat: house.latitude || 0, lng: house.longitude || 0 }}
            onClick={() => handleHouseClick(house)}
          >
            {activeInfoWindow === house._id && (
              <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
                <div>
                  <h3 className="font-bold">{house.title}</h3>
                  <p>{house.price} €</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
        {selectedHouse && selectedHouse.latitude && selectedHouse.longitude && (
          <Circle
            center={{ lat: selectedHouse.latitude, lng: selectedHouse.longitude }}
            radius={searchRadius}
            options={{
              fillColor: 'blue',
              fillOpacity: 0.1,
              strokeColor: 'blue',
              strokeOpacity: 1,
              strokeWeight: 1,
            }}
          />
        )}
        {filteredPois.map(renderPOIMarker)}
        {transitRoutes && transitRoutes.routes.map((route, index) => (
          <Polyline
            key={index}
            path={route.overview_path}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
        ))}
      </GoogleMap>

      <div className="absolute bottom-2 left-2 bg-white p-3 w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/3 xl:w-2/4 rounded shadow-md max-h-64 overflow-auto">
  <div className="mb-2">
    <h3 className="font-bold text-base sm:text-lg mb-2">Explorateur de quartier</h3>
    <button 
      onClick={() => setShowFilters(!showFilters)} 
      className="text-gray-500 hover:text-gray-700"
    >
      {showFilters ? (
        <X size={16} />
      ) : (
        <span className="text-xs sm:text-sm">
          <span className="block">Découvrir les alentours</span>
        </span>
      )}
    </button>
  </div>

  {showFilters && selectedHouse && (
    <>
      <p className="mb-2 text-xs">Sélectionné: {selectedHouse.title}</p>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Rayon</label>
        <select 
          value={searchRadius} 
          onChange={(e) => setSearchRadius(parseInt(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          <option value={1000}>1 km</option>
          <option value={2000}>2 km</option>
          <option value={3000}>3 km</option>
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
        </select>
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="showSchools"
          checked={showPois.school}
          onChange={() => setShowPois(prev => ({ ...prev, school: !prev.school }))}
          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          style={{ accentColor: '#095550', borderRadius: '7px' }}
        />
        <label htmlFor="showSchools" className="flex items-center">
          <School className="mr-1 text-green-600" />
          <span className="text-xs">Écoles ({pois.filter(poi => poi.type === 'school').length})</span>
        </label>
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="showHospitals"
          checked={showPois.hospital}
          onChange={() => setShowPois(prev => ({ ...prev, hospital: !prev.hospital }))}
          className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          style={{ accentColor: '#095550', borderRadius: '7px' }}
        />
        <label htmlFor="showHospitals" className="flex items-center">
          <Hospital className="mr-1 text-red-500" />
          <span className="text-xs">Hôpitaux ({pois.filter(poi => poi.type === 'hospital').length})</span>
        </label>
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="showSupermarkets"
          checked={showPois.supermarket}
          onChange={() => setShowPois(prev => ({ ...prev, supermarket: !prev.supermarket }))}
          className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          style={{ accentColor: '#095550', borderRadius: '7px' }}
        />
        <label htmlFor="showSupermarkets" className="flex items-center">
          <ShoppingCart className="mr-1 text-yellow-600" />
          <span className="text-xs">Supermarchés ({pois.filter(poi => poi.type === 'supermarket').length})</span>
        </label>
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="showRestaurants"
          checked={showPois.restaurant}
          onChange={() => setShowPois(prev => ({ ...prev, restaurant: !prev.restaurant }))}
          className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          style={{ accentColor: '#095550', borderRadius: '7px' }}
        />
        <label htmlFor="showRestaurants" className="flex items-center">
          <Utensils className="mr-1 text-yellow-600" />
          <span className="text-xs">Restaurants ({pois.filter(poi => poi.type === 'restaurant').length})</span>
        </label>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Itinéraire</label>
        <input
          type="text"
          value={transitAddress}
          onChange={(e) => setTransitAddress(e.target.value)}
          placeholder="Entrez la destination"
          className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        />
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button
            onClick={() => handleRouteSearch(google.maps.TravelMode.TRANSIT)}
            className="inline-flex flex-col justify-center items-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Bus size={14} className="mb-1" />
            
          </button>
          <button
            onClick={() => handleRouteSearch(google.maps.TravelMode.DRIVING)}
            className="inline-flex flex-col justify-center items-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Car size={14} className="mb-1" />
            
          </button>
          <button
            onClick={() => handleRouteSearch(google.maps.TravelMode.BICYCLING)}
            className="inline-flex flex-col justify-center items-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Bike size={14} className="mb-1" />
            
          </button>
        </div>
      </div>

      {/* Résultats des itinéraires */}
      {routeDetails && (
        <div className="mt-4">
          {routeDetails.transit && (
            <div className="text-xs">
              <div><strong>Transport:</strong> {routeDetails.transit.distance}, {routeDetails.transit.duration}</div>
            </div>
          )}
          {routeDetails.driving && (
            <div className="text-xs">
              <div><strong>Voiture:</strong> {routeDetails.driving.distance}, {routeDetails.driving.duration}</div>
            </div>
          )}
          {routeDetails.bicycling && (
            <div className="text-xs">
              <div><strong>Vélo:</strong> {routeDetails.bicycling.distance}, {routeDetails.bicycling.duration}</div>
            </div>
          )}
        </div>
      )}
    </>
  )}

  {loading && <p className="mt-2 text-sm">Chargement...</p>}
  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
</div>




    </div>
  ) : <></>;
};

export default MapComponent;