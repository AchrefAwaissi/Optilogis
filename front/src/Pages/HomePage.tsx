import React, { useState, useEffect } from 'react';
import HouseListings from '../Component/HouseListings';
import Filter from '../Component/Filter';
import { FilterCriteria, Location, House } from '../types';
import MapComponent from '../Component/Map';

const HomePage: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    location: '',
    minPrice: 0,
    maxPrice: 10000,
    minSize: 0,
    maxSize: 1000,
    typeOfHousing: '',
  });

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    filterHouses();
  }, [houses, filterCriteria]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/item');
      if (!response.ok) {
        throw new Error('Failed to fetch houses');
      }
      const data: House[] = await response.json();
      setHouses(data);
      setFilteredHouses(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching houses:', error);
      setError('Failed to load houses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterHouses = () => {
    const filtered = houses.filter((house) => {
      const matchesLocation = !filterCriteria.location ||
        (house.city && house.city.toLowerCase().includes(filterCriteria.location.toLowerCase())) ||
        (house.address && house.address.toLowerCase().includes(filterCriteria.location.toLowerCase()));

      const matchesPrice = house.price >= filterCriteria.minPrice && house.price <= filterCriteria.maxPrice;

      const matchesSize = house.area >= filterCriteria.minSize && house.area <= filterCriteria.maxSize;

      const matchesType = !filterCriteria.typeOfHousing || 
        (house.typeOfHousing && house.typeOfHousing.toLowerCase().includes(filterCriteria.typeOfHousing.toLowerCase()));

      // Debugging logs
      console.log('Filter type:', filterCriteria.typeOfHousing);
      console.log('House type:', house.typeOfHousing);
      console.log('Matches type:', matchesType);

      return matchesLocation && matchesPrice && matchesSize && matchesType;
    });
    setFilteredHouses(filtered);
  };

  const handleFilterChange = (newCriteria: Partial<FilterCriteria>) => {
    setFilterCriteria((prevCriteria) => ({ ...prevCriteria, ...newCriteria }));
  };

  const handleLocationSelect = (location: Location) => {
    console.log('Selected location:', location);
    setFilterCriteria((prevCriteria) => ({ ...prevCriteria, location: location.location }));
  };

  const handleHouseSelect = (house: House) => {
    console.log('Selected house:', house);
    // Implement navigation or modal opening logic here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Filter Section */}
      <div className="w-[250px] bg-white overflow-y-auto m-4">
        <Filter
          onFilterChange={handleFilterChange}
          onLocationSelect={handleLocationSelect}
          filterCriteria={filterCriteria}
        />
      </div>

      {/* House Listings Section */}
      <div className="w-[450px] overflow-y-auto p-4 m-4">
        <h2 className="text-2xl font-bold mb-4">
          {filteredHouses.length} Results in {filterCriteria.location || 'All Locations'}
        </h2>
        {loading ? (
          <p>Loading houses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <HouseListings houses={filteredHouses} onHouseSelect={handleHouseSelect} />
        )}
      </div>

      {/* Map Section */}
      <div
        className="flex-1 bg-gray-100 m-4"
        style={{
          borderRadius: '10px',
        }}
      >
        <div className="h-full flex items-center justify-center text-gray-500">
          <MapComponent/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;