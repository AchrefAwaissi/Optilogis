import React, { useState, useEffect } from 'react';
import HouseListings from '../Component/HouseListings';
import Filter from '../Component/Filter';

interface House {
  _id: string;
  image: string;
  price: number;
  address: string;
  city: string;
  typeOfHousing: string;
  title: string;
  rooms: number;
  bedrooms: number;
  area: number;
  name: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const response = await fetch('http://localhost:5000/item');
      if (!response.ok) {
        throw new Error('Failed to fetch houses');
      }
      const data: House[] = await response.json();
      setHouses(data);
      setFilteredHouses(data);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const handleHouseSelect = (house: House) => {
    console.log('Selected house:', house);
  };

  const handleFilterChange = (filterCriteria: any) => {
    // Apply filters to the houses
    const filtered = houses.filter(house => {
      return (
        (!filterCriteria.location || house.city.toLowerCase().includes(filterCriteria.location.toLowerCase())) &&
        (!filterCriteria.typeOfPlace.length || filterCriteria.typeOfPlace.includes(house.typeOfHousing)) &&
        house.price >= filterCriteria.minPrice &&
        house.price <= filterCriteria.maxPrice &&
        house.area >= filterCriteria.minSize &&
        (filterCriteria.maxSize === 0 || house.area <= filterCriteria.maxSize)
      );
    });
    setFilteredHouses(filtered);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <Filter  />
      </aside>
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <HouseListings houses={filteredHouses} onHouseSelect={handleHouseSelect} />
        </div>
        <div className="w-[500px] bg-white shadow-md">
          {/* Map component will go here */}
          <div className="h-full flex items-center justify-center text-gray-500">
            Map Component (500px width)
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;