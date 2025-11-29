import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaList, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSpinner, FaClock, FaEnvelope, FaTag, FaCalendar, FaFileAlt, FaUser, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminHome.css";

function AdminHome() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourierId, setSelectedCourierId] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("requests"); // State to manage active tab
  const navigate = useNavigate();

  const adminData = localStorage.getItem("adminData") && localStorage.getItem("adminData") !== "undefined"
    ? JSON.parse(localStorage.getItem("adminData"))
    : null;

  // Fetch requests and users
  useEffect(() => {
    if (!adminData || adminData.role !== "Admin") {
      toast.error("Unauthorized access. Redirecting to login.", {
        onClose: () => navigate("/Login"),
        autoClose: 1500,
      });
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Cache-Control': 'no-cache'
          }
        });

        const requestData = response.data.data;
        setRequests(requestData);

        // Fetch users
        const userIds = [...new Set(requestData.map(req => req.user_id))];
        const userResponses = await Promise.all(
          userIds.map(id =>
            axios.get(`http://127.0.0.1:8000/api/users/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Cache-Control': 'no-cache'
              }
            }).catch(() => null)
          )
        );

        const usersData = {};
        userResponses.forEach(response => {
          if (response && response.data) {
            usersData[response.data.data.id] = response.data.data;
          }
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  // Fetch couriers
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

  // Update request status
  const updateStatus = async (id, newStatus) => {
    if (!id || typeof id !== 'number') {
      toast.error('Invalid request ID');
      return;
    }

    try {
      toast.info('Updating status...', { autoClose: false });

      let response;
      if (newStatus === "In Progress") {
        response = await axios.put(
          `http://127.0.0.1:8000/api/requests/${id}`,
          { status: newStatus, courier_id: selectedCourierId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.put(
          `http://127.0.0.1:8000/api/requests/${id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.data.success) {
        setRequests(prev => prev.map(req =>
          req.id === id ? { ...req, status: newStatus, courier_id: selectedCourierId } : req
        ));
        toast.dismiss();
        toast.success(`Status updated to ${newStatus}`);
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

  // Handle courier selection
  const handleCourierSelection = (requestId) => {
    setSelectedRequestId(requestId);
  };

  // Confirm courier assignment
  const confirmCourier = async () => {
    if (!selectedCourierId || !selectedRequestId) {
      toast.error("Please select a courier and a request.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/requests/${selectedRequestId}`,
        { courier_id: selectedCourierId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setRequests(prev => prev.map(req =>
          req.id === selectedRequestId ? { ...req, courier_id: selectedCourierId } : req
        ));
        toast.success("Courier assigned successfully.");
      } else {
        toast.error("Failed to assign courier.");
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to assign courier: ${error.response?.data.message || 'Unknown error'}`);
    }
  };

  // Delete courier
  const deleteCourier = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/couriers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data.success) {
        setCouriers(prev => prev.filter(courier => courier.id !== id));
        toast.success("Courier deleted successfully.");
      } else {
        toast.error("Failed to delete courier.");
      }
    } catch (error) {
      console.error("Error deleting courier:", error);
      toast.error(`Failed to delete courier: ${error.response?.data.message || 'Unknown error'}`);
    }
  };

  // Filtered and searched requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Count requests by status
  const countRequestsByStatus = (status) => {
    return requests.filter(request => request.status === status).length;
  };

  return (
    <>
      <div className="admin-home-container container">
        <aside className="sidebar">
          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            <FaList className="icon" /> Manage Requests
          </button>
          <button
            className={activeTab === "couriers" ? "active" : ""}
            onClick={() => setActiveTab("couriers")}
          >
            <FaUser className="icon" /> Manage Couriers
          </button>
        </aside>

        <main className="main-content">
          {activeTab === "requests" ? (
            <>
              <h2 className="head">Support Requests Management</h2>

              {/* Statistics Section */}
              <div className="statistics">
                <div className="stat-card">
                  <h3>Total Requests</h3>
                  <p>{requests.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Completed</h3>
                  <p>{countRequestsByStatus("Completed")}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending</h3>
                  <p>{countRequestsByStatus("Pending")}</p>
                </div>
                <div className="stat-card">
                  <h3>In Progress</h3>
                  <p>{countRequestsByStatus("In Progress")}</p>
                </div>
                <div className="stat-card">
                  <h3>Rejected</h3>
                  <p>{countRequestsByStatus("Rejected")}</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="search-filters">
                <div className="search-bar">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filters">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Requests Grid */}
              {loading ? (
                <p>Loading requests...</p>
              ) : filteredRequests.length === 0 ? (
                <p>No requests found.</p>
              ) : (
                <div className="requests-grid">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className={`request-card ${request.status}`}>
                      <div className="card-header">
                        <div className="d-flex flex-column justify-content-center align-items-start">
                          <h4>{request.title}</h4>
                          <p>{request.description}</p>
                        </div>
                        {request.status === "Completed" && <FaCheckCircle className="status-icon completed" />}
                        {request.status === "Pending" && <FaHourglassHalf className="status-icon pending" />}
                        {request.status === "In Progress" && <FaSpinner className="status-icon in-progress" />}
                        {request.status === "Rejected" && <FaTimesCircle className="status-icon rejected" />}
                      </div>

                      <div className="card-details">
                        <p><FaEnvelope /> <strong>Email:</strong> {users[request.user_id]?.email || "N/A"}</p>
                        <p><FaTag /> <strong>Type:</strong> {request.type}</p>
                        <p><FaCalendar /> <strong>Pickup Date:</strong> {new Date(request.pickup_date).toLocaleDateString()}</p>
                        <p><FaCalendar /> <strong>Created At:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                        {request.type === "courier" && <p><FaFileAlt /><strong> Address:</strong> {request.address}</p>}
                        {request.courier_id && (
                          <p><FaUser /> <strong>Assigned Courier:</strong> {
                            couriers.find(courier => courier.id === request.courier_id)?.name || "N/A"
                          }</p>
                        )}
                      </div>

                      <select
                        className="status-dropdown"
                        value={request.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus === "In Progress") {
                            setSelectedCourierId(null);
                          }
                          updateStatus(request.id, newStatus);
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      {request.status === "In Progress" && request.type === 'courier' && (
                        <div className="form-group mt-2">
                          {request.courier_id ? (
                            <p>
                              <strong>Assigned Courier:</strong> {
                                couriers.find(courier => courier.id === request.courier_id)?.name || "N/A"
                              }
                            </p>
                          ) : (
                            <>
                              <select
                                value={selectedCourierId || ""}
                                onChange={(e) => {
                                  setSelectedCourierId(e.target.value);
                                  handleCourierSelection(request.id);
                                }}
                                required
                              >
                                <option value="">Select a courier</option>
                                {couriers.map(courier => (
                                  <option key={courier.id} value={courier.id}>
                                    {courier.name} ({courier.email})
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-primary mt-2"
                                onClick={confirmCourier}
                              >
                                Confirm Courier
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="head">Manage Couriers</h2>
              {loading ? (
                <p>Loading couriers...</p>
              ) : couriers.length === 0 ? (
                <p>No couriers found.</p>
              ) : (
                <table className="requests-table table-striped " >
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couriers.map((courier) => (
                      <tr key={courier.id}>
                        <td>{courier.name}</td>
                        <td>{courier.email}</td>
                        <td>{courier.phone_number}</td>
                        <td>
                          <button
                            className="btn btn-edit"
                            onClick={() => toast.info("Update functionality will be added soon.")}
                          >
                            <FaEdit color={"#fff"}/>
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => deleteCourier(courier.id)}
                          >
                            <FaTrash color={"#fff"}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
}

export default AdminHome;