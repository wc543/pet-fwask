import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

//Used to get general information(that's not protected info, like address) of all users. Can be retrived by identify the user_id
interface User {
  user_id: string | number,
  first_name: string,
  role: string,
  username: string;
}

interface UserContextType {
  getUsername: (userId: string) => string | undefined;
  getFullname: (userId: string) => string | undefined;
  getRole: (userId: string) => string | undefined;
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

  const getUsername = (userId: string) => users.find((user) => user.user_id === userId)?.username;
  const getFullname = (userId: string) => users.find((user) => user.user_id === userId)?.first_name;
  const getRole = (userId: string) => users.find((user) => user.user_id === userId)?.role;
  return (
    <UserContext.Provider value={{ getUsername, getFullname, getRole}}>
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
