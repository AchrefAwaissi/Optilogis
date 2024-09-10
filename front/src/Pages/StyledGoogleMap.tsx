import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

const libraries: Libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '329px',
};

interface StyledGoogleMapProps {
  lat: number;
  lng: number;
}

const StyledGoogleMap: React.FC<StyledGoogleMapProps> = ({ lat, lng }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA",
    libraries,
  });

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={center}
    />
  );
};

export default StyledGoogleMap;