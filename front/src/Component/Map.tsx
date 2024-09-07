// import React, { useState, useEffect, useMemo } from 'react';
// import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from '@react-google-maps/api';
// import axios from 'axios';
// import { X, Camera, Star, Bus, Train, } from 'lucide-react';
// import { House, MapProps, EnhancedPOI, Location, POIType } from '../types';

// const MapComponent: React.FC<MapProps> = ({ 
//   houses, 
//   selectedLocation, 
//   onLocationSelect,
//   center = [44.8378, -0.5792], 
//   zoom = 13 
// }) => {
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA"
//   });

//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: center[0], lng: center[1] });
//   const [mapZoom, setMapZoom] = useState(zoom);
//   const [pois, setPois] = useState<EnhancedPOI[]>([]);
//   const [showPois, setShowPois] = useState({ hospitals: true, schools: true, supermarkets: true });
//   const [searchRadius, setSearchRadius] = useState(2000);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [destinationAddress, setDestinationAddress] = useState('');
//   const [routeDistance, setRouteDistance] = useState<number | null>(null);
//   const [showTransit, setShowTransit] = useState(false);
//   const [transitDetails, setTransitDetails] = useState<string>('');
//   const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);
//   const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

//   useEffect(() => {
//     if (isLoaded && map) {
//       const renderer = new google.maps.DirectionsRenderer();
//       renderer.setMap(map);
//       setDirectionsRenderer(renderer);
//     }
//   }, [isLoaded, map]);

//   useEffect(() => {
//     if (selectedLocation) {
//       setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lon });
//       map?.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lon });
//     }
//   }, [selectedLocation, map]);

//   const fetchPOIs = async (lat: number, lon: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const query = `
//         [out:json];
//         (
//           node["amenity"="hospital"](around:${searchRadius},${lat},${lon});
//           way["amenity"="hospital"](around:${searchRadius},${lat},${lon});
//           relation["amenity"="hospital"](around:${searchRadius},${lat},${lon});
//           node["amenity"="school"](around:${searchRadius},${lat},${lon});
//           way["amenity"="school"](around:${searchRadius},${lat},${lon});
//           node["shop"="supermarket"](around:${searchRadius},${lat},${lon});
//         );
//         out center;
//       `;
//       const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: query } });
//       const newPois: EnhancedPOI[] = response.data.elements.map((el: any) => {
//         let type: POIType;
//         let additionalInfo = '';
//         let lat = el.lat;
//         let lon = el.lon;

//         if (el.type === 'way' || el.type === 'relation') {
//           lat = el.center.lat;
//           lon = el.center.lon;
//         }

//         if (el.tags.amenity === 'hospital') {
//           type = 'hospital';
//           additionalInfo = el.tags.healthcare || 'Hospital';
//         } else if (el.tags.amenity === 'school') {
//           type = 'school';
//           additionalInfo = el.tags['school:type'] || 'School';
//         } else {
//           type = 'supermarket';
//           additionalInfo = el.tags.brand || 'Supermarket';
//         }

//         return {
//           id: el.id.toString(),
//           name: el.tags.name || el.tags.operator || additionalInfo,
//           lat,
//           lon,
//           type,
//           additionalInfo,
//           rating: 0,
//           userRatingsTotal: 0,
//           placeId: ''
//         };
//       });
//       setPois(newPois);
//     } catch (err) {
//       setError('Failed to fetch POIs. Please try again.');
//       console.error('Error fetching POIs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTogglePOI = (poiType: 'hospitals' | 'schools' | 'supermarkets') => {
//     setShowPois(prev => ({ ...prev, [poiType]: !prev[poiType] }));
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

//   const handleHouseClick = (house: House) => {
//     setSelectedHouse(house);
//     setShowFilters(true);
//     if (house.latitude && house.longitude) {
//       const location: Location = {
//         location: `${house.address}, ${house.city}`,
//         lat: house.latitude,
//         lon: house.longitude
//       };
//       onLocationSelect(location);
//       fetchPOIs(house.latitude, house.longitude);
//     }
//   };

//   const fetchRoute = async (startLat: number, startLon: number, endLat: number, endLon: number, travelMode: google.maps.TravelMode) => {
//     if (!map || !directionsRenderer) return;

