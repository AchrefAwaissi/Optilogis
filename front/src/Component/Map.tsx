import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA"
  });

  const mapContainerStyle = {
    width: '100%',
    height: '100%'  
  };

  const center = {
    lat: 44.8378,//bordeaux pour le test
    lng: -0.5792
  };

  return (
<div style={{ width: '100%', height: '100%', borderRadius: '10px' }}>
{isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
        </GoogleMap>
      ) : (
        <div>Chargement de la carte...</div>
      )}
    </div>
  );
}

export default MapComponent;