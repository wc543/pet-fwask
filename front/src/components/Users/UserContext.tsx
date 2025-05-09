import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

//Used to get general information(that's not protected info, like address) of all users. Can be retrived by identify the user_id
interface User {
  user_id: number ,
  first_name: string,
  role: string,
  username: string,
  last_name: string,
}

interface UserContextType {
  getUsername: (userId: number) => string | undefined;
  getFullname: (userId: number) => string | undefined;
  getRole: (userId: number) => string | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };


    fetchUsers();
  }, []);

  const getUsername = (userId: number) => users.find((user) => user.user_id === userId)?.username;
  const getFullname = (userId: number) => users.find((user) => user.user_id === userId)?.first_name;
  const getRole = (userId: number) => users.find((user) => user.user_id === userId)?.role;


  return (
    <UserContext.Provider value={{getUsername, getFullname, getRole}}>
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
