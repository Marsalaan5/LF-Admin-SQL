import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "react-bootstrap/Pagination";

function UserManagement() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    if (!token) {
      console.log("token:", token);
      navigate("/login");
      return;
    }
    fetchUsers();
    fetchRoles();
  }, [token]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      console.log("Fetched users:", res.data.users);
    } catch (err) {
      console.error("Failed to load users", err);
      setMessage("Error loading users.");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to load roles", err);
      setMessage("Error loading roles.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5001/auth/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User added successfully!");
      setNewUser({ name: "", email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  // const handleEditUser = (user) => {
  //   setEditUser(user);
  // };

  const handleEditUser = (user) => {
    setEditUser({
      ...user,
      role_id: roles.find((r) => r.name === user.role)?.id || "",
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `http://localhost:5001/auth/users/${editUser.id}`,
        editUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("User updated successfully!");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5001/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User deleted.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("Error deleting user.");
    }
  };

  return (
    <div className="container-fluid mt-5 p-5 border shadow-sm">
      <div className="p-4 d-flex justify-content-between align-items-center">
        <div className="col-sm-6">
          <h1 className="m-0 text-dark">User Management</h1>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">User Management</li>
            </ol>
          </div>
        </div>

        {/* <h4 className="mb-0 fw-semibold text-primary">User Management</h4> */}
        {/* {user?.role === "admin" && ( */}

        <button
          className="btn btn-success d-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#addUserModal"
        >
          <i className="fas fa-plus me-2"></i> Add User
        </button>
        {/* )} */}
      </div>

      <div
        className="modal fade"
        id="addUserModal"
        tabIndex="-1"
        aria-labelledby="addUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">
                Add New User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Name"
                      className="form-control"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      placeholder="Email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-control"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-control"
                      value={newUser.status}
                      onChange={(e) =>
                        setNewUser({ ...newUser, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit User Form */}
      {editUser && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <form onSubmit={handleUpdateUser}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditUser(null)}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={editUser.name}
                        onChange={(e) =>
                          setEditUser({ ...editUser, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={editUser.email}
                        onChange={(e) =>
                          setEditUser({ ...editUser, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={editUser.password}
                        onChange={(e) =>
                          setEditUser({ ...editUser, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      {/* <select
                        className="form-control"
                        value={editUser.role}
                        onChange={(e) =>
                          setEditUser({ ...editUser, role: e.target.value })
                        }
                        required
                      > */}
                      <select
                        className="form-control"
                        value={editUser.role}
                        onChange={(e) => {
                          const selectedRole = roles.find(
                            (r) => r.name === e.target.value
                          );
                          setEditUser({
                            ...editUser,
                            role: selectedRole.name,
                            role_id: selectedRole.id,
                          });
                        }}
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <select
                        className="form-control"
                        value={editUser.status}
                        onChange={(e) =>
                          setEditUser({ ...editUser, status: e.target.value })
                        }
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="bg-white p-4 rounded shadow-sm mt-2">
        <h5 className="container mt-2 p-3 d-flex justify-content-between align-items-center border rounded shadow-sm bg-light">
          User List
        </h5>

        <table className="table table-hover align-middle mt-4 mb-0">
          <thead className="bg-secondary text-white">
            <tr>
              <th scope="col">ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((userInTable) => (
                <tr key={userInTable.id}>
                  <td>{userInTable.id}</td>
                  {/* <td>{indexOfFirstUser + index + 1}</td> */}
                  <td className="fw-semibold">
                    {userInTable.name
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </td>
                  <td>{userInTable.email}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 text-uppercase fw-semibold`}
                      style={{
                        backgroundColor:
                          userInTable.status === "active"
                            ? "#d4edda"
                            : "#f8d7da",
                        color:
                          userInTable.status === "active"
                            ? "#155724"
                            : "#721c24",
                        borderRadius: "5px",
                        fontSize: "0.65rem",
                      }}
                    >
                      {userInTable.status}
                    </span>
                  </td>
                  <td>
                    {userInTable.role.charAt(0).toUpperCase() +
                      userInTable.role.slice(1)}
                  </td>
                  {/* <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditUser(userInTable)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(userInTable.id)}
                    >
                      Delete
                    </button>
                  </td> */}
                  <td className="text-center">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditUser(userInTable)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleDelete(userInTable.id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination className="d-flex mt-3 justify-content-center">
          <Pagination.Prev
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
}

export default UserManagement;
