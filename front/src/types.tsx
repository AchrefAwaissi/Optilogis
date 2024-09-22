export interface House {
  likes?: string[];
  _id: string;
  name?: string;
  description?: string;
  price: number;
  images?: string[];
  title?: string;
  address: string;
  city: string;
  country: string;
  typeOfHousing?: string;
  rooms?: number;
  bedrooms?: number;
  area?: number;
  latitude?: number;
  longitude?: number;
  floor?: number;
  annexArea?: number;
  furnished?: boolean;
  accessibility?: string;
}

export interface FilterCriteria {
  location: string;
  minPrice: number;
  maxPrice: number;
  minSize: number;
  maxSize: number;
  typeOfHousing: '' | 'studio' | 'appartement' | 'maison';
  minRooms?: number;
  maxRooms?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnished?: boolean;
  accessibility?: string;
  minFloor?: number;
  maxFloor?: number;
  minAnnexArea?: number;
  maxAnnexArea?: number;
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

export type POIType = 'school' | 'hospital' | 'supermarket' | 'restaurant';

export interface POI {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: POIType;
}

export interface EnhancedPOI extends POI {
  additionalInfo?: string;
  rating: number;
  userRatingsTotal: number;
  placeId: string;
  stars?: number; // Ajoutez cette ligne
}

export interface NeighborhoodInfo {
  name: string;
  description: string;
  lat: number;
  lon: number;
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