import './AddPet.css';
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TextField, MenuItem, ToggleButton, Checkbox, Button, Paper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AuthContext } from '../AuthContext';

// error handling - referenced from activity 3b utils.ts
// https://medium.com/with-orus/the-5-commandments-of-clean-error-handling-in-typescript-93a9cbdf1af5
function ensureError(value: unknown): Error {
    if (value instanceof Error) return value;

    let stringified;
    try {
        stringified = JSON.stringify(value);
    } catch {
        stringified = "[Unable to stringify the thrown value]";
    }

    let error = new Error(
        `Thrown value was originally not an error; stringified value is: ${stringified}`,
    );
    return error;
}

// https://axios-http.com/docs/handling_errors
// https://github.com/axios/axios/issues/3612
function getAxiosErrorMessages(err: unknown): string {
    let error = ensureError(err);
    console.log(error);

    if (!axios.isAxiosError(error)) {
    return error.toString();
    }

    if (!error.response) {
    return "Server never sent response";
    }

    if (!error.response.data.errors) {
    return error.response.data?.error;
    } else {
    return error.response.data.errors[0];
    }
}

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
    let [arrivalDate, setArrivalDate] = useState<Dayjs | null>(dayjs());
    let [petImageUrl, setPetImageUrl] = useState('');
    let [petImageFile, setPetImageFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const auth = useContext(AuthContext);
    console.log("user id: ", auth?.user.user_id);

    const handleAddPet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // upload pet image
            let generatedPetImageUrl = "";
            if (petImageFile) {
                const formData = new FormData();
                formData.append('image', petImageFile);
                let response = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                generatedPetImageUrl = response.data.filePath;
                console.log('File uploaded:', generatedPetImageUrl);
            }

            // post pet
            let newPet = {
                    name: petName,
                    type: petType,
                    breed: petBreed,
                    size: petSize,
                    gender: petGender,
                    age: petAge,
                    color: petColor,
                    created_by_id: auth?.user.user_id,
                    fosterable: eligibleFoster,
                    pet_image_url: generatedPetImageUrl,
                    shelter_time: arrivalDate ? arrivalDate.format('YYYY-MM-DD') : null,
                    current_foster: null,
                    current_adopter: null,
                    note: petNote,
                };
                console.log(newPet);
            let response = await axios.post('/api/pets/', newPet);
            console.log("Posted new pet successfully :", response.data);

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
            setPetImageUrl('');
            setPetImageFile(null);
            alert("Successfully added pet!");
            navigate('/pets');
        } catch (error) {
            alert(getAxiosErrorMessages(error));
        }
    };

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;
    
        const file = files[0];
        setPetImageFile(file);
        setPetImageUrl(file.name);
      }
    
    function handleImageUploadClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setPetImageUrl('');
        if (inputRef.current) inputRef.current.click();
      }

    return (
        <>
        <Box className="Box" sx={{ minWidth: 120 }} component="form" onSubmit={handleAddPet}>
            <br/>
            <FormControl fullWidth>
                <div id="formwrapper">
                    <div className="formsubwrap" id="formsubwrap1">
                        <TextField className='formInput' required label="Name" value={petName} onChange={e => setPetName(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' select required label="Type" value={petType} onChange={e => setPetType(e.target.value)} component={Paper}>
                            <MenuItem value="Cat">Cat</MenuItem>
                            <MenuItem value="Dog">Dog</MenuItem>
                            <MenuItem value="Bird">Bird</MenuItem>
                            <MenuItem value="Rabbit">Rabbit</MenuItem>
                            <MenuItem value="Reptile">Reptile</MenuItem>
                            <MenuItem value="Horse">Horse</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <br/>
                        <TextField className='formInput' label="Breed" value={petBreed} onChange={e => setPetBreed(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' select required label="Size" value={petSize} onChange={e => setPetSize(+e.target.value)} component={Paper}>
                            <MenuItem value={0}>Small</MenuItem>
                            <MenuItem value={1}>Medium</MenuItem>
                            <MenuItem value={2}>Large</MenuItem>
                            <MenuItem value={3}>Extra-Large</MenuItem>
                        </TextField>
                        <br/>
                        <TextField className='formInput' select required label="Gender" value={petGender} onChange={e => setPetGender(e.target.value)} component={Paper}>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                        </TextField>
                        <br/>
                        <TextField className='formInput' required label="Age" value={petAge} onChange={e => setPetAge(+e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="Color" value={petColor} onChange={e => setPetColor(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' label="Note" value={petNote} onChange={e => setPetNote(e.target.value)} component={Paper}/>
                        <br/>
                        <ToggleButton id="toggle" value={eligibleFoster} selected={eligibleFoster} onChange={() => setEligibleFoster((prev) => !prev)}>
                            <Checkbox/>
                            <label>Eligible for foster</label>
                        </ToggleButton>
                    </div>
                    <div className='formsubwrap' id='formsubwrap2'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Date arrived at shelter" value={arrivalDate} onChange={(ndate) => setArrivalDate(ndate)} format='YYYY-MM-DD'/>
                        </LocalizationProvider>
                        <br/>
                        <Button type="button" onClick={handleImageUploadClick}>Upload File</Button>
                        <input ref={inputRef} type='file' hidden onChange={handleImageUpload} />
                        <div>{petImageUrl}</div>
                    </div>
                    <div className='formsubwrap' id="formsubwrap3">
                        <Button variant="contained" type="submit" >Add Pet</Button>
                    </div>
                </div>
            </FormControl>
        </Box>
        </>
    )

};

export default AddPet;