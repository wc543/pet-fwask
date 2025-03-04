import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from './types.ts'
import './EmployeePets.css';
import { Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

const EmployeePets: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [filterType, setFilterType] = useState('Any');
    const [filterBreed, setFilterBreed] = useState('');
    const [filterSize, setFilterSize] = useState('Any');
    const [filterFosterable, setfilterFosterable] = useState('Any');

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
                        <MenuItem value={0}>Fosterable</MenuItem>
                        <MenuItem value={1}>Not Fosterable</MenuItem>
                    </Select>
                </FormControl>
                <Button sx={{ backgroundColor: "black"}} variant="contained" onClick={() => navigate(`/pets/create`)}>Add Pet</Button>
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
                                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{pet.breed}</TableCell>
                                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>Age: {pet.age}</TableCell>
                                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>{pet.gender}</TableCell>
                                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>Size: {pet.size}</TableCell>
                                        <TableCell className='petsTableCell' id={index === 0 ? ('firstRow') : ('')} align='center'>
                                            <div className='action_buttons_wrapper'>
                                                <Button onClick={() => handleViewPet(pet)}><LaunchIcon htmlColor='black'/></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8}>No pets found</td>
                                </tr>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}

        </div>
        </>
    );
};

export default EmployeePets;