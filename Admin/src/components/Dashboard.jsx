import axios from "axios";
import RoleChart from "../pages/RoleChart.jsx";
import { useState, useEffect, useContext, useRef } from "react";
import { useLocation,Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
// import 'react-datepicker/dist/react-datepicker.css';

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const socket = useRef(null);

  // Inside the Dashboard component
const location = useLocation();
const pathnames = location.pathname.split("/").filter((x) => x);


  // Fetch Users and Roles from backend
  const fetchUsersAndRoles = async () => {
    try {
      const usersResponse = await axios.get(
        "http://localhost:5001/auth/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const rolesResponse = await axios.get(
        "http://localhost:5001/auth/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(usersResponse.data.users);
      setRoles(rolesResponse.data.roles);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users or roles:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.current = io("http://localhost:5001");
    socket.current.on("connect", () => {
      console.log("Connected to socket:", socket.current.id);
    });

    socket.current.on("new-signup", (user) => {
      console.log("New user received:", user);
      toast.success(`New user signed up:${user.name}`);
    });

    return () => {
      socket.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    fetchUsersAndRoles();
 
  }, [token]);

  // Function to get role name from roleId
  // const getRoleName = (roleId) => {
  //   if (!roles || roles.length === 0) return "unknown";
  //   const role = roles.find((r) => r.id === roleId);
  //   return role ? role.title.toLowerCase() : "unknown";
  // };

  // const getRoleName = (roleValue) => {
  //   if (!roles || roles.length === 0) return "unknown";

  //   console.log("Roles:", roles);
  //   const role = roles.find(
  //     (role) => role.id === roleValue || role.name === roleValue
  //   );
  //   return role ? role.name.toLowerCase() : "unknown";
  // };


  const getRoleName = (roleValue) => {
  if (!roles || roles.length === 0) return "unknown";
  const role = roles.find(
    (r) =>  r.name === roleValue
  );
  if (!role) {
    console.warn(`Role not found for value: ${roleValue}`);
  }
  return role ? role.name.toLowerCase() : "unknown";
};



//   const getRoleName = (roleValue) => {
//   if (!roles || roles.length === 0) {
//     console.warn("Roles not loaded yet");
//     return "unknown";
//   }

//   const role = roles.find(
//     (r) =>
//       String(r.id) === String(roleValue) ||
//       String(r.name).toLowerCase() === String(roleValue).toLowerCase()
//   );

//   if (!role) {
//     console.warn("Role not found for:", roleValue);
//   } else {
//     console.log("Role matched:", roleValue, "->", role.name.toLowerCase());
//   }

//   return role ? role.name.toLowerCase() : "unknown";
// };


  if (loading) {
    return (
      <div className="container-fluid mt-5" style={{ paddingTop: "60px" }}>
        
        <div className="row">
          <div className="col-12 text-center">
            <h3>Loading data...</h3>
          </div>
        </div>
      </div>
    );
  }


  // Filter logic
  const filteredUsers = users.filter((user) => {
    const nameOrEmailMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filterStatus ? user.status === filterStatus : true;

    const roleName = getRoleName(user.roleId);
    const roleMatch = filterRole ? roleName === filterRole : true;

    const userDate = new Date(user.createdAt);
    const dateMatch =
      (!startDate || userDate >= startDate) &&
      (!endDate || userDate <= endDate);

    return nameOrEmailMatch && statusMatch && roleMatch && dateMatch;
  });

  return (
    <div className="container-fluid mt-5" style={{ paddingTop: "70px" }}>
       <div className="p-4 row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Dashboard</h1>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-2 mb-2">
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <select
            className="form-control"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
            placeholderText="Start Date"
          />
        </div>

        <div className="col-md-2 mb-2">
          <ReactDatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="form-control"
            placeholderText="End Date"
          />
        </div>

        <div className="col-md-1 mb-2">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("");
              setFilterRole("");
              setStartDate(null);
              setEndDate(null);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <p className="text-muted mt-2 text-end">
        Showing {filteredUsers.length} user
        {filteredUsers.length !== 1 ? "s" : ""} matching filters
      </p>

      <div className="row">
        {/* Total Users */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-users text-primary"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Total Users</p>
                    <h4 className="card-title">{filteredUsers.length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div
                className="stats"
                onClick={fetchUsersAndRoles}
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-sync-alt mr-1"></i> Update Now
              </div>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-user text-success"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Active Users</p>
                    {/* <h4 className="card-title">{users.filter(user => user.status === "active").length}</h4> */}
                    <h4 className="card-title">
                      {
                        filteredUsers.filter((user) => user.status === "active")
                          .length
                      }
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div
                className="stats"
                onClick={fetchUsersAndRoles}
                style={{ cursor: "pointer" }}
              >
                <i className="far fa-calendar-alt mr-1"></i> Last day
              </div>
            </div>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-user text-secondary"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Inactive Users</p>
                    {/* <h4 className="card-title">{users.filter(user => user.status === "inactive").length}</h4> */}
                    <h4 className="card-title">
                      {
                        filteredUsers.filter(
                          (user) => user.status === "inactive"
                        ).length
                      }
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div
                className="stats"
                onClick={fetchUsersAndRoles}
                style={{ cursor: "pointer" }}
              >
                <i className="far fa-clock mr-1"></i> In the last hour
              </div>
            </div>
          </div>
        </div>

        {/* Role Breakdown */}
        {["superadmin", "admin", "user"].map((roleKey) => (
  <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={roleKey}>
    <div className="card-stats card">
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <div className="numbers">
              <p className="card-category">{roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}</p>
              <h4 className="card-title">
                {
                  filteredUsers.filter((user) => getRoleName(user.roleId) === roleKey).length
                }
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <hr />
        <div className="stats" onClick={fetchUsersAndRoles} style={{ cursor: "pointer" }}>
          <i className="fas fa-sync-alt mr-1"></i> Update now
        </div>
      </div>
    </div>
  </div>
))}

      </div>

      {/* Chart */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              {/* <RoleChart users={users} roles={roles} /> */}
              <RoleChart users={filteredUsers} roles={roles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
