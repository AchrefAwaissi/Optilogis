import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { X, School } from 'lucide-react';
import { House, MapProps, Location, EnhancedPOI } from '../types';

const MapComponent: React.FC<MapProps> = ({ 
  houses, 
  selectedLocation, 
  onLocationSelect,
  center = [44.8378, -0.5792], 
  zoom = 13 
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA"
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: center[0], lng: center[1] });
  const [mapZoom, setMapZoom] = useState(zoom);
  const [schools, setSchools] = useState<EnhancedPOI[]>([]);
  const [showSchools, setShowSchools] = useState(true);
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
      fetchSchools(selectedHouse.latitude, selectedHouse.longitude);
    }
  }, [selectedHouse, searchRadius]);

  const fetchSchools = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const query = `
        [out:json];
        (
          node["amenity"="school"](around:${searchRadius},${lat},${lon});
          way["amenity"="school"](around:${searchRadius},${lat},${lon});
          relation["amenity"="school"](around:${searchRadius},${lat},${lon});
        );
        out center;
      `;
      const response = await axios.get('https://overpass-api.de/api/interpreter', { params: { data: query } });
      const newSchools: EnhancedPOI[] = response.data.elements.map((el: any) => ({
        id: el.id.toString(),
        name: el.tags.name || 'Unnamed School',
        lat: el.lat || el.center.lat,
        lon: el.lon || el.center.lon,
        type: 'school',
        additionalInfo: el.tags['school:type'] || 'School',
        stars: Math.floor(Math.random() * 5) + 1
      }));
      setSchools(newSchools);
    } catch (err) {
      setError('Failed to fetch schools. Please try again.');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHouseClick = (house: House) => {
    setSelectedHouse(house);
    setShowFilters(true);
    if (house.latitude && house.longitude) {
      onLocationSelect({ location: house.address, lat: house.latitude, lon: house.longitude });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <span key={index} className="text-yellow-400">★</span>
    ));
  };

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
        {showSchools && schools.map((school) => (
          <Marker
            key={school.id}
            position={{ lat: school.lat, lng: school.lon }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
            onClick={() => setActiveInfoWindow(school.id)}
          >
            {activeInfoWindow === school.id && (
              <InfoWindow onCloseClick={() => setActiveInfoWindow(null)}>
                <div>
                  <h3 className="font-bold">{school.name}</h3>
                  <p>Type: {school.additionalInfo}</p>
                  {selectedHouse && selectedHouse.latitude && selectedHouse.longitude && (
                    <p>Distance: {calculateDistance(selectedHouse.latitude, selectedHouse.longitude, school.lat, school.lon).toFixed(2)} km</p>
                  )}
                  <div className="flex items-center">
                    {renderStars(school.stars || 0)}
                    <span className="ml-1">{school.stars}/5</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>

      <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-md z-[1000]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">School Filter</h3>
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
          </>
        )}
        {loading && <p className="mt-2">Loading schools...</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  ) : <></>;
};

export default MapComponent;