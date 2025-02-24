import React from 'react';
import SignupForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css'

function Home() {
  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Welcome to the Pet Adoption App</h1>
      <p>
        Click the links below to sign up or log in.
      </p>
      <nav>
        <Link to="/signup">Sign Up</Link> |{' '}
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App
