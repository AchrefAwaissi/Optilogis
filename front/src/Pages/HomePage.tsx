// import React, { useState, useEffect } from 'react';
// import HouseListings from '../Component/HouseListings';
// import Filter from '../Component/Filter';
// import { FilterCriteria, Location, House } from '../types';
// import MapComponent from '../Component/Map';

// const HomePage: React.FC = () => {
//   const [houses, setHouses] = useState<House[]>([]);
//   const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
//   const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
//     location: '',
//     minPrice: 0,
//     maxPrice: 10000,
//     minSize: 0,
//     maxSize: 1000,
//     typeOfHousing: '',
//   });

//   useEffect(() => {
//     fetchHouses();
//   }, []);

//   useEffect(() => {
//     filterHouses(houses, filterCriteria);
//   }, [houses, filterCriteria]);

//   const fetchHouses = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5000/item');
//       if (!response.ok) {
//         throw new Error('Failed to fetch houses');
//       }
//       const data: House[] = await response.json();
//       setHouses(data);
//       setFilteredHouses(data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching houses:', error);
//       setError('Failed to load houses. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterHouses = (housesToFilter: House[], criteria: FilterCriteria) => {
//     const filtered = housesToFilter.filter((house) => {
//       const matchesLocation = !criteria.location ||
//         (house.city && house.city.toLowerCase().includes(criteria.location.toLowerCase())) ||
//         (house.address && house.address.toLowerCase().includes(criteria.location.toLowerCase()));

//       const matchesPrice = house.price >= criteria.minPrice && house.price <= criteria.maxPrice;

//       const matchesSize = house.area >= criteria.minSize && house.area <= criteria.maxSize;

//       const matchesType = !criteria.typeOfHousing ||
//         (house.typeOfHousing && house.typeOfHousing.toLowerCase().includes(criteria.typeOfHousing.toLowerCase()));

//       return matchesLocation && matchesPrice && matchesSize && matchesType;
//     });
//     setFilteredHouses(filtered);
//   };

//   const handleFilterChange = (newCriteria: Partial<FilterCriteria>) => {
//     setFilterCriteria((prevCriteria) => {
//       const updatedCriteria = { ...prevCriteria, ...newCriteria };
//       filterHouses(houses, updatedCriteria);
//       return updatedCriteria;
//     });
//   };

//   const handleLocationSelect = (location: Location) => {
//     console.log('Selected location:', location);
//     setSelectedLocation(location);
//     setFilterCriteria((prevCriteria) => {
//       const newCriteria = { ...prevCriteria, location: location.location };
//       filterHouses(houses, newCriteria);
//       return newCriteria;
//     });
//   };

//   const handleHouseSelect = (house: House) => {
//     console.log('Selected house:', house);
//     // Implement navigation or modal opening logic here
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Filter Section */}
//       <div className="w-[250px] bg-white overflow-y-auto m-4">
//         <Filter
//           onFilterChange={handleFilterChange}
//           onLocationSelect={handleLocationSelect}
//           filterCriteria={filterCriteria}
//         />
//       </div>

//       {/* House Listings Section */}
//       <div className="w-[450px] overflow-y-auto p-4 m-4">
//         <h2 className="text-2xl font-bold mb-4">
//           {filteredHouses.length} Results in {filterCriteria.location || 'All Locations'}
//         </h2>
//         {loading ? (
//           <p>Loading houses...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <HouseListings houses={filteredHouses} onHouseSelect={handleHouseSelect} />
//         )}
//       </div>

//       {/* Map Section */}
//       <div className="flex-1 bg-gray-100 m-4" style={{ borderRadius: '10px' }}>
//         <MapComponent
//           houses={filteredHouses}
//           selectedLocation={selectedLocation}
//           onLocationSelect={handleLocationSelect}
//         />
//       </div>
//     </div>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from "react";
import HouseListings from "../Component/HouseListings";
import Filter from "../Component/Filter";
import { FilterCriteria, Location, House } from "../types";
import MapComponent from "../Component/Map";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    location: "",
    minPrice: 0,
    maxPrice: 10000,
    minSize: 0,
    maxSize: 1000,
    typeOfHousing: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    filterHouses();
  }, [houses, filterCriteria]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/item");
      if (!response.ok) {
        throw new Error("Failed to fetch houses");
      }
      const data: House[] = await response.json();
      setHouses(data);
      setFilteredHouses(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching houses:", error);
      setError("Failed to load houses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterHouses = () => {
    const filtered = houses.filter((house) => {
      const matchesLocation =
        !filterCriteria.location ||
        (house.city &&
          house.city
            .toLowerCase()
            .includes(filterCriteria.location.toLowerCase())) ||
        (house.address &&
          house.address
            .toLowerCase()
            .includes(filterCriteria.location.toLowerCase()));

      const matchesPrice =
        house.price >= filterCriteria.minPrice &&
        house.price <= filterCriteria.maxPrice;

      const matchesSize =
        house.area !== undefined &&
        house.area >= filterCriteria.minSize &&
        house.area <= filterCriteria.maxSize;

      const matchesType =
        !filterCriteria.typeOfHousing ||
        (house.typeOfHousing &&
          house.typeOfHousing
            .toLowerCase()
            .includes(filterCriteria.typeOfHousing.toLowerCase()));

      return matchesLocation && matchesPrice && matchesSize && matchesType;
    });
    setFilteredHouses(filtered);
  };

  const handleFilterChange = (newCriteria: Partial<FilterCriteria>) => {
    setFilterCriteria((prevCriteria) => ({ ...prevCriteria, ...newCriteria }));
  };

  const handleLocationSelect = (location: Location) => {
    console.log("Selected location:", location);
    setSelectedLocation(location);
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      location: location.location,
    }));
  };

  const handleHouseSelect = (house: House) => {
    navigate("/property-details", { state: { house } });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[250px] bg-white overflow-y-auto m-4">
        <Filter
          onFilterChange={handleFilterChange}
          onLocationSelect={handleLocationSelect}
          filterCriteria={filterCriteria}
        />
      </div>

      <div className="w-[500px] overflow-y-auto p-4 m-4">
        <h2 className="text-2xl font-bold mb-4">
          {filteredHouses.length} Results in{" "}
          {filterCriteria.location || "All Locations"}
        </h2>
        {loading ? (
          <p>Loading houses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <HouseListings
            houses={filteredHouses}
            onHouseSelect={handleHouseSelect}
          />
        )}
      </div>

      <div className="flex-1 bg-gray-100 m-4" style={{ borderRadius: "10px" }}>
        <MapComponent
          houses={filteredHouses}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </div>
  );
};

export default HomePage;
