import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapProps, House, Location } from '../types';

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

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation: Location = {
        location: `${e.latLng.lat()}, ${e.latLng.lng()}`,
        lat: e.latLng.lat(),
        lon: e.latLng.lng()
      };
      onLocationSelect(newLocation);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ height: '100%', width: '100%' }}
      center={{ lat: center[0], lng: center[1] }}
      zoom={zoom}
      onClick={handleMapClick}
    >
      {houses.map((house) => (
        <Marker
          key={house._id}
          position={{ lat: house.latitude || 0, lng: house.longitude || 0 }}
          title={house.title}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;