import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaPlus, FaList, FaEnvelope, FaCalendarAlt, FaCheck, FaSpinner, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaBorderAll } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import "./UserHome.css";
import { ToastContainer, toast } from "react-toastify";

function UserHome() {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [couriers, setCouriers] = useState([]);
    const [requestType, setRequestType] = useState(""); // حالة لتتبع نوع الطلب
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("userData")); // استخراج بيانات المستخدم
    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                if (!userData || !userData.id) {
                    toast.error("User data not found. Please log in again.", {
                        onClose: () => navigate("/Login"), 
                        autoClose: 1500 
                    });
                    return;
                }
                console.log(userData)

                const response = await axios.get(`http://127.0.0.1:8000/api/requests?user_id=${userData.id}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });

                // فلترة الطلبات الخاصة بالمستخدم إذا لم يكن هناك تصفية من الـ backend
                const userRequests = response.data.data.filter(request => request.user_id === userData.id);

                setRequests(userRequests);
            } catch (error) {
                console.error("Error fetching requests:", error);
                toast.error("Failed to fetch requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleCreateRequest = async (event) => {
        event.preventDefault();

        if (!userData || !userData.id) {
            toast.error("User data not found. Please log in again.", {
                onClose: () => navigate("/Login"), // تنفيذ navigate بعد إغلاق الـ toast
            });
            return;
        }

        const requestData = {
            title: event.target.title.value,
            description: event.target.description.value,
            type: event.target.type.value,
            pickup_date: event.target.pickup_date.value,
            user_id: userData.id, // إضافة user_id من البيانات المخزنة
        };

        // إضافة العنوان واسم الموصل إذا كان النوع هو Courier
        if (requestData.type === "courier") {
            requestData.address = event.target.address.value;
        }
        console.log(requestData)
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/requests", requestData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 201) {
                setRequests([...requests, response.data.data]);
                toast.success("Request created successfully!");
            } else {
                toast.error(response.data.message || "Failed to create request.");
            }
        } catch (error) {
            if (error.response) {
                toast.error("Validation Error: " + JSON.stringify(error.response.data.errors));
            } else {
                toast.warning("Something went wrong.");
            }
        }
    };

useEffect(() => {
    const fetchCouriers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/couriers", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setCouriers(response.data.data);
        } catch (error) {
            console.error("Error fetching couriers:", error);
            toast.error("Failed to fetch couriers.");
        }
    };

    fetchCouriers();
}, []);

    return (
        <>
            <div className="user-home-container container">
                <aside className="sidebar">
                    <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
                        <FaUser className="icon" /> Profile
                    </button>
                    <button className={activeTab === "createRequest" ? "active" : ""} onClick={() => setActiveTab("createRequest")}>
                        <FaPlus className="icon" /> New Request
                    </button>
                    <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
                        <FaList className="icon" /> Your Requests
                    </button>
                </aside>

                <main className="main-content">
                    {activeTab === "profile" && (
                        <div className="profile">
                            <h2 className="head">User Profile</h2>
                            <div className="profile-details">
                                <div className="profile-info">
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Account Type:</strong> {user.role}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "createRequest" && (
                        <div className="create-request">
                            <h2 className="head">Create New Request</h2>
                            <form className="request-form" onSubmit={handleCreateRequest}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" name="title" placeholder="Enter request title" required />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" placeholder="Enter request description" required></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select 
                                        name="type" 
                                        required 
                                        onChange={(e) => setRequestType(e.target.value)} // تحديث حالة نوع الطلب
                                    >
                                        {user.role === 'Individual' ? (
                                            <>
                                                <option value="drop-off">Drop-off</option>
                                                <option value="courier">Courier</option>
                                            </>
                                        ) : user.role === 'Business' ? (
                                            <option value="on-site">On-site</option>
                                        ) : null}
                                    </select>
                                </div>
                                {requestType === "courier" && (
                                    <>
                                        <div className="form-group">
                                            <label>Delivery Address</label>
                                            <input 
                                                type="text" 
                                                name="address" 
                                                placeholder="Enter delivery address" 
                                                required 
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="form-group">
                                    <label>Preferred Pickup Date & Time</label>
                                    <input type="datetime-local" name="pickup_date" required />
                                </div>
                                <button type="submit" className="submit-button">Submit Request</button>
                            </form>
                        </div>
                    )}

                    {activeTab === "requests" && (
                        <div className="requests-container">
                            <h2 className="head">Support Requests Management</h2>
                            {loading ? (
                                <p>Loading requests...</p>
                            ) : requests.length === 0 ? (
                                <p>No requests found.</p>
                            ) : (
                                <table className="requests-table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Pickup Date</th>
                                            <th>Created At</th>
                                            <th>Status</th>
                                            {requests.some(request => request.type === "courier") && <th>Address</th>}
                                            {requests.some(request => request.type === "courier") && <th>Courier Name</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((request) => {
                                            let statusIcon;
                                            if (request.status === "Completed") {
                                                statusIcon = <FaCheckCircle className="status-iconn completed" />;
                                            } else if (request.status === "Pending") {
                                                statusIcon = <FaHourglassHalf className="status-iconn pending" />;
                                            } else if (request.status === "Rejected") {
                                                statusIcon = <FaTimesCircle className="status-iconn rejected" />;
                                            } else {
                                                statusIcon = <FaSpinner className="status-iconn Progress" />;
                                            }

                                            return (
                                                <tr key={request.id} className={`request-row ${request.status}`}>
                                                    <td>{request.title}</td>
                                                    <td>{request.type}</td>
                                                    <td>{new Date(request.pickup_date).toLocaleString()}</td>
                                                    <td>{new Date(request.created_at).toLocaleString()}</td>
                                                    <td>
                                                        <span className={`status ${request.status}`}>
                                                            {statusIcon} {request.status}
                                                        </span>
                                                    </td>
                                                    {request.type === "courier" && ( 
                                                        <>
                                                            <td>{request.address}</td>
                                                            <td>
                                                                {couriers.find(courier => courier.id === request.courier_id)?.name || "N/A"} 
                                                                - {couriers.find(courier => courier.id === request.courier_id)?.phone_number || "N/A"}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
}

export default UserHome;