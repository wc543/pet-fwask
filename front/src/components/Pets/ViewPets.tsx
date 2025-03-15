import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from './types.ts'
import './ViewPets.css';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { AuthContext } from '../AuthContext.tsx';
import { useUser } from '../Users/UserContext.tsx';

const ViewPets: React.FC = () => {
    let [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const{ getRole } = useUser();

    const [filterType, setFilterType] = useState('Any');
    const [filterBreed, setFilterBreed] = useState('');
    const [filterSize, setFilterSize] = useState('Any');
    const [filterFosterable, setfilterFosterable] = useState('Any');

    const auth = useContext(AuthContext);
    const role = getRole(auth?.user?.user_id);

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
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleViewPet = (pet: Pet) => {
        const petId = pet.pet_id;
        console.log(petId);
        navigate(`/pets/id/${petId}`);
    };

    function GetSize(size: number) {
        if (size === 0) {
            return "Small";
        } else if (size === 1) {
            return "Medium";
        } else if (size === 2) {
            return "Large";
        } else {
            return "Extra-Large";
        }
    };

    function DisplayPets() {
        // filter pets
        let filteredPets: Pet[] = pets;
        if (filterType !== 'Any') {
            filteredPets = filteredPets.filter(p => p.type.includes(filterType))
        }
        if (filterBreed !== '') {
            filteredPets = filteredPets.filter(p => p.breed.toLowerCase().includes(filterBreed.toLowerCase()));
        }
        if (filterSize !== 'Any') {
            filteredPets = filteredPets.filter(p => p.size === +filterSize);
        }
        if (filterFosterable !== 'Any') {
            if (+filterFosterable === 0) {
                filteredPets = filteredPets.filter(p => p.fosterable === 0);
            } else {
                filteredPets = filteredPets.filter(p => p.fosterable === 1);
            }
            
        }
        pets = filteredPets;

        // return data
        return (
            <>
            {pets.length > 0 ? (
                <div id="pets_wrapper">
                    <>
                    {pets.map((pet, index) => (
                        <Card key={index} sx={{ borderRadius: '10px', boxShadow: 3, marginBottom: '30px', marginLeft: '30px' }} onClick={() => handleViewPet(pet)} >
                            <CardActionArea>
                                <CardContent>
                                    <div className='card_content'>
                                        <CardMedia
                                            component='img'
                                            height='200'
                                            width='200'
                                            image={pet.pet_image_url ? (`/${pet.pet_image_url}`) : ('/no_image.png')}
                                            alt='Pet Image'
                                            sx={{ borderRadius: '10px', marginBottom: '8%' }}
                                        />
                                        <Typography variant='h5'><strong>{pet.name}</strong></Typography>
                                        <>{pet.breed === '' ? (<></>) : <Typography variant='h6'>{pet.breed}</Typography>}</>
                                        <div className='card_bottom'>
                                            <div className='card_bottom_info'>
                                                <Typography variant='body2'>{pet.gender}, {pet.age}</Typography>
                                                <Typography variant='body2'>{GetSize(pet.size)} {pet.type}</Typography>
                                            </div>
                                            <div className='card_bottom_button'>
                                                <InfoIcon className='info_button' htmlColor='black' onClick={() => handleViewPet(pet)}/>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                    </>
                </div>
            ) : (
                <Typography variant='body2'>No pets found</Typography>
            )}
            </>
        )
    }

    return (
        <>
        <div id="content">
                <div id='top'>
                <FormControl className="filterForm">
                    <InputLabel>Type</InputLabel>
                    <Select label='Type' value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <MenuItem value='Any'>Any</MenuItem>
                        <MenuItem value="Cat">Cat</MenuItem>
                        <MenuItem value="Dog">Dog</MenuItem>
                        <MenuItem value="Bird">Bird</MenuItem>
                        <MenuItem value="Rabbit">Rabbit</MenuItem>
                        <MenuItem value="Reptile">Reptile</MenuItem>
                        <MenuItem value="Horse">Horse</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className="filterForm">
                    <TextField label='Breed' value={filterBreed} onChange={e => setFilterBreed(e.target.value)}/>
                </FormControl>
                <FormControl className="filterForm">
                    <InputLabel>Size</InputLabel>
                    <Select label='Size' value={filterSize} onChange={e => setFilterSize(e.target.value)}>
                        <MenuItem value={'Any'}>Any</MenuItem>
                        <MenuItem value={0}>Small</MenuItem>
                        <MenuItem value={1}>Medium</MenuItem>
                        <MenuItem value={2}>Large</MenuItem>
                        <MenuItem value={3}>Extra-Large</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className='filterForm'>
                    <InputLabel>Fosterable</InputLabel>
                    <Select label='Fosterable' value={filterFosterable} onChange={e => setfilterFosterable(e.target.value)}>
                        <MenuItem value={'Any'}>Any</MenuItem>
                        <MenuItem value={1}>Fosterable</MenuItem>
                        <MenuItem value={0}>Not Fosterable</MenuItem>
                    </Select>
                </FormControl>
                {role === 'STAFF' ? (<Button variant="contained" onClick={() => navigate(`/pets/create`)}>Add Pet</Button>) : (<></>)}
                </div>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                <Box sx={{ minWidth: 120, width: '100%' }}>
                    <DisplayPets/>
                </Box>
                </>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </>
    );
};

export default ViewPets;