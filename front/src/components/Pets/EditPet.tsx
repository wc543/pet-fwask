import './EditPet.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, TextField, Paper, MenuItem, ToggleButton, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Pet } from './types.ts'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';

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

const EditPet: React.FC = () => {
    let [pet, setPet] = useState<Pet|null>(null);
    let [createdBy, setCreatedBy] = useState(0);
    let [nameEdit, setNameEdit] = useState('');
    let [typeEdit, setTypeEdit] = useState('');
    let [breedEdit, setBreedEdit] = useState('');
    let [sizeEdit, setSizeEdit] = useState(0);
    let [genderEdit, setGenderEdit] = useState('');
    let [ageEdit, setAgeEdit] = useState(0);
    let [colorEdit, setColorEdit] = useState('');
    let [noteEdit, setNoteEdit] = useState('');
    let [fosterableEdit, setFosterableEdit] = useState(false);
    let [arrivalEdit, setArrivalEdit] = useState<Dayjs | null>(dayjs());
    let [imageEdit, setImageEdit] = useState('');
    let [imageFile, setImageFile] = useState<File | null>(null);
    let [currentFoster, setCurrentFoster] = useState(null);
    let [currentAdopter, setCurrentAdopter] = useState(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState('');
    let [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
    let {id} = useParams();
    const navigate = useNavigate();

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
            setPet(data.pets);
            setCreatedBy(data.pets.created_by_id);
            setNameEdit(data.pets.name);
            setTypeEdit(data.pets.type);
            setBreedEdit(data.pets.breed);
            setSizeEdit(data.pets.size);
            setGenderEdit(data.pets.gender);
            setAgeEdit(data.pets.age);
            setColorEdit(data.pets.color);
            setNoteEdit(data.pets.notes);
            setFosterableEdit(data.pets.fosterable === 0 ? (false) : (true));
            setArrivalEdit(data.pets.shelter_time ? dayjs(data.pets.shelter_time) : dayjs());
            setImageEdit(data.pets.pet_image_url);
            setCurrentFoster(data.pets.current_foster);
            setCurrentAdopter(data.pets.current_adopter);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch pet");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPet();
    }, []);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;
    
        const file = files[0];
        setImageFile(file);
        setImageEdit(file.name);
    };
    
    function handleImageUploadClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setImageEdit('');
        if (inputRef.current) inputRef.current.click();
    };

    const handleEditPet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // upload pet image
            let generatedPetImageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                let response = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data'}
                });
                generatedPetImageUrl = response.data.filePath;
                console.log('File uploaded:', generatedPetImageUrl);
            } else {
                console.log('No file uploaded, using original image');
                generatedPetImageUrl = imageEdit;
            }

            // put edits
            let edits = {
                name: nameEdit,
                type: typeEdit,
                breed: breedEdit,
                size: sizeEdit,
                gender: genderEdit,
                age: ageEdit,
                color: colorEdit,
                created_by_id: createdBy,
                fosterable: fosterableEdit,
                pet_image_url: generatedPetImageUrl,
                shelter_time: arrivalEdit ? arrivalEdit.format('YYYY-MM-DD') : null,
                current_foster: currentFoster,
                current_adopter: currentAdopter,
                notes: noteEdit,
            };
            console.log(edits);
            let response = await axios.put(`/api/pets/${id}`, edits);
            console.log("Posted new pet successfully:", response.data);
            alert("Successfully saved changes!");
            navigate(`/pets/id/${id}`);
        } catch (error) {
            alert(getAxiosErrorMessages(error));
        }
    };

    const handleClickOpen = () => {
        setOpenDeleteConfirmation(true);
    };

    const handleClose = () => {
        setOpenDeleteConfirmation(false);
    };

    const handleDeletePet = async () => {
        try {
            let response = await axios.delete(`/api/pets/${id}`);
            console.log(response.data);
            navigate('/pets');
        } catch (error) {
            alert(getAxiosErrorMessages(error));
        }
    };

    return (
        <>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <>
            {pet ? (
                <>
                <Box className="Box" sx={{ minWidth: 120 }} component="form" onSubmit={handleEditPet}>
                    <br/>
                    <FormControl fullWidth>
                        <div id="formwrapper">
                            <div className='formcol' id='formcol1'>
                                <TextField className='forminput' required label='Name' value={nameEdit} onChange={e => setNameEdit(e.target.value)} component={Paper}/>
                                <br/>
                                <TextField className='forminput' select required label='Type' value={typeEdit} onChange={e => setTypeEdit(e.target.value)} component={Paper}>
                                    <MenuItem value="Cat">Cat</MenuItem>
                                    <MenuItem value="Dog">Dog</MenuItem>
                                    <MenuItem value="Bird">Bird</MenuItem>
                                    <MenuItem value="Rabbit">Rabbit</MenuItem>
                                    <MenuItem value="Reptile">Reptile</MenuItem>
                                    <MenuItem value="Horse">Horse</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                                <br/>
                                <TextField className='forminput' label='Breed' value={breedEdit} onChange={e => setBreedEdit(e.target.value)} component={Paper}/>
                                <br/>
                                <TextField className='formInput' select required label="Size" value={sizeEdit} onChange={e => setSizeEdit(+e.target.value)} component={Paper}>
                                    <MenuItem value={0}>Small</MenuItem>
                                    <MenuItem value={1}>Medium</MenuItem>
                                    <MenuItem value={2}>Large</MenuItem>
                                    <MenuItem value={3}>Extra-Large</MenuItem>
                                </TextField>
                                <br/>
                                <TextField className='formInput' select required label="Gender" value={genderEdit} onChange={e => setGenderEdit(e.target.value)} component={Paper}>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                </TextField>
                                <br/>
                                <TextField className='formInput' required label="Age" value={ageEdit} onChange={e => setAgeEdit(+e.target.value)} component={Paper}/>
                                <br/>
                                <TextField className='formInput' required label="Color" value={colorEdit} onChange={e => setColorEdit(e.target.value)} component={Paper}/>
                                <br/>
                                <TextField className='formInput' label="Note" value={noteEdit} onChange={(e => setNoteEdit(e.target.value))} component={Paper}/>
                                <br/>
                                <ToggleButton id="toggle" value='fosterable' selected={fosterableEdit} onChange={() => setFosterableEdit(!fosterableEdit)}>
                                    <Checkbox checked={!!fosterableEdit} />
                                    <label>Eligible for foster</label>
                                </ToggleButton>
                            </div>
                            <div className='formcol' id='formcol2'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Date arrived at shelter" value={arrivalEdit} onChange={(ndate) => setArrivalEdit(ndate)} format='YYYY-MM-DD'/>
                                </LocalizationProvider>
                                <br/>
                                <div id='imagediv'>
                                    <img id="image" src={`../../../public/${imageEdit}`}/>
                                    <p>{imageEdit}</p>
                                </div>
                                <Button type="button" onClick={handleImageUploadClick}>Change Image</Button>
                                <input ref={inputRef} type='file' hidden onChange={handleImageUpload} />
                            </div>
                            <div className='formcol' id='formcol3'>
                                <Button sx={{ color: 'black' }} onClick={handleClickOpen}><DeleteOutlineIcon htmlColor='black'/>Delete Pet</Button>
                                <Button variant='contained' type='submit' style={{ marginLeft: '5%', backgroundColor: 'black' }}>Save Changes</Button>
                            </div>
                        </div>
                    </FormControl>
                </Box>
                <Dialog
                    open={openDeleteConfirmation}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    {"Delete Pet?"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDeletePet} autoFocus sx={{ color: 'red' }}>Delete</Button>
                    </DialogActions>
                </Dialog>
                </>
            ) : (
                <div>Error fetching pet</div>
            )}
            </>
        )}
        </>
    );
};

export default EditPet;