//     const directionsService = new google.maps.DirectionsService();
//     const request: google.maps.DirectionsRequest = {
//       origin: new google.maps.LatLng(startLat, startLon),
//       destination: new google.maps.LatLng(endLat, endLon),
//       travelMode: travelMode,
//       transitOptions: travelMode === google.maps.TravelMode.TRANSIT ? {
//         modes: ['BUS', 'SUBWAY', 'TRAIN', 'TRAM', 'RAIL'] as google.maps.TransitMode[],
//         routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
//       } : undefined
//     };

//     directionsService.route(request, (result, status) => {
//       if (status === google.maps.DirectionsStatus.OK && result) {
//         directionsRenderer.setDirections(result);
//         setRouteDistance(result.routes[0].legs[0].distance?.value ? result.routes[0].legs[0].distance.value / 1000 : null);

//         if (travelMode === google.maps.TravelMode.TRANSIT) {
//           const summary = result.routes[0].legs[0].steps.map(step => {
//             if (step.travel_mode === google.maps.TravelMode.TRANSIT && step.transit) {
//               const lineName = step.transit.line.short_name || step.transit.line.name || 'Unknown Line';
//               return `Take ${step.transit.line.vehicle.name || 'transit'} ${lineName} from ${step.transit.departure_stop.name} to ${step.transit.arrival_stop.name}`;
//             }
//             return `${step.instructions} for ${step.distance?.text || 'unknown distance'}`;
//           }).join('\n');
//           setTransitDetails(summary);
//         } else {
//           setTransitDetails('');
//         }
//       } else {
//         console.error('Error fetching route:', status);
//         setError(`Failed to fetch ${travelMode.toLowerCase()} route. Please try again.`);
//       }
//     });
//   };

//   const handleRouteSearch = async () => {
//     if (!selectedHouse || !destinationAddress) return;

