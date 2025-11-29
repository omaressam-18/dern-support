import React, { useState, useEffect } from "react";
import "./NavbarU.css";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function NavbarU() {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // جلب بيانات المستخدم من localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
            setUserName(userData.name); // تأكد أن الاسم متاح في البيانات
        }
    }, []);

    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        // مسح البيانات من localStorage
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");

        // تحويل المستخدم إلى صفحة تسجيل الدخول
        navigate("/");
    };

    return (
        <nav className="navbar container t-4">
            <div className="logo">
                <p>Welcome, {userName ? userName : "Guest"}</p>
            </div>

            <div className={`links ${isOpen ? "open" : ""}`}>
                <Link to="/UserHome" onClick={closeMenu}>Home</Link>
                
                <button onClick={handleLogout} className="logout" style={{backgroundColor:"transparent" , border:"none" , color:"#ffff"}}>
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

export default NavbarU;
