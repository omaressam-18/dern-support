import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Individual'
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // حالة عرض كلمة المرور
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // حالة عرض تأكيد كلمة المرور

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match', { position: "bottom-right", autoClose: 3000 });
            return;
        }

        try {
            const response = await axios.post('https://dern-support-backend-production.up.railway.app/api/users', {
                name: formData.name,
                email: formData.email,  
                password: formData.password,
                role: formData.role
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('User registered successfully!', { position: "bottom-right", autoClose: 3000 });
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'Individual'
                });
            }
            setTimeout(() => {
                navigate("/Login");
            }, 1000);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) { 
                    toast.error('Email is already in use', { position: "bottom-right", autoClose: 3000 });
                } else {
                    toast.error(error.response.data.message || 'Something went wrong', { position: "bottom-right", autoClose: 3000 });
                }
            } else {
                toast.error('Failed to connect to the server', { position: "bottom-right", autoClose: 3000 });
            }
        }
    };


    return (
        <div className='container py-5 d-flex align-items-center justify-content-center'>
            <div className="register-container">
                <h2 className="text-center mb-4 register-heading">Register</h2>
                <form onSubmit={handleSubmit} className="w-100">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" placeholder='User Name' value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" placeholder='Email' value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3 position-relative">
                        <label className="form-label">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder='Password'
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-link position-absolute translate-middle-y"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ background: 'none', border: 'none', color: 'white', top: "50px", right: "10px" }}
                        >
                            {showPassword ? <FaEyeSlash size={"20px"} /> : <FaEye size={"20px"} />}
                        </button>
                    </div>
                    <div className="mb-3 position-relative">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder='Confirm Password'
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-link position-absolute translate-middle-y"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ background: 'none', border: 'none', color: 'white', top: "50px", right: "10px" }}
                        >
                            {showConfirmPassword ? <FaEyeSlash size={"20px"} /> : <FaEye size={"20px"} />}
                        </button>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Account Type</label>
                        <select className="form-control" style={{background: "#333",color: "#fff"}} name="role" value={formData.role} onChange={handleChange}>
                            <option value="Individual">Individual</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    <div className='my-3 text-center'>
                        <p>Already have an account?  .  <span><Link style={{textDecoration:"none" , color:"white"}} to={"/Login"}> Login</Link></span></p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Register;