import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faList } from "@fortawesome/free-solid-svg-icons";
import HouseListings from "../Component/HouseListings";
import Filter from "../Component/Filter";
import MapComponent from "../Component/Map";
import { FilterCriteria, Location, House } from "../types";
import { useItems } from "../contexts/ItemContext";

const HomePage: React.FC = () => {
  const { getUserItems } = useItems();
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    location: "",
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
    minSize: 0,
    maxSize: Number.MAX_SAFE_INTEGER,
    typeOfHousing: "",
    minRooms: undefined,
    maxRooms: undefined,
    minBedrooms: undefined,
    maxBedrooms: undefined,
    minArea: undefined,
    maxArea: undefined,
    furnished: undefined,
    accessibility: undefined,
    minFloor: undefined,
    maxFloor: undefined,
    minAnnexArea: undefined,
    maxAnnexArea: undefined,
  });
  const [showMap, setShowMap] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>("");

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
      const data = await getUserItems();
      console.log("Fetched houses in HomePage:", data.length);
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
          house.city.toLowerCase().includes(filterCriteria.location.toLowerCase())) ||
        (house.address &&
          house.address.toLowerCase().includes(filterCriteria.location.toLowerCase()));

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
          house.typeOfHousing.toLowerCase().includes(filterCriteria.typeOfHousing.toLowerCase()));

      const matchesRooms =
        (filterCriteria.minRooms === undefined || (house.rooms ?? 0) >= filterCriteria.minRooms) &&
        (filterCriteria.maxRooms === undefined || (house.rooms ?? 0) <= filterCriteria.maxRooms);

      const matchesBedrooms =
        (filterCriteria.minBedrooms === undefined || (house.bedrooms ?? 0) >= filterCriteria.minBedrooms) &&
        (filterCriteria.maxBedrooms === undefined || (house.bedrooms ?? 0) <= filterCriteria.maxBedrooms);

      const matchesFloor =
        (filterCriteria.minFloor === undefined || (house.floor ?? 0) >= filterCriteria.minFloor) &&
        (filterCriteria.maxFloor === undefined || (house.floor ?? 0) <= filterCriteria.maxFloor);

      const matchesAnnexArea =
        (filterCriteria.minAnnexArea === undefined || (house.annexArea ?? 0) >= filterCriteria.minAnnexArea) &&
        (filterCriteria.maxAnnexArea === undefined || (house.annexArea ?? 0) <= filterCriteria.maxAnnexArea);

      const matchesFurnished =
        filterCriteria.furnished === undefined || house.furnished === filterCriteria.furnished;

      const matchesAccessibility =
        !filterCriteria.accessibility || (house.accessibility !== '');

      return (
        matchesLocation &&
        matchesPrice &&
        matchesSize &&
        matchesType &&
        matchesRooms &&
        matchesBedrooms &&
        matchesFloor &&
        matchesAnnexArea &&
        matchesFurnished &&
        matchesAccessibility
      );
    });
    setFilteredHouses(filtered);
  };

  const handleFilterChange = (newCriteria: Partial<FilterCriteria>) => {
    setFilterCriteria((prevCriteria) => {
      const updatedCriteria = { ...prevCriteria, ...newCriteria };
      console.log("Filter criteria updated:", updatedCriteria);
      if (updatedCriteria.location !== prevCriteria.location) {
        setCurrentCity(updatedCriteria.location);
      }
      return updatedCriteria;
    });
  };

  const handleLocationSelect = (location: Location) => {
    console.log("Selected location:", location);
    setSelectedLocation(location);
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      location: location.location,
    }));
    setCurrentCity(location.location);
  };

  const handleHouseSelect = (house: House) => {
    navigate("/property-details", { state: { house } });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      <div className="w-full md:w-[250px] bg-white overflow-y-auto">
        <div className="m-4">
          <Filter
            onFilterChange={handleFilterChange}
            onLocationSelect={handleLocationSelect}
            filterCriteria={filterCriteria}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className={`w-full md:w-[500px] overflow-y-auto p-4 ${showMap ? 'hidden' : 'block'} md:block`}>
          {loading ? (
            <p>Loading houses...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <HouseListings
              houses={filteredHouses}
              onHouseSelect={handleHouseSelect}
              city={currentCity}
            />
          )}
        </div>

        <div className={`flex-1 bg-gray-100 ${showMap ? 'block' : 'hidden'} md:block h-[calc(100vh-64px)] md:h-auto rounded-lg`}>
          <MapComponent
            houses={filteredHouses}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>

      </div>

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