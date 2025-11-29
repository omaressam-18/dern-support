import React, { useState } from 'react';
import logo from './img/Logo.svg';
import './Navbar.css';
import { Link } from 'react-router-dom';


function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar container t-4">
            <div className="logo">
                <img src={logo} alt="Logo" />
                <p>Dern Support</p>
            </div>

            <div className={`links ${isOpen ? 'open' : ''}`}>
                <Link  to={"/"}>Home</Link>
                <Link to={'/Login'} href="#">Login</Link>
                <Link to={'/Register'} href="#">Register</Link>
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span className={isOpen ? "open" : ""}></span>
                <span className={isOpen ? "open" : ""}></span>
                <span className={isOpen ? "open" : ""}></span>
            </div>
        </nav>
    );
}

export default Navbar;
