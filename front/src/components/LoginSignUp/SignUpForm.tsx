// SignupForm.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TextField, Button, Typography, Paper } from '@mui/material';
import './SignUpForm.css';

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
  household_size: number;
  household_allergies: string;
  current_pets: string;
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
    household_size: 0,
    household_allergies: '',
    current_pets: '',
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', formData);
      localStorage.setItem('jwt', response.data.token);
      login(response.data.token);
      setMessage('Account created successfully!');
      setError('');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account.');
      setMessage('');
    }
  };

  return (
    <Box className="signupBox" component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <div id="signupFormWrapper">
          <div className="signupFormSubwrap" id="signupFormSubwrap1">
            <TextField
              className="signupFormInput"
              required
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              required
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              required
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Zip Code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              required
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date_of_birth}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              required
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Household Size"
              name="household_size"
              type="number"
              value={formData.household_size}
              onChange={handleChange}
              helperText="Enter the number of people in your household."
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Household Allergies"
              name="household_allergies"
              value={formData.household_allergies}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="signupFormInput"
              label="Current Pets"
              name="current_pets"
              value={formData.current_pets}
              onChange={handleChange}
              helperText="Enter 'None' if you have no pets, or list the pets you have."
              component={Paper}
            />
          </div>
          <div className="signupFormSubwrap" id="signupFormSubwrap2">
            <Button variant="contained" type="submit">
              Sign Up
            </Button>
          </div>
        </div>
        {message && (
          <Typography variant="body1" style={{ color: 'green' }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="body1" style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default SignupForm;