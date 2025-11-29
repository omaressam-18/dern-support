import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaPlus, FaTachometerAlt } from "react-icons/fa"; // أيقونة Dashboard

function NavbarC() {
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
                <div >
                    <p>Courier Dashboard</p>
                </div>
            </div>

            <div className={`links ${isOpen ? "open" : ""}`}>             
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

export default NavbarC;
