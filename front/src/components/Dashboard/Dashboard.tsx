import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../AuthContext';
import { Pet } from '../Pets/types.ts'
import './Dashboard.css';
import { TableContainer, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
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
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>Forms</h2>
                <table>
                    <thead>
                        <tr>
                        <th>Form Type</th>
                        <th>Submitted By</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.length > 0 ? (
                        forms.map((form, index) => (
                            <tr key={`${form.form_type}-${form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id || index}`}>
                            <td>{form.form_type}</td>
                            <td>{form.user_name}</td>
                            <td>
                                <button onClick={() => handleViewForm(form)}>View</button>
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={5}>No forms found</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <h2>Foster Expiration</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Pet Name</th>
                            <th>Expiration Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fosterExpiration.length > 0 ? (
                            fosterExpiration.map((foster) => (
                                <tr key={foster.pet_id}>
                                    <td>{foster.name}</td>
                                    <td>{foster.end_date}</td>
                                    <td>
                                        <button onClick={() => handleViewExpiration(foster)}>View</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2}>No foster expiration data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div id="pets_table_wrapper">
                <h2>My Listed Pets</h2>
                <TableContainer id="pets_table_container">
                    <Table id="pets_table" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                            <>
                            {pets.length > 0 ? (
                                pets.map((pet, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='pets_table_cell pet_image_cell'>
                                            <div className='pet_image_wrapper'>
                                                <img className='pet_image' src={pet.pet_image_url ? (`/${pet.pet_image_url}`) : ('/no_image.png')}/>
                                            </div>
                                        </TableCell>
                                        <TableCell className='pets_table_cell'>{pet.name}</TableCell>
                                        <TableCell className='pets_table_cell'>Notes: {pet.notes === null || '' ? ('--') : (pet.notes)}</TableCell>
                                        <TableCell className='pets_table_cell'>
                                            <div className='open_button_wrapper'>
                                                <Button onClick={() => navigate(`/pets/id/${pet.pet_id}`)}><LaunchIcon htmlColor='black'/></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>No pets listed</TableCell>
                                </TableRow>
                            )}
                            </>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div>
    );
}

export default Dashboard;