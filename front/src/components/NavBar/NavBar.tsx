import { Link, Outlet } from 'react-router-dom'
import './NavBar.css'

function Header() {
    return (
        <div className='navbar'>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/pets" className="nav-link">View Pets</Link>
            <Link to="/forms" className="nav-link">View Forms</Link>
            <Link to="/messages" className="nav-link">View Messages</Link>
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