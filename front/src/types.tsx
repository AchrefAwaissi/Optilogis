export interface FilterCriteria {
    location: string;
    minPrice: number;
    maxPrice: number;
    minSize: number;
    maxSize: number;
    typeOfHousing: string;
  }
  
  export interface Location {
    location: string;
    lat: number;
    lon: number;
  }
