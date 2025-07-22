import axios from "axios";
import RoleChart from "../pages/RoleChart.jsx";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import ComplaintCharts from '../pages/ComplaintCharts.jsx';
// import 'react-datepicker/dist/react-datepicker.css';

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import ChatBotFlow from "../chatbot/ChatBotFlow.jsx";

function Dashboard() {
  const { token } = useContext(AuthContext);
  console.log("Dashboard token:", token);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [complaints, setComplaints] = useState([]);


  const socket = useRef(null);


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

  const fetchComplaints = async () => {
  try {
    const res = await axios.get("http://localhost:5001/auth/complaints", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComplaints(res.data);
  } catch (err) {
    console.error("Failed to fetch complaints", err);
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
     fetchComplaints();
  }, [token]);

  // Function to get role name by roleId
  // const getRoleName = (roleId) => {
  //   if (!roles || roles.length === 0) {
  //     console.warn("Roles are not loaded yet.");
  //     return "unknown";
  //   }

  //   console.log("Roles:", roles);
  //   console.log("Searching for Role ID:", roleId);

  //   const role = roles.find((r) => String(r.id) === String(roleId));

  //   if (!role) {
  //     console.warn(`Role not found for ID: ${roleId}`);
  //   }

  //   console.log(`Role matched for ID ${roleId}: ${role ? role.name : "unknown"}`);
  //   return role ? role.name : "unknown";
  // };

  const roleMap = useMemo(() => {
    const map = {};
    if (Array.isArray(roles)) {
      roles.forEach((role) => {
        map[role.id] = role.name;
      });
    }
    return map;
  }, [roles]);

  console.log("All roles:", roles);

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const nameOrEmailMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filterStatus ? user.status === filterStatus : true;

    // const roleName = getRoleName(user.roleId);
    const roleName = roleMap[user.roleId] || "unknown";
    // const roleMatch = filterRole ? roleName === filterRole : true;
    const roleMatch = filterRole ? user.roleId === parseInt(filterRole) : true;

    const userDate = new Date(user.createdAt);
    const dateMatch =
      (!startDate || userDate >= startDate) &&
      (!endDate || userDate <= endDate);

    return nameOrEmailMatch && statusMatch && roleMatch && dateMatch;
  });

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(users.map((user) => user.status));
    return Array.from(statuses);
  }, [users]);

  const activeCount = useMemo(
    () => filteredUsers.filter((u) => u.status === "active").length,
    [filteredUsers]
  );

  const inactiveCount = useMemo(
    () => filteredUsers.filter((u) => u.status === "inactive").length,
    [filteredUsers]
  );

  return (
    <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div className="col-sm-6">
          <h3>Dashboard</h3>
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

      {/* Filter Section */}
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

        {/* <div className="col-md-2 mb-2">
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
  {roles?.map((role) => (
  <option key={role.id} value={role.id}>
    {role.name}
  </option>

))}

</select>

        </div> */}

        <div className="col-md-2 mb-2">
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <select
            className="form-control"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
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

      {/* User Statistics */}
      <div className="row ">
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
                    <h4 className="card-title">
                      {/* {
                        filteredUsers.filter((user) => user.status === "active")
                          .length
                      } */}
                      {activeCount}
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
                    <h4 className="card-title">
                      {/* {
                        filteredUsers.filter(
                          (user) => user.status === "inactive"
                        ).length
                      } */}
                      {inactiveCount}
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

         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    {/* <i className="fas fa-users text-primary"></i> */}
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Total Complaints</p>
                    <h4 className="card-title">{complaints.length}</h4>
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

        {/* Role Breakdown */}
        {/* {["Super Admin", "Admin", "User"].map((roleKey) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={roleKey}>
            <div className="card-stats card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="numbers">
                      <p className="card-category">
                        {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
                      </p>
                      <h4 className="card-title">
                        {
                          filteredUsers.filter(
                            (user) => getRoleName(user.roleId) === roleKey
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
                  <i className="fas fa-sync-alt mr-1"></i> Update now
                </div>
              </div>
            </div>
          </div>
        ))} */}
        {roles?.map((role) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={role.id}>
            <div className="card-stats card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="numbers">
                      <p className="card-category">{role.name}</p>
                      <h4 className="card-title">
                        {
                          filteredUsers.filter(
                            (user) => user.roleId === role.id
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
                  <i className="fas fa-sync-alt mr-1"></i> Update now
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      
{/* Charts Row */}
<div className="row">
  <div className="col-md-4 mb-6">
    <div className="card shadow-sm">
      <div className="card-header bg-white fw-bold">Role Distribution</div>
      <div className="card-body">
        <RoleChart users={filteredUsers} roles={roles} />
      </div>
    </div>
  </div>

  <div className="col-md-8 mb-4">
    <div className="card shadow-sm">
      <div className="card-header bg-white fw-bold">Complaint Analytics</div>
      <div className="card-body">
        <ComplaintCharts />
      </div>
    </div>
  </div>
</div>


{/* <ChatBotFlow /> */}
      
    </div>

  );
}

export default Dashboard;
