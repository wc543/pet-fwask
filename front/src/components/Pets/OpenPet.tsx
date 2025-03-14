import './OpenPet.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Pet } from './types.ts'
import { StartConversationButton } from '../Chats/StartConversationButton.tsx';
import { AuthContext } from '../AuthContext.tsx';
import { useUser } from '../Users/UserContext.tsx';
import BackButton from '../BackButton.tsx';

const OpenPet: React.FC = () => {
    let [selectedPet, setSelectedPet] = useState<Pet|null>(null);
    let [loading, setLoading] = useState(false);
    let [, setError] = useState('');
    let {id} = useParams();
    const navigate = useNavigate();
    const{ getRole, getFullname } = useUser();
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
                <>
                <BackButton></BackButton>
                <Box className="Box" sx={{ minWidth: 120}}>
                    <div id="wrapper">
                        <div id="top_wrapper">
                            <div id="image_wrapper">
                                <img id="image" src={selectedPet.pet_image_url ? (`/${selectedPet.pet_image_url}`) : ('/no_image.png')}/>
                                <Typography variant='h4'>Meet {selectedPet.name}!</Typography >
                            </div>
                            <div id="employee_buttons">
                                {(role === 'STAFF' && user_id === selectedPet.created_by_id) ? (
                                    <Button onClick={() => navigate(`/pets/edit/${selectedPet.pet_id}`)}><EditIcon htmlColor='black'/></Button>
                                ): (<></>)}
                            </div>
                        </div>
                        <div id="bottom_wrapper">
                            <div id="col1">
                                <Typography variant="body1" paragraph align="left">Type: {selectedPet.type}</Typography >
                                <Typography variant="body1" paragraph align="left">Breed: {selectedPet.breed}</Typography >
                                <Typography variant="body1" paragraph align="left">Size: {selectedPet.size}</Typography >
                                <Typography variant="body1" paragraph align="left">Gender: {selectedPet.gender}</Typography >
                                <Typography variant="body1" paragraph align="left">Age: {selectedPet.age}</Typography >
                            </div>
                            <div id="col2">
                                <Typography variant="body1" paragraph align="left">Color: {selectedPet.color}</Typography >
                                <Typography variant="body1" paragraph align="left">Arrival date: {selectedPet.shelter_time.toString()}</Typography >
                                {role === 'STAFF' ? (
                                    <>
                                    <Typography variant="body1" paragraph align="left">Current Adopter: {selectedPet.current_adopter === null ? ('--') : (getFullname(selectedPet.current_adopter))}</Typography >
                                    {selectedPet.fosterable === 1 ? (<Typography variant="body1" paragraph align="left">Current Foster: {selectedPet.current_foster === null ? ('--') : (getFullname(selectedPet.current_foster))}</Typography >) : (<></>)}
                                    <Typography variant="body1" paragraph align="left">Notes: {selectedPet.notes}</Typography >
                                    </>
                                ) : (<></>)}
                            </div>
                            <div id="col3">
                                {role === 'STAFF' ? (<></>) : (
                                    <>
                                    <StartConversationButton pet_id={selectedPet.pet_id} employee_id={selectedPet.created_by_id}  />
                                    {role === 'FOSTER' && selectedPet.fosterable === 1 ? (
                                        <Button 
                                        variant='contained' 
                                        className='actionButton' 
                                        style={{ marginLeft: '5%', backgroundColor: 'black' }}
                                        onClick={() => navigate(`/forms/submitFosterPetForm/${selectedPet.pet_id}`)}>
                                            Apply to Foster
                                        </Button>
                                        ) : (<></>)}
                                    <Button 
                                    variant='contained' 
                                    className='actionButton' 
                                    style={{ marginLeft: '5%', backgroundColor: 'black' }}
                                    onClick={() => navigate(`/forms/submitAdoptionForm/${selectedPet.pet_id}`)}>
                                        Apply to Adopt
                                    </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Box>
                </>
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