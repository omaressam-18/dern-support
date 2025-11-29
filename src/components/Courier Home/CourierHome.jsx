import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaUser, FaList, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CourierHome.css"; // تأكد من إنشاء ملف CSS لهذه الصفحة

function CourierHome() {
    const [activeTab, setActiveTab] = useState("profile");
    const [courier, setCourier] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("courierData")) || {};
        } catch (error) {
            console.error("Error parsing courierData:", error);
            return {};
        }
    });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCourierRequests = useCallback(async () => {
        if (!courier?.id) {
            toast.error("User data not found. Please log in again.", {
                onClose: () => navigate("/Login"),
                autoClose: 1500
            });
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/requests?courier_id=${courier.id}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            setRequests(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to fetch requests.");
        } finally {
            setLoading(false);
        }
    }, [courier.id, navigate]);

    useEffect(() => {
        if (courier?.id) {
            fetchCourierRequests();
        }
    }, [courier.id, fetchCourierRequests]);

    const updateStatus = async (id) => {
        try {
            toast.info('Updating status...', { autoClose: false });

            const response = await axios.put(
                `http://127.0.0.1:8000/api/requests/${id}`,
                { status: "Completed" }, // تحديث الحالة إلى "Completed" فقط
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setRequests(prev => prev.map(req =>
                    req.id === id ? { ...req, status: "Completed" } : req
                ));
                toast.dismiss();
                toast.success("Status updated to Completed");
            } else {
                toast.dismiss();
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.dismiss();
            console.error('Error details:', error.response?.data);
            toast.error(`Failed to update status: ${error.response?.data.message || 'Unknown error'}`);
        }
    };

    return (
        <>
            <div className="user-home-container container">
                <aside className="sidebar">
                    <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
                        <FaUser className="icon" /> Profile
                    </button>
                    <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
                        <FaList className="icon" /> Assigned Requests
                    </button>
                </aside>

                <main className="main-content">
                    {activeTab === "profile" && (
                        <div className="profile">
                            <h2 className="head">Courier Profile</h2>
                            <div className="profile-details">
                                <div className="profile-info">
                                    <p><strong>Name:</strong> {courier?.name || "N/A"}</p>
                                    <p><strong>Phone:</strong> {courier?.phone_number || "N/A"}</p>
                                    <p><strong>Email:</strong> {courier?.email || "N/A"}</p>
                                    <p><strong>Account Type:</strong> {courier?.role || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "requests" && (
                        <div className="requests-container">
                            <h2 className="head">Assigned Requests</h2>
                            {loading ? (
                                <p>Loading requests...</p>
                            ) : requests.length === 0 ? (
                                <p>No assigned requests found.</p>
                            ) : (
                                <div className="requests-grid">
                                    {requests.map((request) => {
                                        let statusIcon;
                                        switch (request.status) {
                                            case "Completed":
                                                statusIcon = <FaCheckCircle className="status-iconn completed" />;
                                                break;
                                            case "Pending":
                                                statusIcon = <FaHourglassHalf className="status-iconn pending" />;
                                                break;
                                            case "Rejected":
                                                statusIcon = <FaTimesCircle className="status-iconn rejected" />;
                                                break;
                                            default:
                                                statusIcon = <FaSpinner className="status-iconn Progress" />;
                                                break;
                                        }

                                        return (
                                            <div key={request.id} className={`request-card ${request.status}`}>
                                                <div className="card-header">
                                                    <div className="d-flex flex-column justify-content-center align-items-start">
                                                        <h4>{request.title}</h4>
                                                        <p>{request.description}</p>
                                                    </div>
                                                    {statusIcon}
                                                </div>

                                                <div className="card-details">
                                                    <p><strong>Email:</strong> {request.user?.email || "N/A"}</p>
                                                    <p><strong>Type:</strong> {request.type}</p>
                                                    <p><strong>Pickup Date:</strong> {new Date(request.pickup_date).toLocaleDateString()}</p>
                                                    <p><strong>Created At:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                                                    {request.type === "courier" && <p><strong>Address:</strong> {request.address}</p>}
                                                </div>

                                                {request.status !== "Completed" && (
                                                    <button
                                                        className="btn btn-primary w-100 mt-2"
                                                        onClick={() => updateStatus(request.id)}
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
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

export default CourierHome;