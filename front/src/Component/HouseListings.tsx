import React from "react";
import { House } from "../types";

interface HouseListingsProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
}

const PropertyCard: React.FC<{ house: House; onClick: () => void }> = ({ house, onClick }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      width: '100%',
      maxWidth: '600px',
      height: '172px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
      transition: 'box-shadow 0.3s ease',
      display: 'flex',
    },
    imageContainer: {
      width: '165px',
      height: '155px',
      margin: '8.5px',
      borderRadius: '10px',
      backgroundImage: `url(${house.image ? `http://localhost:5000/uploads/${house.image}` : 'https://via.placeholder.com/165x155'})`,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    },
    contentContainer: {
      flex: 1,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: '18px',
      fontWeight: 500,
      color: '#303030',
      marginBottom: '4px',
    },
    address: {
      fontSize: '12px',
      color: '#303030',
      marginBottom: '8px',
    },
    price: {
      fontSize: '15px',
      fontWeight: 500,
      color: '#095550',
    },
    infoContainer: {
      display: 'flex',
      marginBottom: '8px',
    },
    infoItem: {
      fontSize: '12px',
      color: '#94a3b8',
      backgroundColor: '#f1f3f5',
      borderRadius: '11px',
      padding: '4px 8px',
      marginRight: '8px',
    },
    button: {
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      padding: '8px 16px',
      backgroundColor: '#2463eb',
      color: 'white',
      border: 'none',
      borderRadius: '9px',
      fontSize: '14px',
      fontWeight: 'normal',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
  };

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  };

  return (
    <div style={styles.card} onClick={onClick} onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
      <div style={styles.imageContainer} />
      <div style={styles.contentContainer}>
        <div>
          <h3 style={styles.title}>{house.title}</h3>
          <p style={styles.address}>{`${house.address}, ${house.city}`}</p>
          <div style={styles.infoContainer}>
            <span style={styles.infoItem}>= {house.rooms || 'N/A'}</span>
            <span style={styles.infoItem}>= {house.bedrooms || 'N/A'}</span>
            <span style={styles.infoItem}>{house.area || 'N/A'} sqft</span>
          </div>
        </div>
        <p style={styles.price}>${house.price.toLocaleString()}/ month</p>
      </div>
      <button style={styles.button}>
        View details
      </button>
    </div>
  );
};

const HouseListings: React.FC<HouseListingsProps> = ({ houses, onHouseSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {houses.map((house) => (
        <PropertyCard
          key={house._id}
          house={house}
          onClick={() => onHouseSelect(house)}
        />
      ))}
    </div>
  );
};

export default HouseListings;