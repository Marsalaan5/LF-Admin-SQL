

import axios from "axios";
import RoleChart from "../pages/RoleChart.jsx";
import { useState,useEffect,useContext,useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client"
import toast from 'react-hot-toast'

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket =  useRef(null);

  // Fetch Users and Roles from backend
  const fetchUsersAndRoles = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:5001/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rolesResponse = await axios.get("http://localhost:5001/auth/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(usersResponse.data.users);
      setRoles(rolesResponse.data.roles);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users or roles:", err);
      setLoading(false);
    }
  };

  useEffect(()=>{
    socket.current = io ("http://localhost:5001")
    socket.current.on("connect",()=>{
      console.log("Connected to socket:",socket.current.id)
    })

    socket.current.on("new-signup",(user)=>{
      console.log("New user received:",user)
      toast.success(`New user signed up:${user.name}`)
    })

return () => {
  socket.current.disconnect()
  console.log("Socket disconnected")
}
  },[])



  useEffect(() => {
    fetchUsersAndRoles();
  }, [token]);

  // Function to get role name from roleId
  // const getRoleName = (roleId) => {
  //   if (!roles || roles.length === 0) return "unknown";
  //   const role = roles.find((r) => r.id === roleId);
  //   return role ? role.title.toLowerCase() : "unknown";
  // };

  const getRoleName = (roleValue) => {
  if (!roles || roles.length === 0) return "unknown";
  const role = roles.find((r) => r.id === roleValue || r.name === roleValue);
  return role ? role.name.toLowerCase() : "unknown";
};

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

  return (
    <div className="container-fluid mt-5" style={{ paddingTop: "70px" }}>
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
                    <h4 className="card-title">{users.length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats" onClick={fetchUsersAndRoles} style={{ cursor: "pointer" }}>
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
                    <h4 className="card-title">{users.filter(user => user.status === "active").length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats" onClick={fetchUsersAndRoles} style={{ cursor: "pointer" }}>
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
                    <h4 className="card-title">{users.filter(user => user.status === "inactive").length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats" onClick={fetchUsersAndRoles} style={{ cursor: "pointer" }}>
                <i className="far fa-clock mr-1"></i> In the last hour
              </div>
            </div>
          </div>
        </div>

        {/* Role Breakdown */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="numbers">
                    <p className="card-category">Super Admin</p>
                    <h4 className="card-title">
                      {users.filter(user => getRoleName(user.roleId) === "superadmin").length}
                    </h4>
                    <p className="card-category">Admin</p>
                    <h4 className="card-title">
                      {users.filter(user => getRoleName(user.roleId) === "admin").length}
                    </h4>
                    <p className="card-category">Users</p>
                    <h4 className="card-title">
                      {users.filter(user => getRoleName(user.roleId) === "user").length}
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
      </div>

      {/* Chart */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card-stats card">
            <div className="card-body">
              <RoleChart users={users} roles={roles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
