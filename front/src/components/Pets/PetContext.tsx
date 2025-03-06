import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Pet {
    pet_id: number;
    name: string;
    type: string;
    breed: string;
    size: number;
    gender: string;
    age: number;
    color: string;
    created_by_id: number;
    fosterable: boolean;
    pet_image_url: string;
    shelter_time: Date;
    current_foster: number;
    current_adopter: number;
    note: string;
}

interface PetContextType {
    getName: (petId: number) => string | undefined;
    getType: (petId: number) => string | undefined;
    getBreed: (petId: number) => string | undefined;
    getSize: (petId: number) => number | undefined;
    getGender: (petId: number) => string | undefined;
    getAge: (petId: number) => number | undefined;
    getColor: (petId: number) => string | undefined;
    getCreatedById: (petId: number) => number | undefined;
    getFosterable: (petId: number) => boolean | undefined;
    getImageUrl: (petId: number) => string | undefined;
    getShelterTime: (petId: number) => Date | undefined;
    getCurrentFoster: (petId: number) => number | undefined;
    getCurrentAdopter: (petId: number) => number | undefined;
    getNote: (petId: number) => string | undefined;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get('/api/pets');
                setPets(response.data.pets);
            } catch (error) {
                console.log('Failed to fetch pets:', error);
            }
        };
        fetchPets();
    }, []);

    const getName = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.name;
    const getType = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.type;
    const getBreed = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.breed;
    const getSize = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.size;
    const getGender = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.gender;
    const getAge = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.age;
    const getColor = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.color;
    const getCreatedById = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.created_by_id;
    const getFosterable = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.fosterable;
    const getImageUrl = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.pet_image_url;
    const getShelterTime = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.shelter_time;
    const getCurrentFoster = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.current_foster;
    const getCurrentAdopter = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.current_adopter;
    const getNote = (petId: number) => pets.find((pet) => pet.pet_id === petId)?.note;

    return (
        <PetContext.Provider value={{ getName, getType, getBreed, getSize, getGender, getAge, getColor, getCreatedById, getFosterable, getImageUrl, getShelterTime, getCurrentFoster, getCurrentAdopter, getNote }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePet = () => {
    const context = useContext(PetContext);
    if (!context) {
        throw new Error('usePet must be used within a PetProvider');
    }
    return context;
};