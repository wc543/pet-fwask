// Logout.tsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Logout: React.FC = () => {
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Call logout to clear user state
    navigate('/login'); // Redirect to login page
  }, [logout, navigate]);

return null;
};

export default Logout;
