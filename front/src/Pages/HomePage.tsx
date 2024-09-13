import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faList } from "@fortawesome/free-solid-svg-icons";
import HouseListings from "../Component/HouseListings";
import Filter from "../Component/Filter";
import MapComponent from "../Component/Map";
import { FilterCriteria, Location, House } from "../types";

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
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();

  const toggleMap = () => {
    setShowMap(!showMap);
  };

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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Filter component */}
      <div className="w-full md:w-[250px] bg-white overflow-y-auto">
        <div className="m-4">
          <Filter
            onFilterChange={handleFilterChange}
            onLocationSelect={handleLocationSelect}
            filterCriteria={filterCriteria}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* House listings */}
        <div className={`w-full md:w-[500px] overflow-y-auto p-4 ${showMap ? 'hidden' : 'block'} md:block`}>
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

        {/* Map component */}
        <div className={`flex-1 bg-gray-100 ${showMap ? 'block' : 'hidden'} md:block h-[calc(100vh-64px)] md:h-auto`}>
          <MapComponent
            houses={filteredHouses}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>

      {/* Map toggle button */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-10 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        onClick={toggleMap}
      >
        <FontAwesomeIcon icon={showMap ? faList : faMap} />
      </button>
    </div>
  );
};

export default HomePage;