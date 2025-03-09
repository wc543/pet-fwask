import { Link, Outlet } from 'react-router-dom'
import './NavBar.css'
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

/*function Header() {
    const auth = useContext(AuthContext); // Access AuthContext
    console.log("NavBar auth context:", auth); // Debugging log

    return (
        <div className='navbar'>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/pets" className="nav-link">View Pets</Link>
            <Link to="/forms" className="nav-link">View Forms</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to="/profile" className="nav-link">My Profile</Link>
            {auth?.user ? (
                <>
                    <span className="nav-user">Welcome, {auth.user.username}!</span>
                    <Link to="/logout" className="nav-link">Logout</Link>
                </>
            ) : (
                <>
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </>
            )}
        </div>
    );
}*/
function Header() {
    const auth = useContext(AuthContext);
  
    let navLinks;
    if (auth?.user) {
      const role = auth.user.role;
      if (role === 'STAFF') {
        navLinks = (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/pets" className="nav-link">View Pets</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to="/forms" className="nav-link">View Forms</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        );
      } else if (role === 'ADOPTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link">View Pets</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to="/forms" className="nav-link">View Forms</Link>
            <Link to={`/forms/SubmitFosterParentForm/${auth.user.user_id}`}className="nav-link">Apply to be a Foster Parent</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        );
      } else if (role === 'FOSTER') {
        navLinks = (
          <>
            <Link to="/pets" className="nav-link">View Pets</Link>
            <Link to="/conversation-history" className="nav-link">View Messages</Link>
            <Link to="/forms" className="nav-link">View Forms</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        );
      }
    } else {
      navLinks = (
        <>
          <Link to="/pets" className="nav-link">View Pets</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
          {/* For now, "Apply to be a Foster" simply redirects to the login page */}
          <Link to="/login" className="nav-link">Apply to be a Foster Parent</Link>
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