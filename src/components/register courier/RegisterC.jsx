import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import './Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function RegisterC() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number:'',
        password: '',
        confirmPassword: '',
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
            const response = await axios.post('http://127.0.0.1:8000/api/couriers', {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                password: formData.confirmPassword,
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('Courier registered successfully!', { position: "bottom-right", autoClose: 3000 });
                setFormData({
                    name: '',
                    email: '',
                    phone_number:'',
                    password: '',
                    confirmPassword: '',
                });
            }
            setTimeout(() => {
                navigate("/adminhome");
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
                <h2 className="text-center mb-4 register-heading">Add Courier</h2>
                <form onSubmit={handleSubmit} className="w-100">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" placeholder='Full Name' value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" placeholder='Email' value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" name="phone_number" placeholder='phone' value={formData.phone_number} onChange={handleChange} required />
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
                    <input
                        type="hidden"
                        name="role"
                        value="Courier"
                    />

                    <button type="submit" className="btn btn-primary w-100">Add Courier</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default RegisterC;