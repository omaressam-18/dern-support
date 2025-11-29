import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            const adminData = localStorage.getItem("adminData") && localStorage.getItem("adminData") !== "undefined"
                ? JSON.parse(localStorage.getItem("adminData"))
                : null;
            const courierData = localStorage.getItem("courierData") && localStorage.getItem("courierData") !== "undefined"
                ? JSON.parse(localStorage.getItem("courierData"))
                : null;
            const userData = localStorage.getItem("userData") && localStorage.getItem("userData") !== "undefined"
                ? JSON.parse(localStorage.getItem("userData"))
                : null;

            if (adminData && adminData.role === "Admin") {
                navigate("/AdminHome");
            } else if (courierData) {
                navigate("/CourierHome");
            } else if (userData) {
                navigate("/UserHome");
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // تسجيل الدخول كـ Admin
            const response = await axios.post("http://127.0.0.1:8000/api/Admin/login", formData);
            if (response.data.message === "Login successful") {
                handleSuccess(response, "AdminHome", "Admin");
                return;
            }
        } catch (error) {
            console.error("Admin login failed:", error);
        }

        try {
            // تسجيل الدخول كـ Courier
            const response = await axios.post("http://127.0.0.1:8000/api/courier/login", formData);
            if (response.data.message === "Login successful") {
                handleSuccess(response, "CourierHome", "Courier");
                console.log(response.data)
                return;
            }
        } catch (error) {
            console.error("Courier login failed:", error);
        }

        try {
            // تسجيل الدخول كـ User عادي
            const response = await axios.post("http://127.0.0.1:8000/api/login", formData);
            handleSuccess(response, "UserHome", "User");
        } catch (err) {
            toast.error("Invalid email or password", { position: "bottom-right", autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = (response, redirectPath, role) => {
        toast.success("Login successful!", { position: "bottom-right", autoClose: 3000 });
        localStorage.setItem("userToken", response.data.token);
    
        if (role === "Admin") {
            localStorage.setItem("adminData", JSON.stringify({ ...response.data.admin, role }));
        } else if (role === "Courier") {
            console.log("Courier Data:", response.data.courier); // Debugging line
            localStorage.setItem("courierData", JSON.stringify({ ...response.data.courier, role }));
        } else {
            const userRole = response.data.user.role === "Individual" ? "Individual" : "Business";
            localStorage.setItem("userData", JSON.stringify({ ...response.data.user, role: userRole }));
        }
    
        setTimeout(() => navigate(`/${redirectPath}`), 1000);
    };
    

    return (
        <div className="container py-5 d-flex align-items-center justify-content-center">
            <div className="register-container">
                <h2 className="text-center mb-4 register-heading">Login</h2>
                <form onSubmit={handleSubmit} className="w-100">
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm"></span> : "Login"}
                    </button>
                    <div className='my-3 text-center'>
                        <p>Don't have an account?  
                            <span><Link style={{ textDecoration: "none", color: "white" }} to={"/Register"}> Create Account</Link></span>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
