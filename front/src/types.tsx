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