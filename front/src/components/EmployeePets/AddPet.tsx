import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TextField, MenuItem, ToggleButton, Checkbox, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddPet: React.FC = () => {
    let [petName, setPetName] = useState('');
    let [petType, setPetType] = useState('');
    let [petBreed, setPetBreed] = useState('');
    let [petSize, setPetSize] = useState(0);
    let [petGender, setPetGender] = useState('');
    let [petAge, setPetAge] = useState(0);
    let [petColor, setPetColor] = useState('');
    let [petNote, setPetNote] = useState('');
    let [eligibleFoster, setEligibleFoster] = useState(false);
    let [arrivalDate, setArrivalDate] = useState(null);
    let [petImage, setPetImage] = useState('');
    const navigate = useNavigate();

    const handleAddPet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let newPet = {
                    name: petName,
                    type: petType,
                    breed: petBreed,
                    size: petSize,
                    gender: petGender,
                    age: petAge,
                    color: petColor,
                    created_by_id: 1,   // TODO - change
                    fosterable: eligibleFoster,
                    pet_image_url: petImage,
                    shelter_time: arrivalDate,
                    current_foster: null,
                    current_adopter: null,
                    note: petNote,
                };
            let response = await axios.post('/api/pets/', newPet);
            console.log("Posted new pe successfully :", response.data);

            setPetName('');
            setPetType('');
            setPetBreed('');
            setPetSize(0);
            setPetGender('');
            setPetAge(0);
            setPetColor('');
            setPetNote('');
            setEligibleFoster(false);
            setArrivalDate(null);
            setPetImage('');
            alert("Successfully added pet!");
            navigate('/pets');
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
        <Box sx={{ minWidth: 120 }} component="form" onSubmit={handleAddPet}>
            <br/>
            <FormControl fullWidth>
                <TextField required label="Name" value={petName} onChange={e => setPetName(e.target.value)}/>
                <TextField select required label="Type" value={petType} onChange={e => setPetType(e.target.value)}>
                    <MenuItem value="Cat">Cat</MenuItem>
                    <MenuItem value="Dog">Dog</MenuItem>
                    <MenuItem value="Bird">Bird</MenuItem>
                    <MenuItem value="Rabbit">Rabbit</MenuItem>
                    <MenuItem value="Reptile">Reptile</MenuItem>
                    <MenuItem value="Horse">Horse</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField required label="Breed" value={petBreed} onChange={e => setPetBreed(e.target.value)}/>
                <TextField select required label="Size" value={petSize} onChange={e => setPetSize(+e.target.value)}>
                    <MenuItem value={0}>Small</MenuItem>
                    <MenuItem value={1}>Medium</MenuItem>
                    <MenuItem value={2}>Large</MenuItem>
                    <MenuItem value={3}>Extra-Large</MenuItem>
                </TextField>
                <TextField select required label="Gender" value={petName} onChange={e => setPetGender(e.target.value)}>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                </TextField>
                <TextField required label="Age" value={petAge} onChange={e => setPetAge(+e.target.value)}/>
                <TextField required label="Color" value={petColor} onChange={e => setPetColor(e.target.value)}/>
                <TextField required label="Note" value={petNote} onChange={e => setPetNote(e.target.value)}/>
                <ToggleButton value={true} selected={false} onChange={() => setEligibleFoster((prevSelected) => !prevSelected)}>
                    <Checkbox/>
                    <label>Eligible for foster</label>
                </ToggleButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Basic date picker" />
                </LocalizationProvider>
                <Button onClick={() => alert("to do")}>Upload image</Button>
            </FormControl>
        </Box>
        </>
    )

};

export default AddPet;