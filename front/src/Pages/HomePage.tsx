import React, { useState, useEffect } from 'react';
import HouseListings from '../Component/HouseListings';

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
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const handleHouseSelect = (house: House) => {
    console.log('Selected house:', house);
  };

  return (
    <div className="flex">
      <main className="flex-1">
        <HouseListings houses={houses} onHouseSelect={handleHouseSelect} />
      </main>
    </div>
  );
}

export default HomePage;