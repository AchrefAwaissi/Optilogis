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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/item');
      if (!response.ok) {
        throw new Error('Failed to fetch houses');
      }
      const data: House[] = await response.json();
      setHouses(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching houses:', error);
      setError('Failed to load houses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleHouseSelect = (house: House) => {
    console.log('Selected house:', house);
    // Implement navigation or modal opening logic here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Filter Section */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <Filter />
      </div>

      {/* House Listings Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          {houses.length} Results in Scotland
        </h2>
        {loading ? (
          <p>Loading houses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <HouseListings houses={houses} onHouseSelect={handleHouseSelect} />
        )}
      </div>

      {/* Map Section */}
      <div className="w-1/3 bg-gray-100">
        <div className="h-full flex items-center justify-center text-gray-500">
          Map Component (Placeholder)
        </div>
      </div>
    </div>
  );
}

export default HomePage;