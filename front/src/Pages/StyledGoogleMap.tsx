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
  show3D: boolean;
}

const StyledGoogleMap: React.FC<StyledGoogleMapProps> = ({ lat, lng, show3D }) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  const mapOptions = useMemo(() => ({
    mapTypeId: show3D ? 'satellite' : 'roadmap',
    tilt: show3D ? 45 : 0,
  }), [show3D]);

  if (loadError) {
    return <div>Erreur lors du chargement de la carte</div>;
  }

  if (!isLoaded) {
    return <div>Chargement des cartes</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={center}
      options={mapOptions}
    />
  );
};

export default StyledGoogleMap;
