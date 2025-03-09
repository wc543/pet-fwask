import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

//Used to get general information(that's not protected info, like address) of all users. Can be retrived by identify the user_id
interface User {
  user_id: number ,
  first_name: string,
  role: string,
  username: string,
  last_name: string,
  address: string,
  city: string,
  state: string,
  zip_code: string,
  phone_number: string,
  email: string,
}


interface UserHousehold {
  user_id: number,
  household_size: number,
  household_allergies: string,
  current_pets: string
}

interface UserContextType {
  getUsername: (userId: number) => string | undefined;
  getFullname: (userId: number) => string | undefined;
  getRole: (userId: number) => string | undefined;
  getFirstName: (userId: number) => string | undefined;
  getLastName: (userId: number) => string | undefined;
  getAddress: (userId: number) => string | undefined;
  getState: (userId: number) => string | undefined;
  getCity: (userId: number) => string | undefined;
  getZipCode: (userId: number) => string | undefined;
  getPhoneNumber: (userId: number) => string | undefined;
  getEmail: (userId: number) => string | undefined;
  getHouseholdSize: (userId: number) => Number | undefined;
  getHouseholdAllergies: (userId: number) => string | undefined;
  getCurrentPets: (userId: number) => string | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userHouseholds, setUserHouseholds] = useState<UserHousehold[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const fetchUserHouseholds = async () => {
      try{
        const response = await axios.get('/api/users/userHouseholds');
        setUserHouseholds(response.data);
      } catch(error) {
        console.error('Failed to fetch user households:', error);
      }
    }

    fetchUsers();
    fetchUserHouseholds();
  }, []);

  const getUsername = (userId: number) => users.find((user) => user.user_id === userId)?.username;
  const getFullname = (userId: number) => users.find((user) => user.user_id === userId)?.first_name;
  const getFirstName = (userId: number) => users.find((user) => user.user_id === userId)?.first_name;
  const getLastName = (userId: number) => users.find((user) => user.user_id === userId)?.last_name;
  const getAddress = (userId: number) => users.find((user) => user.user_id === userId)?.address;
  const getCity = (userId: number) => users.find((user) => user.user_id === userId)?.city;
  const getState = (userId: number) => users.find((user) => user.user_id === userId)?.state;
  const getZipCode = (userId: number) => users.find((user) => user.user_id === userId)?.zip_code;
  const getPhoneNumber = (userId: number) => users.find((user) => user.user_id === userId)?.phone_number;
  const getEmail = (userId: number) => users.find((user) => user.user_id === userId)?.email;
  const getRole = (userId: number) => users.find((user) => user.user_id === userId)?.role;

  const getHouseholdSize = (userId: number) => userHouseholds.find((userHousehold) => userHousehold.user_id === userId)?.household_size;
  const getHouseholdAllergies = (userId: number) => userHouseholds.find((userHousehold) => userHousehold.user_id === userId)?.household_allergies;
  const getCurrentPets = (userId: number) => userHouseholds.find((userHousehold) => userHousehold.user_id === userId)?.current_pets;
  
  return (
    <UserContext.Provider value={{ getUsername, getFullname, getRole, getFirstName, getLastName, getAddress, getState, getCity, getZipCode, getPhoneNumber, getEmail, getHouseholdSize, getHouseholdAllergies, getCurrentPets}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
