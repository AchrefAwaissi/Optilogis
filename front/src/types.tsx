export interface House {
  _id: string;
  image: string;
  price: number;
  address: string;
  city: string;
  typeOfHousing: string | undefined;
  title: string;
  rooms: number;
  bedrooms: number;
  area: number;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

export interface FilterCriteria {
  location: string;
  minPrice: number;
  maxPrice: number;
  minSize: number;
  maxSize: number;
  typeOfHousing: '' | 'studio' | 'appartement' | 'maison';
}

export interface Location {
  location: string;
  lat: number;
  lon: number;
}

export interface MapProps {
  houses: House[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  center?: [number, number];
  zoom?: number;
}

export interface School {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface POI {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'hospital' | 'school' | 'supermarket';
}

export interface NeighborhoodInfo {
  name: string;
  description: string;
  lat: number;
  lon: number;
}

export interface EnhancedPOI extends POI {
  additionalInfo?: string;
  stars?: number;
}

export interface EnhancedNeighborhoodInfo extends NeighborhoodInfo {
  stars?: number;
}

export interface TransitRoute {
  type: string;
  name: string;
  from: string;
  to: string;
}

export const getRouteType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'bus':
      return 'Bus';
    case 'subway':
    case 'metro':
      return 'Metro';
    case 'train':
      return 'Train';
    case 'tram':
      return 'Tram';
    default:
      return 'Transit';
  }
};
export interface EnhancedPOI {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'hospital' | 'school';
  rating: number;
  userRatingsTotal: number;
  placeId: string;
}
