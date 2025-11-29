import React, { useState } from "react";
import "./NavbarA.css";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaPlus, FaTachometerAlt } from "react-icons/fa"; // أيقونة Dashboard

function NavbarA() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    const closeMenu = () => setIsOpen(false);
    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminData");
        navigate("/");
    };

    return (
        <nav className="navbar container t-4">
            <div className="logo">
                <FaTachometerAlt className="logo-icon" />
                <div >
                    <p>Admin Dashboard</p>
                    <span className="logo-description">Manage couriers and track requests easily.</span>
                </div>
            </div>

            <div className={`links ${isOpen ? "open" : ""}`}>
                <Link to="/RegisterCourier" onClick={closeMenu}>
                    <button className="attractive-btn">
                        <FaPlus className="btn-icon" /> Add a Courier
                    </button>
                </Link>                
                <button onClick={handleLogout} className="logout" style={{ backgroundColor: "transparent", border: "none", color: "#ffff" }}>
                    Logout <FiLogOut className="logout-icon" />
                </button>
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span className={isOpen ? "open" : ""}></span>
                <span className={isOpen ? "open" : ""}></span>
                <span className={isOpen ? "open" : ""}></span>
            </div>
        </nav>
    );
}

export default NavbarA;
