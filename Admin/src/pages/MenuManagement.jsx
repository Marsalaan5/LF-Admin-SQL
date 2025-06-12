import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; 


function MenuManagement({ userRole }) {
  const { token } = useContext(AuthContext);
  // const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedRole, setSelectedRole] = useState(userRole || "");
  const [statuses, setStatuses] = useState([]);

  const [newItem, setNewItem] = useState({
    title: "",
    path: "",
    icon: "",
    roles: [],
    parent_id: null,
    status: "active",
    order_by: 0,
  });
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userRole && token) {
      fetchMenuItems();
      fetchRoles();
      fetchStatuses();
    }
  }, [userRole, token, showAll]);

  useEffect(() => {
    if (selectedRole && token) {
      fetchMenuItems();
    }
  }, [selectedRole, token, showAll]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await axios.get("http://localhost:5001/auth/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const rolesArray =
        response.data.length > 0 && typeof response.data[0] === "object"
          ? response.data.map((role) => role.name)
          : response.data;
      setRolesList(rolesArray);
      setLoadingRoles(false);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles");
      setLoadingRoles(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoadingMenu(true);
      const response = await axios.get(
        `http://localhost:5001/auth/menu?role=${encodeURIComponent(
          selectedRole
        )}&showAll=${showAll}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMenuItems(response.data);
      setLoadingMenu(false);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
      setError("Failed to load menu");
      setLoadingMenu(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/status-options", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatuses(res.data);
    } catch (err) {
      console.error("Failed to fetch statuses", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      ...newItem,
      roles: newItem.roles.join(","),
    };
    try {
      if (editingItem) {
        await axios.put(
          `http://localhost:5001/auth/menu/${editingItem.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Menu item updated successfully");
      } else {
        await axios.post("http://localhost:5001/auth/menu", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Menu item added successfully");
      }
      await fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Error saving menu item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5001/auth/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Menu item deleted");
      await fetchMenuItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting menu item");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.patch(
        `http://localhost:5001/auth/menu/${id}/status`,
        { status: newStatus, role: userRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        `Menu item ${newStatus === "active" ? "enabled" : "disabled"}`
      );
      await fetchMenuItems();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setNewItem({
      title: "",
      path: "",
      icon: "",
      roles: [],
      parent_id: null,
      status: "active",
      order_by: 0,
    });
  };

  if (!userRole) return <p>Loading or no user role detected.</p>;

  return (
    <div className="container-fluid mt-5 p-2 border shadow-sm">
      <div className="p-4 d-flex justify-content-between align-items-center">
      <div className="col-sm-6">
        <h1 className="m-0 text-dark">Manage Menu </h1>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">Menu Management</li>
          </ol>
        </div>
      </div>

      <div className="mb-3">
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#menuModal"
          onClick={() => {
            setEditingItem(null);
            resetForm();
          }}
        >
         <i className="fas fa-plus me-2"></i>   Add New Menu Item
        </button>
      </div>
</div>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* <form onSubmit={handleSubmit} className="bg-light p-3 rounded mb-4">
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Path"
            value={newItem.path}
            onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Icon"
            value={newItem.icon}
            onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
          />
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleAllItems"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
          <label className="form-check-label" htmlFor="toggleAllItems">
            Show All Menu Items (including inactive)
          </label>
        </div> 

        {/* Roles multi-select */}
      {/* <div className="mb-2">
          <label htmlFor="rolesSelect" className="form-label  text-primary">
            Select Roles
          </label>
          {loadingRoles ? (
            <p>Loading roles...</p>
          ) : (
            <select
              id="rolesSelect"
              multiple
              className="form-select"
              value={newItem.roles}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions
                ).map((option) => option.value);
                setNewItem({ ...newItem, roles: selectedOptions });
              }}
              required
            >
              {rolesList.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          )}
          <small className="text-muted">
            Hold Ctrl (Cmd on Mac) to select multiple roles
          </small>
        </div>

        <div className="mb-2"> */}
      {/* <select
            className="form-select"
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}
      {/* <select
            className="form-control"
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Order"
            value={newItem.order_by}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                order_by: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingItem ? "Update" : "Add"} Menu Item
        </button>
        {editingItem && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form> */}

      {/* Modal for Add/Edit Menu Item */}
      <div
        className="modal fade"
        id="menuModal"
        tabIndex="-1"
        aria-labelledby="menuModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="menuModalLabel">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Title */}
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem({ ...newItem, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Path */}
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Path"
                    value={newItem.path}
                    onChange={(e) =>
                      setNewItem({ ...newItem, path: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Icon */}
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Icon"
                    value={newItem.icon}
                    onChange={(e) =>
                      setNewItem({ ...newItem, icon: e.target.value })
                    }
                  />
                </div>

                {/* Roles Multi-select */}
                <div className="mb-2">
                  <label className="form-label text-primary">
                    Select Roles
                  </label>
                  <select
                    multiple
                    className="form-select"
                    value={newItem.roles}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(
                        (opt) => opt.value
                      );
                      setNewItem({ ...newItem, roles: selected });
                    }}
                    required
                  >
                    {rolesList.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="mb-2">
                  <select
                    className="form-control"
                    value={newItem.status}
                    onChange={(e) =>
                      setNewItem({ ...newItem, status: e.target.value })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Order */}
                <div className="mb-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Order"
                    value={newItem.order_by}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        order_by: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {editingItem ? "Update" : "Add"} Menu Item
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleAllItems"
          checked={showAll}
          onChange={() => setShowAll(!showAll)}
        />
        <label className="form-check-label" htmlFor="toggleAllItems">
          Show All Menu Items (including inactive)
        </label>
      </div>

      <div className="mb-4 p-3 bg-white border rounded shadow-sm w-50">
        <label htmlFor="roleFilter" className="form-label  text-primary">
          Filter by Role
        </label>
        <select
          id="roleFilter"
          className="form-select form-select-md"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ maxWidth: "300px" }}
        >
          <option value="">-- Select Role --</option>
          {rolesList.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {loadingMenu ? (
        <p>Loading menu...</p>
      ) : menuItems.length === 0 ? (
        <p>No menu items found for your role.</p>
      ) : (
        <ul className="list-group">
          {menuItems.map((item) => {
            const itemRoles = Array.isArray(item.roles)
              ? item.roles
              : item.roles.split(",").map((r) => r.trim());
            const isForRole = itemRoles.includes(userRole);
            const isActiveForRole = item.status === "active" && isForRole;

            // if (!isForRole) return null;
            // if (!showAll && item.status !== "active" && !['Super Admin', 'Admin','User','Viewer'].includes(userRole)) return null;
            if (!showAll && item.status !== "active") return null;

            // if (!showAll && item.status !== "active" && userRole !== 'Super Admin, Admin') return null;

            return (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {item.title}{" "}
                  <small className="text-muted">({item.path})</small>
                  {item.status !== "active" && (
                    <span className="badge bg-secondary ms-2">Disabled</span>
                  )}
                </span>

                <div>
                  {/* <button
                    className="btn btn-sm btn-light me-1"
                    onClick={() => {
                      setEditingItem(item);
                      setNewItem({
                        title: item.title,
                        path: item.path,
                        icon: item.icon || "",
                        roles: itemRoles,
                        parent_id: item.parent_id || null,
                        status: item.status,
                        order_by: item.order_by,
                      });
                    }}
                  >
                    Edit
                  </button> */}
                  <button
                    className="btn btn-sm btn-light me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#menuModal"
                    onClick={() => {
                      setEditingItem(item);
                      setNewItem({
                        title: item.title,
                        path: item.path,
                        icon: item.icon || "",
                        roles: itemRoles,
                        parent_id: item.parent_id || null,
                        status: item.status,
                        order_by: item.order_by,
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger me-1"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`btn btn-sm ${
                      isActiveForRole ? "btn-warning" : "btn-success"
                    }`}
                    onClick={() => handleToggleStatus(item.id, item.status)}
                  >
                    {isActiveForRole ? "Disable" : "Enable"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
    //  </div>
  );
}

export default MenuManagement;
