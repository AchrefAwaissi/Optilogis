import { useJsApiLoader } from '@react-google-maps/api';

const googleMapsApiKey = "AIzaSyAh0yrnHc34HwncDoKBMYutdQCSueTc9FA";

export const useGoogleMapsLoader = () => {
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries: ['places']
  });
};

export const mapContainerStyle = { height: '90vh', width: '100%' };

export const defaultCenter = { lat: 44.8378, lng: -0.5792 };

export const defaultZoom = 13;

export const getMarkerIcon = (type: 'school' | 'hospital' | 'supermarket' | 'restaurant') => {
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

export const getGoogleMapsUrl = (placeId: string) => {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
};