import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { House } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined, faHeart, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const truncateAddress = (address: string, maxLength: number) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
};

const PropertyCard: React.FC<{ house: House; onEdit: () => void; onDelete: () => void }> = ({ house, onEdit, onDelete }) => {
    const truncatedAddress = truncateAddress(house.address, 30);

    const imageUrl = house.images && house.images.length > 0
        ? `http://localhost:5000/uploads/${house.images[0]}`
        : 'https://via.placeholder.com/165x155';

    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg flex flex-col sm:flex-row mb-4">
            <div className="relative w-full h-48 sm:w-40 sm:h-40 m-2">
                <div
                    className="w-full h-full rounded-xl bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{house.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{truncatedAddress}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                            <FontAwesomeIcon icon={faBath} className="mr-1" /> {house.rooms || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                            <FontAwesomeIcon icon={faBed} className="mr-1" /> {house.bedrooms || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                            <FontAwesomeIcon icon={faRulerCombined} className="mr-1" /> {house.area || 'N/A'} m²
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-teal-700">€{house.price.toLocaleString()}/ mois</p>
                    <div>
                        <button onClick={onEdit} className="mr-2 px-3 py-2 bg-[#095550] text-white text-sm font-normal rounded-lg hover:bg-[#074440] transition-colors duration-200">
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-1" /> Edit
                        </button>
                        <button onClick={onDelete} className="px-3 py-2 bg-red-500 text-white text-sm font-normal rounded-lg hover:bg-red-600 transition-colors duration-200">
                            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageItems: React.FC = () => {
    const { user } = useAuth();
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserHouses();
    }, [user]);

    const fetchUserHouses = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user?.id) {
                throw new Error('User ID is not available');
            }
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token is missing');
            }

            const url = 'http://localhost:5000/item';
            console.log('Fetching houses from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch houses: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched houses:', data);
            setHouses(data);
        } catch (err) {
            console.error('Error fetching houses:', err);
            setError(`Failed to load houses: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (houseId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token is missing');
            }

            const response = await fetch(`http://localhost:5000/item/${houseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete house');
            }
            setHouses(houses.filter(house => house._id !== houseId));
        } catch (err) {
            console.error('Error deleting house:', err);
            setError(`Failed to delete house: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleEdit = (houseId: string) => {
        // Implement edit functionality
        console.log('Edit house:', houseId);
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                <p>{error}</p>
                <button
                    onClick={fetchUserHouses}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Manage Your Properties</h1>
            {houses.length === 0 ? (
                <p className="text-center py-4">You haven't posted any properties yet.</p>
            ) : (
                <div className="space-y-4">
                    {houses.map(house => (
                        <PropertyCard
                            key={house._id}
                            house={house}
                            onEdit={() => handleEdit(house._id)}
                            onDelete={() => handleDelete(house._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageItems;