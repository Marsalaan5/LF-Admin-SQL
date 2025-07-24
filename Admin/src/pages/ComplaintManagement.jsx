import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function ComplaintManagement() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [complaintsPerPage, setComplaintsPerPage] = useState(10);
  const [statusOptions, setStatusOptions] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [activeStatus, setActiveStatus] = useState("total");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedComplaintLocation, setSelectedComplaintLocation] =
    useState(null);
  const [feedbackModal, setFeedbackModal] = React.useState(null);
  const [rating, setRating] = React.useState("");
  const [feedbackText, setFeedbackText] = React.useState("");

  const [page, setPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCategories();
      fetchSubCategories();
      fetchComplaints();
      fetchStatusOptions();
    }
  }, [token, location]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5001/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategoryList(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategoryList([]);
    }
  };


  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/auth/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategoryList(res.data);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
      setSubCategoryList([]);
    }
  };

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5001/auth/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  };

  const fetchStatusOptions = async () => {
    const res = await axios.get(
      "http://localhost:5001/auth/complaints/status-options",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStatusOptions(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await axios.put(
      `http://localhost:5001/auth/complaints/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    toast.success("Status updated");
  };

  const handleAssign = async (complaintId, assignedToId) => {
    try {
      await axios.put(
        `http://localhost:5001/auth/complaints/${complaintId}/assign`,
        { assignedToId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? { ...c, assigned_to: parseInt(assignedToId, 10) }
            : c
        )
      );
      toast.success("Complaint assigned successfully");
    } catch {
      toast.error("Assignment failed");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!rating) return;

    try {
      await axios.put(
        `http://localhost:5001/auth/complaints/${feedbackModal.id}/feedback`,
        { rating: Number(rating), feedback: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Feedback submitted");
      setFeedbackModal(null);
      setRating("");
      setFeedbackText("");
      fetchComplaints(); // your existing function to refresh the list
    } catch (error) {
      toast.error("Failed to submit feedback", error);
    }
  };

  const handleImageClick = (imagePath) => setModalImage(imagePath);
  const closeModal = () => setModalImage(null);
  const handleViewUser = (uId) => setSelectedUser(userMap[uId]);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const categoryMap = Object.fromEntries(categoryList.map((c) => [c.id, c]));

  const subcategoryMap = Object.fromEntries(
    subCategoryList.map((s) => [s.id, s])
  );

  const validateCategorySubcategoryMapping = () => {
    complaints.forEach((c) => {
      if (!categoryMap[c.categories]) {
        console.warn(
          `🚨 Complaint ID ${c.id} has an invalid category ID: ${c.categories}`
        );
      }

      if (!subcategoryMap[c.subcategory]) {
        console.warn(
          `⚠️ Complaint ID ${c.id} has an invalid subcategory ID: ${c.subcategory}`
        );
      }
    });
  };
  useEffect(() => {
    if (
      complaints.length &&
      Object.keys(categoryMap).length &&
      Object.keys(subcategoryMap).length
    ) {
      validateCategorySubcategoryMapping();
    }
  }, [complaints, categoryMap, subcategoryMap]);

  const visibleComplaints =
    user?.role === "Super Admin"
      ? complaints
      : complaints.filter((c) => c.user_id === user?.id);

  const filteredComplaints =
    activeStatus === "total"
      ? visibleComplaints
      : visibleComplaints.filter(
          (c) => c.status.toLowerCase() === activeStatus
        );

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const currentComplaint = filteredComplaints.slice(
    (page - 1) * complaintsPerPage,
    page * complaintsPerPage
  );

  const statusCounts = complaints.reduce((acc, c) => {
    const key = c.status.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  statusCounts.total = complaints.length;

  const statusTextColors = {
    total: "text-dark",
    pending: "text-warning",
    open: "text-primary",
    "in progress": "text-info",
    awaiting: "text-secondary",
    resolved: "text-success",
    rejected: "text-danger",
    closed: "text-success",
  };

  const statusIcons = {
    total: "fas fa-list",
    pending: "fas fa-exclamation-circle",
    open: "fas fa-folder-open",
    "in progress": "fas fa-spinner",
    awaiting: "fas fa-hourglass-half",
    resolved: "fas fa-check-double",
    rejected: "fas fa-times-circle",
    closed: "fas fa-check-circle",
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "open":
        return "bg-primary text-white";
      case "in progress":
        return "bg-info text-dark";
      case "awaiting":
        return "bg-secondary text-white";
      case "resolved":
        return "bg-success text-white";
      case "rejected":
        return "bg-danger text-white";
      case "closed":
        return "bg-success text-white";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div
      className="container-fluid border shadow-sm bg-light rounded"
      style={{ marginTop: "100px", width: "98%" }}
    >
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h3>Complaint Management System</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Complaint Management
              </li>
            </ol>
          </nav>
        </div>
        <Link to="/complaints">
          <button className="btn btn-success">
            <i className="fas fa-plus me-2"></i>
            Add Complaint
          </button>
        </Link>
      </div>

      {/* Status filter cards */}
      <div className="row">
        {[
          ...["total"],
          ...statusOptions.map((s) => s.status.toLowerCase()),
        ].map((key) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const count = statusCounts[key] || 0;
          const color = statusTextColors[key] || "text-muted";
          const icon = statusIcons[key] || "fas fa-question-circle";
          const isActive = activeStatus === key;
          return (
            <div className="col-md-3 col-sm-6 mb-2" key={key}>
              <div
                className={`card shadow-sm small-card border ${
                  isActive ? "border-" + color.split(" ")[1] : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setActiveStatus(key);
                  setPage(1);
                }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6
                      className={`${color} text-uppercase mb-1`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {label}
                    </h6>
                    <h5 className={`fw-bold ${color} mb-0`}>{count}</h5>
                  </div>
                  <i className={`${icon} fa-2x ${color}`}></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              {/* <th>Title</th> */}
              <th>Mobile</th>
              <th>Address</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Description</th>
              <th>Image</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {currentComplaint.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">
                  No complaints found.
                </td>
              </tr>
            ) : (
              currentComplaint.map((c, i) => {
                console.log("Complainttttttttt object:", c);

                console.log("Complaint:", c);
                console.log("CategoryMap Match:", categoryMap[c.categories]);

                return (
                  <tr key={c.id}>
                    <td>{(page - 1) * complaintsPerPage + i + 1}</td>
                    <td>
                      ID: {c.user_id}
                      <br />
                      Name: {userMap[c.user_id]?.name || "Unknown"}
                    </td>
                    <td>{c.mobile}</td>
                    <td style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                      {c.address}
                    </td>

                    <td>{categoryMap[c.categories]?.category_name || "N/A"}</td>
                    {/* <td>{subcategoryMap[(c.subcategories)]?.subcategory_name || "-"}</td> */}
                    <td>
                      {c.subcategory && subcategoryMap[c.subcategory] ? (
                        subcategoryMap[c.subcategory].subcategory_name
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* <td>{c.subcategory_name || "N/A"}</td> */}

                    <td style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                      {c.description}
                    </td>

                    <td>
                      {c.image ? (
                        <img
                          src={`http://localhost:5001/auth/uploads/${c.image}`}
                          alt="Complaint"
                          style={{ width: "100px", cursor: "pointer" }}
                          onClick={() =>
                            handleImageClick(
                              `http://localhost:5001/auth/uploads/${c.image}`
                            )
                          }
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td>
                      <span
                        className={getStatusBadgeColor(c.status.toLowerCase())}
                      >
                        {c.status}
                      </span>
                      {user?.role === "Super Admin" && (
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c.id, e.target.value)
                          }
                          className="form-select mt-1"
                        >
                          {statusOptions.map((s) => (
                            <option key={s.id} value={s.status}>
                              {s.status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td>
                      {user?.role === "Super Admin" ? (
                        <div className="d-flex align-items-center gap-1">
                          <select
                            className="form-select form-select-sm border-primary"
                            value={c.assigned_to || ""}
                            onChange={(e) => handleAssign(c.id, e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {users
                              .filter((u) => ["Admin"].includes(u.role))
                              .map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.name} ({u.role})
                                </option>
                              ))}
                          </select>
                        </div>
                      ) : c.assigned_to ? (
                        <div className="d-flex align-items-center gap-2">
                          <i className="fas fa-user-tag text-info"></i>
                          <div>
                            <strong>{userMap[c.assigned_to]?.name}</strong>
                            <br />
                            <span className="badge bg-secondary small">
                              {userMap[c.assigned_to]?.role}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted fst-italic">
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm me-1"
                        onClick={() => handleViewUser(c.user_id)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {c.latitude && c.longitude && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setSelectedComplaintLocation({
                              lat: parseFloat(c.latitude),
                              lng: parseFloat(c.longitude),
                              address: c.address,
                            })
                          }
                        >
                          <i className="fas fa-map-marker-alt"></i>
                        </button>
                      )}
                    </td>

                    <td>
                      {c.status === "resolved" &&
                      !c.feedback &&
                      c.user_id === user?.id ? (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setFeedbackModal(c)}
                        >
                          Give Feedback
                        </button>
                      ) : c.rating ? (
                        <div>
                          <span>⭐ {c.rating}/5</span>
                          <br />
                          <small>{c.feedback}</small>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination className="d-flex justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === page}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        />
      </Pagination>

      {modalImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Image Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={modalImage}
                  alt="Full Preview"
                  style={{ maxWidth: "100%", maxHeight: "70vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Customer Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedUser.mobile || "N/A"}
                </p>
                {/* <p><strong>Address:</strong> {selectedUser.address|| "N/A"}</p> */}
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                {/* You can show more fields if available */}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedComplaintLocation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSelectedComplaintLocation(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Complaint Location: {selectedComplaintLocation.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedComplaintLocation(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Address:</strong> {selectedComplaintLocation.address}
                </p>
                <div style={{ height: "400px" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${selectedComplaintLocation.lat},${selectedComplaintLocation.lng}&z=15&output=embed`}
                    allowFullScreen
                    title="Complaint Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {feedbackModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Feedback for: {feedbackModal.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setFeedbackModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Rating (1 to 5)</label>
                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write your feedback here..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setFeedbackModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitFeedback}
                  disabled={!rating}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ComplaintManagement;
