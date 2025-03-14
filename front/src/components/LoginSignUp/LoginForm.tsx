// LoginForm.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TextField, Button, Typography, Paper } from '@mui/material';
import './LoginForm.css';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/signin', formData);
      localStorage.setItem('jwt', response.data.token);
      login(response.data.token);
      setMessage('Sign-in successful!');
      setError('');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
      setMessage('');
    }
  };

  return (
    <Box className="loginBox" component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <div id="loginFormWrapper">
          <div className="loginFormSubwrap" id="loginFormSubwrap1">
            <TextField
              className="loginFormInput"
              required
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              component={Paper}
            />
            <br />
            <TextField
              className="loginFormInput"
              required
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              component={Paper}
            />
          </div>
          <div className="loginFormSubwrap" id="loginFormSubwrap2">
            <Button variant="contained" type="submit">
              Login
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

export default LoginForm;
