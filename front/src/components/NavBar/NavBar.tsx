import { Link, Outlet } from 'react-router-dom'
import './NavBar.css'
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ProtectedLink from '../ProtectedLink';

function Header() {
    const auth = useContext(AuthContext);
  
    let navLinks;
    if (auth?.user) {
      const role = auth.user.role;
      if (role === 'STAFF') {
        navLinks = (
          <>
            <Link to="/dashboard" className="nav-link"><Typography variant='body1'>Dashboard</Typography></Link>
            <Link to="/pets" className="nav-link"><Typography className="nav-text" variant='body1'>View Pets <PetsIcon className="nav-icon" fontSize={'small'} sx={{ color: 'white'}} /></Typography></Link>
            <Link to="/conversation-history" className="nav-link"><Typography variant='body1'>Messages</Typography></Link>
            <Link to={`/forms/${auth.user.user_id}`}className="nav-link"><Typography variant='body1'>Your Forms</Typography></Link>
            <Link to="/logout" className="nav-link"><Typography variant='body1'>Logout</Typography></Link>
          </>
        );
      } else if (role === 'ADOPTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link"><Typography className="nav-text" variant='body1'>Find A Pet <PetsIcon className="nav-icon" fontSize={'small'} sx={{ color: 'white'}} /></Typography></Link>
            <Link to="/conversation-history" className="nav-link"><Typography variant='body1'>Messages</Typography></Link>
            <Link to={`/forms/${auth.user.user_id}`} className="nav-link"><Typography variant='body1'>Your Forms</Typography></Link>
            <Link to={`/forms/SubmitFosterParentForm/${auth.user.user_id}`}className="nav-link"><Typography variant='body1'>Become A Foster Parent</Typography></Link>
            <Link to="/logout" className="nav-link"><Typography variant='body1'>Logout</Typography></Link>
          </>
        );
      } else if (role === 'FOSTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link"><Typography className="nav-text" variant='body1'>Find A Pet <PetsIcon className="nav-icon" fontSize={'small'} sx={{ color: 'white'}} /></Typography></Link>
            <Link to="/conversation-history" className="nav-link"><Typography variant='body1'>Messages</Typography></Link>
            <Link to={`/forms/${auth.user.user_id}`} className="nav-link"><Typography variant='body1'>Your Forms</Typography></Link>
            <Link to="/logout" className="nav-link"><Typography variant='body1'>Logout</Typography></Link>
          </>
        );
      }
    } else {
      navLinks = (
        <>
           <Link to="/pets" className="nav-link"><Typography className="nav-text" variant='body1'>Find A Pet <PetsIcon className="nav-icon" fontSize={'small'} sx={{ color: 'white'}} /></Typography></Link>
          <ProtectedLink 
            to="/login" 
            message="In order to apply to be a foster parent, you must login." 
            className="nav-link"
          ><Typography variant='body1'>Become A Foster Parent</Typography></ProtectedLink>
          <Link to="/login" className="nav-link"><Typography variant='body1'>Login</Typography></Link>
          <Link to="/signup" className="nav-link"><Typography variant='body1'>Sign up</Typography></Link>
        </>
      );
    }

    function Logo(){
      return(
        <>
          <div className="nav-logo">
            <PetsIcon fontSize={'large'} sx={{ color: '#F2D492', border: '2px solid #ED8844',  borderRadius: '50%', padding: '4px'}} />
            <Typography variant='h4' color='white'>PawFinder</Typography>     
          </div>

        </>
      )
    }

    return (
      <div className="navbar">
        <Logo/>
        {navLinks}
        {auth?.user && (
          <span className="nav-user"><Typography variant='body1'>Welcome, {auth.user.username}!</Typography></span>
        )}
      </div>
    );
}

function NavBar() {
    return (
        <>
            <nav>
                <Header />
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default NavBar;