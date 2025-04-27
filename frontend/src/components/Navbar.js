import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Lost and Found Management System   
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/post" className="nav-link">Post Item</Link>
                    <Link to="/my-items" className="nav-link">My Items</Link>
                    <Link to="/finder-claims" className="nav-link">Review Claims</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-link">Register</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 