
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function UserManagement() {
//   const { token } = useContext(AuthContext); 
//   const [users, setUsers] = useState([]); 
//   const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });  
//   const [loading, setLoading] = useState(false); 
//   const [message, setMessage] = useState("");  
//   const [editUser, setEditUser] = useState(null);  
//   const [role, setRole] = useState("user");
//   const navigate = useNavigate();  

//   useEffect(() => {
//     if (!token) {
//         console.log("token:", token); 
//       navigate("/login");  
//       return;
//     }
//     fetchUsers();  
//   }, [token]);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users); 
//     } catch (err) {
//       console.error("Failed to load users", err);
//       setMessage("Error loading users.");
//     }
//   };


//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");  

//     try {
//       await axios.post("http://localhost:5001/auth/register", newUser, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("User added successfully!");
//       setNewUser({ name: "", email: "", password: "" });  
//       fetchUsers(); 
//     } catch (err) {
//       console.error(err);
//       setMessage(err?.response?.data?.message || "Error adding user");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleEditUser = (user) => {
//     setEditUser(user); 
//   };

//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");  

//     try {
//       await axios.put(`http://localhost:5001/auth/users/${editUser.id}`, editUser, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("User updated successfully!");
//       setEditUser(null); 
//       fetchUsers(); 
//     } catch (err) {
//       console.error(err);
//       setMessage(err?.response?.data?.message || "Error updating user");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await axios.delete(`http://localhost:5001/auth/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("User deleted.");
//       fetchUsers(); 
//     } catch (err) {
//       console.error(err);
//       setMessage("Error deleting user.");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-primary mb-4">User Management</h2>

//       {message && <div className="alert alert-info">{message}</div>}


//       <form className="mb-4" onSubmit={handleAddUser}>
//   <div className="row g-2">
//     <div className="col-md-3">
//       <input
//         type="text"
//         placeholder="Name"
//         className="form-control"
//         value={newUser.name}
//         onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//         required
//       />
//     </div>
//     <div className="col-md-3">
//       <input
//         type="email"
//         placeholder="Email"
//         className="form-control"
//         value={newUser.email}
//         onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//         required
//       />
//     </div>
//     <div className="col-md-3">
//       <input
//         type="password"
//         placeholder="Password"
//         className="form-control"
//         value={newUser.password}
//         onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//         required
//       />
//     </div>
//     <div className="col-md-3">
//       <select
//         className="form-control"
//         value={newUser.role}
//         onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//         required
//       >
//         <option value="user">User</option>
//         <option value="admin">Admin</option>
//         <option value="moderator">Moderator</option>
//       </select>
//     </div>
    
//     <div className="col-md-3">
//       <button className="btn btn-success w-100" type="submit" disabled={loading}>
//         {loading ? "Adding..." : "Add User"}
//       </button>
//     </div>
//   </div>
// </form>


    
// {editUser && (
//   <form className="mb-4" onSubmit={handleUpdateUser}>
//     <div className="row g-2">
//       <div className="col-md-3">
//         <input
//           type="text"
//           placeholder="Name"
//           className="form-control"
//           value={editUser.name}
//           onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//           required
//         />
//       </div>
//       <div className="col-md-3">
//         <input
//           type="email"
//           placeholder="Email"
//           className="form-control"
//           value={editUser.email}
//           onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//           required
//         />
//       </div>
//       <div className="col-md-3">
//         <input
//           type="password"
//           placeholder="Password"
//           className="form-control"
//           value={editUser.password}
//           onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
//         />
//       </div>
//       <div className="col-md-3">
//         <select
//           className="form-control"
//           value={editUser.role}
//           onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
//           required
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//           <option value="moderator">Moderator</option>
//         </select>
//       </div>
//       <div className="col-md-3">
//         <button className="btn btn-primary w-100" type="submit" disabled={loading}>
//           {loading ? "Updating..." : "Update User"}
//         </button>
//       </div>
//     </div>
//   </form>
// )}


//       {/* User List */}
//       <table className="table table-bordered table-hover">
//         <thead className="table-light">
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center">
//                 No users found
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td className="text-center">
//                 <i
//                     className="fa fa-pencil-alt text-warning"
//                     style={{ cursor: "pointer", marginRight: "10px" }}
//                     onClick={() => handleEditUser(user)}
//                     title="Edit"
//                   ></i>
//                   <i
//                     className="fa fa-trash-alt text-danger"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => handleDelete(user.id)}
//                     title="Delete"
//                   ></i>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserManagement;



import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function UserManagement() {
  const { token,user } = useContext(AuthContext); 
  const [users, setUsers] = useState([]); 
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });  
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState("");  
  const [editUser, setEditUser] = useState(null);  
  const navigate = useNavigate();  

  useEffect(() => {
    if (!token) {
        console.log("token:", token); 
      navigate("/login");  
      return;
    }
    fetchUsers();  
  }, [token]);

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");  

    try {
      await axios.post("http://localhost:5001/auth/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User added successfully!");
      setNewUser({ name: "", email: "", password: "", role: "user" });  
      fetchUsers(); 
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user); 
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");  

    try {
      await axios.put(`http://localhost:5001/auth/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    <div className="container mt-5">
      <h2 className="text-primary mb-4">User Management</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {user?.role === 'admin' && (
  <button
    className="btn btn-primary mb-3"
    data-bs-toggle="modal"
    data-bs-target="#addUserModal"
  >
    Add User
  </button>
)}

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
        <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
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
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-control"
                value={newUser.role || "user"}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
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
          <button className="btn btn-success" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>



      {/* Add New User Form
      <form className="mb-4" onSubmit={handleAddUser}>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Name"
              className="form-control"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-success w-100" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </div>
      </form> */}

      {/* Edit User Form */}
      {editUser && (
        <form className="mb-4" onSubmit={handleUpdateUser}>
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* User List */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No users found</td></tr>
          ) : (
            users.map((userInTable) => (
              <tr key={userInTable.id}>
                <td>{userInTable.id}</td>
                <td>{userInTable.name}</td>
                <td>{userInTable.email}</td>
                <td>{userInTable.role}</td>
                <td className="text-center">
                  {user?.role === 'admin' && userInTable.role !== 'admin' && (
                    <>
                      <i className="fa fa-pencil-alt text-warning" style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditUser(userInTable)} title="Edit"></i>
                      <i className="fa fa-trash-alt text-danger" style={{ cursor: "pointer" }} onClick={() => handleDelete(userInTable.id)} title="Delete"></i>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
