// SignupForm.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

interface SignupFormData {
  first_name: string;
  last_name: string;
  username: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    first_name: '',
    last_name: '',
    username: '',
    address: '',
    state: '',
    city: '',
    zip_code: '',
    phone_number: '',
    email: '',
    date_of_birth: '',
    password: '',
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate(); // React Router navigation hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with your actual backend URL
      const response = await axios.post('/api/users/signup', formData);
      localStorage.setItem('jwt', response.data.token);
      
      // Update AuthContext so the NavBar re-renders immediately
      login(response.data.token);

      setMessage('Account created successfully!');
      setError('');

      // Redirect to home page
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account.');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
      <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
      <input type="text" name="zip_code" placeholder="Zip Code" value={formData.zip_code} onChange={handleChange} />
      <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="date" name="date_of_birth" placeholder="Date of Birth" value={formData.date_of_birth} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default SignupForm;
