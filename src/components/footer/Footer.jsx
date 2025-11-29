import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer bg-dark text-white py-3" style={{position:"relative" , bottom:"0", width:"100%"}}>
            <div className="container text-center">
                <div className="mb-2">
                    <Link to="/" className="text-white mx-2 text-decoration-none">Home</Link>
                    <Link to="/Login" className="text-white mx-2 text-decoration-none">Login</Link>
                    <Link to="/Register" className="text-white mx-2 text-decoration-none">Register</Link>
                </div>
                <div className="d-flex justify-content-center gap-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                        <FaFacebook />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                        <FaTwitter />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                        <FaInstagram />
                    </a>
                </div>
                <p className="mt-2 small mb-0">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
