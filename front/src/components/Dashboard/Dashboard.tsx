import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../AuthContext';
import { Pet } from '../Pets/types.ts'
import './Dashboard.css';
import { TableContainer, Table, TableBody, TableCell, TableRow, Button, TableHead, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LaunchIcon from '@mui/icons-material/Launch';

interface Message {
    message_id: number;
    sender_name: string;
    pet_name: string;
    message_preview: string;
}

interface FosterExpiration {
    pet_id: number;
    name: string;
    end_date: string;
}

interface Forms {
    adoption_form_id?: number;
    foster_parent_form_id?: number;
    foster_pet_form_id?: number;
    user_name: string;
    form_type: string;
}

const Dashboard: React.FC = () => {
    const [, setMessages] = useState<Message[]>([]);
    const [fosterExpiration, setFosterExpiration] = useState<FosterExpiration[]>([]);
    const [forms, setForms] = useState<Forms[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const response = await fetch("/api/messages");
            
            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }

            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.error("Error fetching messages: ", err);
        }
    };

    const fetchPets = async () => {
        const user_id = auth?.user.user_id;
        try {
            const response = await fetch(`/api/foster-history/expiration/${user_id}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch pets");
            }

            const data = await response.json();
            setFosterExpiration(data);
        } catch (err) {
            console.error("Error fetching pets: ", err);
        }
    };

    const fetchForms = async () => {
        const user_id = auth?.user.user_id;
        try {
            const response = await fetch(`/api/forms/unprocessed/${user_id}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch forms");
            }

            const data = await response.json();
            setForms(data);
        } catch (err) {
            console.error("Error fetching forms: ", err);
        }
    };

    const fetchPetsByUser = async () => {
        const user_id = auth?.user.user_id;
        try {
            console.log("Got here");
            const response = await fetch(`/api/pets/user/${user_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch pets by user");
            }
            const data = await response.json();
            setPets(data.pets);
        } catch (err) {
            console.error("Error fetching pets by user:", err);
        }
    }

    useEffect(() => {
        fetchMessages();
        fetchPets();
        fetchForms();
        fetchPetsByUser();
    }, []);

    const handleViewForm = (form: Forms) => {
        const formId = form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id;
        navigate(`/forms/${form.form_type}/${formId}`);
    };

    const handleViewExpiration = (foster: FosterExpiration) => {
        navigate(`/pets/id/${foster.pet_id}`);
    };

    return (
        <>
        <div id="content">
            <div id="top">
                <div id="forms_wrapper">
                    <TableContainer id="forms_table_container" sx={{ borderRadius: '10px', border: 'hidden', backgroundColor: '#D9D9D9' }}>
                    <Typography variant="h2">Forms</Typography>
                        <Table id="forms_table" sx={{ minWidth: 300, border: 'hidden' }} aria-label='simple table'>
                            <TableBody className='table_body'>
                                {forms.length > 0 ? (
                                    forms.map((form, index) => (
                                        <TableRow key={`${form.form_type}-${form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id || index}`}>
                                            <TableCell className='forms_table_cell' id={index === 0 ? ('forms_firstrow') : ('')}>{form.form_type}</TableCell>
                                            <TableCell className='forms_table_cell' id={index === 0 ? ('forms_firstrow') : ('')}>{form.user_name}</TableCell>
                                            <TableCell className='forms_table_cell' id={index === 0 ? ('forms_firstrow') : ('')} sx={{ textAlign: 'right' }}>
                                                <Button onClick={() => handleViewForm(form)}><VisibilityIcon htmlColor='black'/></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell sx={{ border: 'hidden' }}>No forms found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div id="pets_wrapper">
                    <TableContainer id="pets_table_container" sx={{ borderRadius: '10px', border: 'hidden', backgroundColor: '#D9D9D9' }}>
                    <Typography variant="h2">My Listed Pets</Typography>
                        <Table id="pets_table" sx={{ minWidth: 300, border: 'hidden' }} aria-label="simple table">
                            <TableBody>
                                <>
                                {pets.length > 0 ? (
                                    pets.map((pet, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='pets_table_cell pet_image_cell' id={index === 0 ? ('pets_firstrow') : ('')} align='left'>
                                                <div className='pet_image_wrapper'>
                                                    <img className='pet_image' src={pet.pet_image_url ? (`/${pet.pet_image_url}`) : ('/no_image.png')}/>
                                                </div>
                                            </TableCell>
                                            <TableCell className='pets_table_cell' id={index === 0 ? ('pets_firstrow') : ('')} align='center'>{pet.name}</TableCell>
                                            <TableCell className='pets_table_cell' id={index === 0 ? ('pets_firstrow') : ('')} align='center'>Notes: {pet.notes === null || '' ? ('--') : (pet.notes)}</TableCell>
                                            <TableCell className='pets_table_cell' id={index === 0 ? ('pets_firstrow') : ('')} align='right'>
                                                <div className='open_button_wrapper'>
                                                    <Button onClick={() => navigate(`/pets/id/${pet.pet_id}`)}><LaunchIcon htmlColor='black'/></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell sx={{ border: 'hidden' }}>No pets listed</TableCell>
                                    </TableRow>
                                )}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div id="bottom">
                <div id="fosterexp_wrapper">
                    <TableContainer id='fosterexp_table_container' sx={{ borderRadius: '10px', border: 'hidden', backgroundColor: '#D9D9D9' }}>
                        <Typography variant="h2">Foster Expirations</Typography>
                        <Table id='fosterexp_table' sx={{ minWidth: 650, border: 'hidden' }} aria-label="simple table">
                            <TableBody>
                                {fosterExpiration.length > 0 ? (
                                    fosterExpiration.map((foster, index) => (
                                        <TableRow key={foster.pet_id}>
                                            <TableCell className='fosterexp_table_cell' id={index === 0 ? ('fosterexp_firstrow') : ('')} align='left'>{foster.name}</TableCell>
                                            <TableCell className='fosterexp_table_cell' id={index === 0 ? ('fosterexp_firstrow') : ('')} align='left'>{foster.end_date}</TableCell>
                                            <TableCell className='fosterexp_table_cell' id={index === 0 ? ('fosterexp_firstrow') : ('')} align='right'>
                                                <Button onClick={() => handleViewExpiration(foster)}><LaunchIcon htmlColor='black'/></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell sx={{ border: 'hidden' }}>No foster expiration data found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
        </>
    );
}

export default Dashboard;