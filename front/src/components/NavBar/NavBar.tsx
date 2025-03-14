import { Link, Outlet } from 'react-router-dom'
import './NavBar.css'
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

function Header() {
    const auth = useContext(AuthContext);
  
    let navLinks;
    if (auth?.user) {
      const role = auth.user.role;
      if (role === 'STAFF') {
        navLinks = (
          <>
            <Link to="/dashboard" className="nav-link"><Typography variant='body1'>Dashboard</Typography></Link>
            <Link to="/pets" className="nav-link"><Typography variant='body1'>Find A Pet🐾</Typography></Link>
            <Link to="/conversation-history" className="nav-link"><Typography variant='body1'>Messages</Typography></Link>
            <Link to={`/forms/${auth.user.user_id}`}className="nav-link"><Typography variant='body1'>Your Forms</Typography></Link>
            <Link to="/logout" className="nav-link"><Typography variant='body1'>Logout</Typography></Link>
          </>
        );
      } else if (role === 'ADOPTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link">Find a Pet 🐾</Link>
            <Link to="/conversation-history" className="nav-link"><Typography variant='body1'>Messages</Typography></Link>
            <Link to="/forms" className="nav-link"><Typography variant='body1'>Your Forms</Typography></Link>
            <Link to={`/forms/SubmitFosterParentForm/${auth.user.user_id}`}className="nav-link"><Typography variant='body1'>Become A Foster Parent</Typography></Link>
            <Link to="/logout" className="nav-link"><Typography variant='body1'>Logout</Typography></Link>
          </>
        );
      } else if (role === 'FOSTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link" ><Typography variant='body1'>Find A Pet🐾</Typography></Link>
            <Link to="/conversation-history" className="nav-link"><Typography variant='body1'>Messages</Typography></Link>
            <Link to={`/forms/${auth.user.user_id}`} className="nav-link"><Typography variant='body1'>Your Forms</Typography></Link>
            <Link to="/logout" className="nav-link"><Typography variant='body1'>Logout</Typography></Link>
          </>
        );
      }
    } else {
      navLinks = (
        <>
          <Link to="/pets" className="nav-link"><Typography variant='body1'>Find A Pet🐾</Typography></Link>
          {/* For now, "Apply to be a Foster" simply redirects to the login page */}
          <Link to="/login" className="nav-link"><Typography variant='body1'>Become A Foster Parent</Typography></Link>
          <Link to="/login" className="nav-link"><Typography variant='body1'>Login</Typography></Link>
          <Link to="/signup" className="nav-link"><Typography variant='body1'>Sign up</Typography></Link>
        </>
      );
    }

    function Logo(){
      return(
        <>
          <div className="nav-logo">
            <PetsIcon fontSize={'large'} sx={{ color: 'white' }} />
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