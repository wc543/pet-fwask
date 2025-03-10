import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../AuthContext';
import './Dashboard.css';

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [fosterExpiration, setFosterExpiration] = useState<FosterExpiration[]>([]);
    const [forms, setForms] = useState<Forms[]>([]);
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
            console.log(messages);
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

    useEffect(() => {
        fetchMessages();
        fetchPets();
        fetchForms();
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

        </div>
    );
}

export default Dashboard;