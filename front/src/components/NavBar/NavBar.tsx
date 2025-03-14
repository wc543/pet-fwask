import { Link, Outlet } from 'react-router-dom'
import './NavBar.css'
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Header() {
    const auth = useContext(AuthContext);
  
    let navLinks;
    if (auth?.user) {
      const role = auth.user.role;
      if (role === 'STAFF') {
        navLinks = (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/pets" className="nav-link">Find A Pet🐾</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to={`/forms/${auth.user.user_id}`}className="nav-link">Your Forms</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        );
      } else if (role === 'ADOPTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link">Find a Pet 🐾</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to="/forms" className="nav-link">Your Forms</Link>
            <Link to={`/forms/SubmitFosterParentForm/${auth.user.user_id}`}className="nav-link">Become a Foster Parent</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        );
      } else if (role === 'FOSTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link">Find A Pet 🐾</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to={`/forms/${auth.user.user_id}`} className="nav-link">Your Forms</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        );
      }
    } else {
      navLinks = (
        <>
          <Link to="/pets" className="nav-link">Find A Pet 🐾</Link>
          {/* For now, "Apply to be a Foster" simply redirects to the login page */}
          <Link to="/login" className="nav-link">Become a Foster Parent</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </>
      );
    }
  
    return (
      <div className="navbar">
        {navLinks}
        {auth?.user && (
          <span className="nav-user">Welcome, {auth.user.username}!</span>
        )}
      </div>
    );
}

function Logo(){
  return(
    <>
      <img ></img>
    </>
  )
}

function NavBar() {
    return (
        <>
            <nav>
                <Logo/>
                <Header />
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default NavBar;