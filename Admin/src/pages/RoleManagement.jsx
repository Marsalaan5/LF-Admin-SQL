import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import your AuthContext

const RolesManagement = () => {
  const { token } = useContext(AuthContext); // Get token from context
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modules, setModules] = useState({});

  useEffect(() => {
    fetchRoles();
    fetchModules();
  }, []);

  // Fetch roles data
  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/roles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      const parsed = res.data.map((role) => ({
        ...role,
        permissions:
          typeof role.permissions === "string"
            ? JSON.parse(role.permissions || "{}")
            : role.permissions || {},
      }));
      setRoles(parsed);
    } catch (err) {
      alert("Failed to load roles");
    }
  };

  // Fetch modules data
  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/modules", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setModules(res.data);
    } catch (err) {
      alert("Failed to load modules");
    }
  };

  // Handle permission changes in the modal
  const handlePermissionChange = (component, action) => {
    setPermissions((prev) => ({
      ...prev,
      [component]: {
        ...prev[component],
        [action]: !prev[component]?.[action],
      },
    }));
  };

  // Edit role
  const handleEdit = (role) => {
    setName(role.name);

    const defaultPerms = generateDefaultPermissions(modules);
    const mergedPermissions = { ...defaultPerms };

    Object.keys(role.permissions).forEach((key) => {
      if (mergedPermissions[key]) {
        if (Array.isArray(role.permissions[key])) {
          role.permissions[key].forEach((action) => {
            if (mergedPermissions[key][action] !== undefined) {
              mergedPermissions[key][action] = true;
            }
          });
        }
      }
    });

    setPermissions(mergedPermissions);
    setEditId(role.id);
    setShowModal(true);
  };

  // Delete role
  const handleDelete = async (id) => {
    if (window.confirm("Delete this role?")) {
      try {
        await axios.delete(`http://localhost:5001/auth/roles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        fetchRoles();
      } catch {
        alert("Delete failed");
      }
    }
  };

  // Submit role (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Role name required");

    try {
      const roleData = { name, permissions };

      if (editId) {
        await axios.put(
          `http://localhost:5001/auth/roles/${editId}`,
          roleData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
      } else {
        await axios.post("http://localhost:5001/auth/roles", roleData, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
      }

      setShowModal(false);
      fetchRoles(); // Refresh the roles list
    } catch (err) {
      alert("Error saving role");
    }
  };

  // Generate default permissions based on modules
  const generateDefaultPermissions = (modules) => {
    const perms = {};

    Object.keys(modules).forEach((module) => {
      perms[module] = {};
      modules[module].forEach((action) => {
        perms[module][action] = false; // All actions are initially false
      });
    });

    return perms;
  };

  // Format permissions for display in the table
  const formatPermissions = (permissions) => {
    return Object.entries(permissions)
      .map(([component, actions]) => {
        const allowed = Object.entries(actions)
          .filter(([_, allowed]) => allowed)
          .map(([action]) => action);
        return `${component}: ${allowed.join(", ") || "None"}`;
      })
      .join(" | ");
  };

  // Open modal to add a new role
  const openAddModal = () => {
    setName("");
    setPermissions(generateDefaultPermissions(modules));
    setEditId(null);
    setShowModal(true);
  };

  return (
    // <div className="container mt-5 p-5">
    //   <h2 className="text-center mb-4">Role Management</h2>
    //   <div className="mb-3 text-end">
    //     <button className="btn btn-success" onClick={openAddModal}>
    //       Add Role
    //     </button>
    //   </div>

     <div className="container-fluid mt-5 p-5 border shadow-sm">
      <div className="  p-4 d-flex justify-content-between align-items-center">
         <div className="col-sm-6">
                <h1 className="m-0 text-dark">Role Management</h1>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Role Management</li>
                  </ol>
                </div>
              </div>
        {/* <h4 className="mb-0 fw-semibold text-primary">Role Management</h4> */}
      

       <button className="btn btn-success" onClick={openAddModal}>
       < i className="fas fa-plus me-2"></i>
       Add Role
      </button>
      
      </div>

      <div className="mt-5"></div>

      <table className="table table-striped table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Role</th>
            <th>Permissions</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td className="fw-semibold">{role.name}</td>
              <td>{formatPermissions(role.permissions)}</td>
              {/* <td className="d-flex text-center">
                <button
                  className="btn btn-primary btn-sm mx-1"
                  onClick={() => handleEdit(role)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => handleDelete(role.id)}
                >
                  Delete
                </button>
              </td> */}
              <td className="d-flex justify-content-center">
  <button
    className="btn btn-outline-primary btn-sm mx-1"
    onClick={() => handleEdit(role)}
    title="Edit"
  >
    <i className="fas fa-edit"></i>
  </button>
  <button
    className="btn btn-outline-danger btn-sm mx-1"
    onClick={() => handleDelete(role.id)}
    title="Delete"
  >
    <i className="fas fa-trash-alt"></i>
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding/editing a role */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editId ? "Edit Role" : "Add Role"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label>Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <h5>Permissions</h5>
                  {Object.keys(modules).map((component) => (
                    <div key={component} className="mb-2">
                      <strong>
                        {component.replace("_", " ").toUpperCase()}
                      </strong>
                      <div className="form-check ms-3">
                        {modules[component].map((action) => (
                          <div
                            key={action}
                            className="form-check form-check-inline"
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={
                                permissions[component]?.[action] || false
                              }
                              onChange={() =>
                                handlePermissionChange(component, action)
                              }
                              id={`${component}-${action}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`${component}-${action}`}
                            >
                              {action}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagement;
