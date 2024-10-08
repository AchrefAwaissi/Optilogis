import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faList } from "@fortawesome/free-solid-svg-icons";
import HouseListings from "../Component/HouseListings";
import Filter from "../Component/Filter";
import MapComponent from "../Component/Map";
import { FilterCriteria, Location, House } from "../types";
import { useItems } from "../contexts/ItemContext";
import { useAuth } from "../contexts/AuthContext";

interface HomePageProps {
  showFavorites: boolean;
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}

const HomePage: React.FC<HomePageProps> = ({ showFavorites, selectedLocation, onLocationSelect }) => {
  const { getUserItems } = useItems();
  const { user } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    location: "",
    minPrice: 0,
    maxPrice: 15000,
    minSize: 0,
    maxSize: 1000,
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
  }, [houses, filterCriteria, showFavorites]);

  useEffect(() => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const data = await getUserItems();
      console.log("Maisons récupérées dans la page d'accueil :", data.length);
      setHouses(data);
      setFilteredHouses(data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des maisons :", error);
      setError("Échec du chargement des maisons. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const filterHouses = () => {
    let filtered = houses.filter((house) => {
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

    if (showFavorites && user) {
      filtered = filtered.filter(house => house.likes?.includes(user.id));
    }

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
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      location: location.location,
    }));
    setCurrentCity(location.location);
    onLocationSelect(location);  // Propagate the selection to the parent component
  };

  const handleHouseSelect = (house: House) => {
    navigate("/property-details", { state: { house } });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
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
            <p>Chargement des annonces...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <HouseListings
              houses={filteredHouses}
              onHouseSelect={handleHouseSelect}
              city={currentCity}
              showFavorites={showFavorites}
            />
          )}
        </div>
  
        <div className="flex-1 md:p-4 flex flex-col h-full">
          <div 
            className={`flex-1 w-full ${showMap ? 'block' : 'hidden'} md:block rounded-lg overflow-hidden`}
          >
            <MapComponent
              houses={filteredHouses}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>
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