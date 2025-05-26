


import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link,useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from 'react-hot-toast';

function MenuManagement({ userRole }) {
  const { token } = useContext(AuthContext);
    const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAll, setShowAll] = useState(false);

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
  }
}, [userRole, token, showAll]);


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
      `http://localhost:5001/auth/menu?role=${encodeURIComponent(userRole)}&showAll=${showAll}`,
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
       toast.success(`Menu item ${newStatus === "active" ? "enabled" : "disabled"}`);
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
    // <div className="container mt-4">
      <div className="container-fluid mt-5 p-2 border shadow-sm">
        <div className="p-4 d-flex justify-content-between align-items-center"></div>
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
      {/* <div className="p-4 d-flex justify-content-center gap-3 align-items-center"> */}
      {/* <h5 className="mb-3">Manage Menu</h5> */}
      
     
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-light p-3 rounded mb-4">
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
        <div className="mb-2">
          <label htmlFor="rolesSelect" className="form-label">
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
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (option) => option.value
                );
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

        <div className="mb-2">
          <select
            className="form-select"
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Order"
            value={newItem.order_by}
            onChange={(e) =>
              setNewItem({ ...newItem, order_by: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingItem ? "Update" : "Add"} Menu Item
        </button>
        {editingItem && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

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
            if (!showAll && item.status !== "active" && !['Super Admin', 'Admin','User','Viewer'].includes(userRole)) return null;


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
                  <button
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
