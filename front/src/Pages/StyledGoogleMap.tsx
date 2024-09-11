import React, { useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../Component/googleMapsConfig';

const mapContainerStyle = {
  width: '100%',
  height: '329px',
};

interface StyledGoogleMapProps {
  lat: number;
  lng: number;
}

const StyledGoogleMap: React.FC<StyledGoogleMapProps> = ({ lat, lng }) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();

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