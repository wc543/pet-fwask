import './OpenPet.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Pet } from './types.ts'
import { StartConversationButton } from '../Chats/StartConversationButton.tsx';
import { AuthContext } from '../AuthContext.tsx';
import { useUser } from '../Users/UserContext.tsx';

const OpenPet: React.FC = () => {
    let [selectedPet, setSelectedPet] = useState<Pet|null>(null);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState('');
    let {id} = useParams();
    const navigate = useNavigate();
    const{ getRole } = useUser();
    const auth = useContext(AuthContext);
    const user_id = auth?.user?.user_id;
    const role = getRole(user_id);
    console.log('role =', role);

    const fetchPet = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`/api/pets/id/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch pet");
            }

            const data = await response.json();
            console.log(data.pets);
            setSelectedPet(data.pets);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch pet");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPet();
    }, []);

    return (
        <>
        {!loading ? (
            <>
            {selectedPet ? (
                <Box className="Box" sx={{ minWidth: 120}}>
                    <div id="wrapper">
                        <div id="top_wrapper">
                            <div id="image_wrapper">
                                <img id="image" src={selectedPet.pet_image_url ? (`/${selectedPet.pet_image_url}`) : ('/no_image.png')}/>
                                <h2>{selectedPet.name}</h2>
                            </div>
                            <div id="employee_buttons">
                                {(role === 'STAFF' && user_id === selectedPet.created_by_id) ? (
                                    <Button onClick={() => navigate(`/pets/edit/${selectedPet.pet_id}`)}><EditIcon htmlColor='black'/></Button>
                                ): (<></>)}
                            </div>
                        </div>
                        <div id="bottom_wrapper">
                            <div id="col1">
                                <p>Type: {selectedPet.type}</p>
                                <p>Breed: {selectedPet.breed}</p>
                                <p>Size: {selectedPet.size}</p>
                                <p>Gender: {selectedPet.gender}</p>
                                <p>Age: {selectedPet.age}</p>
                            </div>
                            <div id="col2">
                                <p>Color: {selectedPet.color}</p>
                                <p>Arrival date: {selectedPet.shelter_time.toString()}</p>
                                <p>Note: {selectedPet.notes}</p>
                            </div>
                            <div id="col3">
                                {role === 'STAFF' ? (<></>) : (
                                    <>
                                    <StartConversationButton pet_id={selectedPet.pet_id} employee_id={selectedPet.created_by_id}  />
                                    {role === 'FOSTER' && selectedPet.fosterable === 1 ? (
                                        <Button variant='contained' className='actionButton' style={{ marginLeft: '5%', backgroundColor: 'black' }}>Apply to Foster</Button>
                                        ) : (<></>)}
                                    <Button variant='contained' className='actionButton' style={{ marginLeft: '5%', backgroundColor: 'black' }}>Apply to Adopt</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Box>
                ) : (
                <div>Error fetching pet</div>
            )}
        </>) : (
            <div>Loading...</div>
        )}
        </>
      );
};

export default OpenPet;