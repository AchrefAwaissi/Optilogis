import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { X, School, Star, ExternalLink, Hospital, ShoppingCart } from 'lucide-react';
import { House, MapProps, Location, EnhancedPOI } from '../types';

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
  const [mapZoom, setMapZoom] = useState(zoom);
  const [schools, setSchools] = useState<EnhancedPOI[]>([]);
  const [hospitals, setHospitals] = useState<EnhancedPOI[]>([]);
  const [supermarkets, setSupermarkets] = useState<EnhancedPOI[]>([]);
  const [showSchools, setShowSchools] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showSupermarkets, setShowSupermarkets] = useState(true);
  const [searchRadius, setSearchRadius] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lon });
      map?.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lon });
    }
  }, [selectedLocation, map]);

  useEffect(() => {
    if (selectedHouse && selectedHouse.latitude && selectedHouse.longitude) {
      fetchPOIs(selectedHouse.latitude, selectedHouse.longitude);
    }
  }, [selectedHouse, searchRadius]);

  const fetchPOIs = async (lat: number, lon: number) => {
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
        );
        out center;
      `;
      const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: query } });
      const newSchools: EnhancedPOI[] = [];
      const newHospitals: EnhancedPOI[] = [];
      const newSupermarkets: EnhancedPOI[] = [];

      await Promise.all(response.data.elements.map(async (el: any) => {
        const poi: EnhancedPOI = {
          id: el.id.toString(),
          name: el.tags.name || 'Unnamed POI',
          lat: el.lat || el.center.lat,
          lon: el.lon || el.center.lon,
          type: el.tags.amenity as 'school' | 'hospital' || el.tags.shop as 'supermarket',
          additionalInfo: el.tags['school:type'] || el.tags.healthcare || el.tags.shop || el.tags.amenity,
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

        if (poi.type === 'school') {
          newSchools.push(poi);
        } else if (poi.type === 'hospital') {
          newHospitals.push(poi);
        } else if (poi.type === 'supermarket') {
          newSupermarkets.push(poi);
        }
      }));

      setSchools(newSchools);
      setHospitals(newHospitals);
      setSupermarkets(newSupermarkets);
    } catch (err) {
      setError('Failed to fetch POIs. Please try again.');
      console.error('Error fetching POIs:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const renderPOIMarker = (poi: EnhancedPOI) => (
    <Marker
      key={poi.id}
      position={{ lat: poi.lat, lng: poi.lon }}
      icon={{
        url: `http://maps.google.com/mapfiles/ms/icons/${poi.type === 'school' ? 'blue' : poi.type === 'hospital' ? 'red' : 'green'}-dot.png`,
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
        mapContainerStyle={{ height: '70vh', width: '100%' }}
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
        {showSchools && schools.map(renderPOIMarker)}
        {showHospitals && hospitals.map(renderPOIMarker)}
        {showSupermarkets && supermarkets.map(renderPOIMarker)}
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
                checked={showSchools}
                onChange={() => setShowSchools(!showSchools)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showSchools" className="flex items-center">
                <School className="mr-2 text-blue-500" />
                <span>Show Schools ({schools.length})</span>
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="showHospitals"
                checked={showHospitals}
                onChange={() => setShowHospitals(!showHospitals)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showHospitals" className="flex items-center">
                  <Hospital className="mr-2 text-red-500" />
                  <span>Show Hospitals ({hospitals.length})</span>
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showSupermarkets"
                  checked={showSupermarkets}
                  onChange={() => setShowSupermarkets(!showSupermarkets)}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showSupermarkets" className="flex items-center">
                  <ShoppingCart className="mr-2 text-green-500" />
                  <span>Show Supermarkets ({supermarkets.length})</span>
                </label>
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