//     if (selectedHouse.latitude === undefined || selectedHouse.longitude === undefined) {
//       setError('Selected house location is not available.');
//       return;
//     }

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: destinationAddress }, (results, status) => {
//       if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
//         const destination = results[0].geometry.location;
//         fetchRoute(
//           selectedHouse.latitude!,
//           selectedHouse.longitude!,
//           destination.lat(),
//           destination.lng(),
//           showTransit ? google.maps.TravelMode.TRANSIT : google.maps.TravelMode.DRIVING
//         );
//       } else {
//         setError('Address not found. Please try a different address.');
//       }
//     });
//   };

//   const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDestinationAddress(e.target.value);
//   };

//   const filteredPois = useMemo(() => {
//     return pois.filter(poi => 
//       (showPois.hospitals && poi.type === 'hospital') ||
//       (showPois.schools && poi.type === 'school') ||
//       (showPois.supermarkets && poi.type === 'supermarket')
//     );
//   }, [pois, showPois]);

//   const poiCounts = useMemo(() => ({
//     hospitals: pois.filter(poi => poi.type === 'hospital').length,
//     schools: pois.filter(poi => poi.type === 'school').length,
//     supermarkets: pois.filter(poi => poi.type === 'supermarket').length,
//   }), [pois]);

//   const renderStars = (rating: number) => {
//     return Array(5).fill(0).map((_, index) => (
//       <Star key={index} size={16} fill={index < rating ? "gold" : "none"} stroke="gold" />
//     ));
//   };

//   return isLoaded ? (
//     <div className="relative">
//       <GoogleMap
//         mapContainerStyle={{ height: '90vh', width: '100%' }}
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
//           >
//             {activeInfoWindow === house._id && (
//               <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
//                 <div>
//                   <h3>{house.title}</h3>
//                   <p>{house.price} €</p>
//                 </div>
//               </InfoWindow>
//             )}
//           </Marker>
//         ))}
//         {selectedHouse && selectedHouse.latitude && selectedHouse.longitude && (
//           <Circle
//             center={{ lat: selectedHouse.latitude, lng: selectedHouse.longitude }}
//             radius={searchRadius}
//             options={{
//               fillColor: 'blue',
//               fillOpacity: 0.1,
//               strokeColor: 'blue',
//               strokeOpacity: 1,
//               strokeWeight: 1,
//             }}
//           />
//         )}
//         {filteredPois.map((poi) => (
//           <Marker
//             key={poi.id}
//             position={{ lat: poi.lat, lng: poi.lon }}
//             icon={{
//               url: `https://maps.google.com/mapfiles/ms/icons/${poi.type === 'hospital' ? 'red' : poi.type === 'school' ? 'blue' : 'green'}-dot.png`,
//               scaledSize: new window.google.maps.Size(30, 30)
//             }}
//             onClick={() => setActiveInfoWindow(poi.id)}
//           >
//             {activeInfoWindow === poi.id && (
//               <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
//                 <div>
//                   <h3>{poi.name}</h3>
//                   <p>Type: {poi.type.charAt(0).toUpperCase() + poi.type.slice(1)}</p>
//                   {poi.additionalInfo && <p>Info: {poi.additionalInfo}</p>}
//                   {selectedHouse && selectedHouse.latitude && selectedHouse.longitude && (
//                     <p>Distance: {calculateDistance(selectedHouse.latitude, selectedHouse.longitude, poi.lat, poi.lon).toFixed(2)} km</p>
//                   )}
//                   {poi.rating > 0 && (
//                     <div className="flex items-center">
//                       {renderStars(poi.rating)}
//                       <span className="ml-1">{poi.rating.toFixed(1)} ({poi.userRatingsTotal} reviews)</span>
//                     </div>
//                   )}
//                 </div>
//               </InfoWindow>
//             )}
//           </Marker>
//         ))}
//       </GoogleMap>

//       <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-md z-[1000]">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="font-bold">Filters</h3>
//           <button onClick={() => setShowFilters(!showFilters)} className="text-gray-500 hover:text-gray-700">
//             {showFilters ? <X size={20} /> : 'Show Filters'}
//           </button>
//         </div>
//         {showFilters && selectedHouse && (
//           <>
//             <p className="mb-2">Selected: {selectedHouse.title}</p>
//             <select 
//               value={searchRadius} 
//               onChange={(e) => setSearchRadius(parseInt(e.target.value))}
//               className="mb-2 w-full p-2 border rounded"
//             >
//               <option value={1000}>1 km</option>
//               <option value={2000}>2 km</option>
//               <option value={3000}>3 km</option>
//               <option value={4000}>4 km</option>
//               <option value={5000}>5 km</option>
//             </select>
//             <div className="space-y-2">
//             <label className="flex items-center">
//                 <input 
//                   type="checkbox" 
//                   checked={showPois.hospitals} 
//                   onChange={() => handleTogglePOI('hospitals')}
//                   className="mr-2 h-4 w-4"
//                 />
//                 <span>Hospitals ({poiCounts.hospitals})</span>
//               </label>
//               <label className="flex items-center">
//                 <input 
//                   type="checkbox" 
//                   checked={showPois.schools} 
//                   onChange={() => handleTogglePOI('schools')}
//                   className="mr-2 h-4 w-4"
//                 />
//                 <span>Schools ({poiCounts.schools})</span>
//               </label>
//               <label className="flex items-center">
//                 <input 
//                   type="checkbox" 
//                   checked={showPois.supermarkets} 
//                   onChange={() => handleTogglePOI('supermarkets')}
//                   className="mr-2 h-4 w-4"
//                 />
//                 <span>Supermarkets ({poiCounts.supermarkets})</span>
//               </label>
//             </div>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700">Destination Address</label>
//               <input
//                 type="text"
//                 value={destinationAddress}
//                 onChange={handleDestinationChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 placeholder="Enter destination address"
//               />
//               <div className="flex mt-2">
//                 <button
//                   onClick={() => {
//                     setShowTransit(false);
//                     handleRouteSearch();
//                   }}
//                   className="flex-1 mr-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Driving Route
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowTransit(true);
//                     handleRouteSearch();
//                   }}
//                   className="flex-1 ml-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                 >
//                   Transit Route
//                 </button>
//               </div>
//             </div>
//             {routeDistance !== null && (
//               <p className="mt-2">Route Distance: {routeDistance.toFixed(2)} km</p>
//             )}
//             {transitDetails && (
//               <div className="mt-4">
//                 <h4 className="font-bold">Transit Route Details:</h4>
//                 <p className="text-sm whitespace-pre-line">{transitDetails}</p>
//               </div>
//             )}
//           </>
//         )}
//         {loading && <p className="mt-2">Loading...</p>}
//         {error && <p className="mt-2 text-red-500">{error}</p>}
//       </div>
//     </div>
//   ) : <></>;
// };

// export default MapComponent;
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { X, School, Star, ExternalLink, Hospital, ShoppingCart, Utensils, Bus, Train } from 'lucide-react';
import { House, MapProps, EnhancedPOI, POIType } from '../types';

interface PlaceResult extends google.maps.places.PlaceResult {
  rating?: number;
  user_ratings_total?: number;
  place_id?: string;
}

const MapComponent: React.FC<MapProps> = ({ 
  houses, 
  selectedLocation, 
  onLocationSelect,
  center = [44.8378, -0.5792], 
  zoom = 13 
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA",
    libraries: ['places']
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: center[0], lng: center[1] });
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

  // Nouveaux états pour la fonctionnalité de transit
  const [transitAddress, setTransitAddress] = useState('');
  const [transitRoutes, setTransitRoutes] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

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

  const getGoogleMapsUrl = (placeId: string) => {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  };

  const getMarkerIcon = (type: POIType) => {
    switch (type) {
      case 'school':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'hospital':
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'supermarket':
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'restaurant':
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
    }
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

  // Nouvelle fonction pour gérer la recherche de transit
  const handleTransitSearch = () => {
    if (!selectedHouse || !transitAddress) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: selectedHouse.latitude!, lng: selectedHouse.longitude! },
        destination: transitAddress,
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setTransitRoutes(result);
          directionsRenderer?.setDirections(result);
        } else {
          console.error('Error fetching transit routes:', status);
          setError('Failed to fetch transit routes. Please try again.');
        }
      }
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={{ height: '90vh', width: '100%' }}
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

      <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-md z-[1000]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">POI Filters</h3>
          <button onClick={() => setShowFilters(!showFilters)} className="text-gray-500 hover:text-gray-700">
            {showFilters ? <X size={20} /> : 'Show Filters'}
          </button>
        </div>
        {showFilters && selectedHouse && (
          <>
            <p className="mb-2">Selected: {selectedHouse.title}</p>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Search Radius</label>
              <select 
                value={searchRadius} 
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showSchools" className="flex items-center">
                <School className="mr-2 text-blue-500" />
                <span>Show Schools ({pois.filter(poi => poi.type === 'school').length})</span>
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="showHospitals"
                checked={showPois.hospital}
                onChange={() => setShowPois(prev => ({ ...prev, hospital: !prev.hospital }))}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showHospitals" className="flex items-center">
                <Hospital className="mr-2 text-red-500" />
                <span>Show Hospitals ({pois.filter(poi => poi.type === 'hospital').length})</span>
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="showSupermarkets"
                checked={showPois.supermarket}
                onChange={() => setShowPois(prev => ({ ...prev, supermarket: !prev.supermarket }))}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showSupermarkets" className="flex items-center">
                <ShoppingCart className="mr-2 text-green-500" />
                <span>Show Supermarkets ({pois.filter(poi => poi.type === 'supermarket').length})</span>
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="showRestaurants"
                checked={showPois.restaurant}
                onChange={() => setShowPois(prev => ({ ...prev, restaurant: !prev.restaurant }))}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showRestaurants" className="flex items-center">
                <Utensils className="mr-2 text-yellow-500" />
                <span>Show Restaurants ({pois.filter(poi => poi.type === 'restaurant').length})</span>
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Transit Search</label>
              <input
                type="text"
                value={transitAddress}
                onChange={(e) => setTransitAddress(e.target.value)}
                placeholder="Enter destination for transit"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <button
                onClick={handleTransitSearch}
                className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search Transit Routes
              </button>
            </div>
          </>
        )}
        {loading && <p className="mt-2">Loading POIs...</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  ) : <></>;
};

export default MapComponent;