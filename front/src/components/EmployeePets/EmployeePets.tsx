import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeePets.css';

interface Pet {
    pet_id: number;
    name: string;
    type: string;
    breed: string;
    size: number;
    gender: string;
    age: number;
    color: string;
    created_by_id: number;
    fosterable: boolean;
    pet_image_url: string;
    shelter_time: Date;
    current_foster: number;
    current_adopter: number;
    note: string;
}

const EmployeePets: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPets = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch("/api/pets");
            if (!response.ok) {
                throw new Error("Failed to fetch pets");
            }

            const data = await response.json();
            console.log(data);
            setPets(data.pets);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch pets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleViewPet = (pet: Pet) => {
        const petId = pet.pet_id;
        navigate(`/pets/id/${petId}`);
    };

    return (
        <>
        <div>
            <h2>Pets</h2>

            <div>
                <button onClick={() => navigate(`/pets/create`)}>Add Pet</button>
                <br/>
                <br/>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Breed</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Size</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.length > 0 ? (
                            pets.map((pet, index) => (
                                <tr key={index}>
                                    <td className='pet_image_td'>
                                        <div className='pet_image_wrapper'>
                                            <img className="pet_image" src={`../../../public/${pet.pet_image_url}`}/>
                                        </div>
                                    </td>
                                    <td>{pet.name}</td>
                                    <td>{pet.type}</td>
                                    <td>{pet.breed}</td>
                                    <td>{pet.age}</td>
                                    <td>{pet.gender}</td>
                                    <td>{pet.size}</td>
                                    <td>
                                        <button onClick={() => handleViewPet(pet)}>View</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8}>No pets found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}

        </div>
        </>
    );
};

export default EmployeePets;