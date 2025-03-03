import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log("Checking localStorage token:", token); // Debugging log
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
        console.log("User loaded from token:", decoded); // Debugging log
      } catch (error) {
        console.error('Invalid JWT Token', error);
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('jwt', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    console.log("User updated after login:", decoded); // Debugging log
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    console.log("User logged out"); // Debugging log
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
