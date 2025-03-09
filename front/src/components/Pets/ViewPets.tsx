import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from './types.ts'
import './ViewPets.css';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
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
                pets.map((pet, index) => (
                    <TableRow key={index}>
                        <TableCell className='petsTableCell petImageCell' id={index === 0 ? ('firstRow') : ('')}>
                            <div className='pet_image_wrapper'>
                                <img className="pet_image" src={pet.pet_image_url ? (`/${pet.pet_image_url}`) : ('/no_image.png')}/>
                            </div>
                        </TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{pet.name}</TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{pet.type}</TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{pet.breed === '' ? '--' : `${pet.breed}`}</TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>Age: {pet.age}</TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{pet.gender}</TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{GetSize(pet.size)}</TableCell>
                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>
                            <div className='action_buttons_wrapper'>
                                <Button onClick={() => handleViewPet(pet)}><LaunchIcon htmlColor='black'/></Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell sx={{ border: 'hidden' }}>No pets found</TableCell>
                </TableRow>
            )}
            </>
        )
    }

    return (
        <>
        <div id="content">

            <div>
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
                {role === 'STAFF' ? (<Button sx={{ backgroundColor: "black"}} variant="contained" onClick={() => navigate(`/pets/create`)}>Add Pet</Button>) : (<></>)}
                </div>
                <br/>
                <br/>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <TableContainer id="tableContainer" sx={{ borderRadius: '10px', border: 'hidden', backgroundColor: '#D9D9D9' }}>
                    <Table id="petsTable" sx={{ minWidth: 650, border: 'hidden' }} aria-label="simple table">
                        <TableBody>
                            <DisplayPets/>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}

        </div>
        </>
    );
};

export default ViewPets;