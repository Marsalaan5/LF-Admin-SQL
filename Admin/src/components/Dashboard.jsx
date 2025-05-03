
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import RoleChart from '../pages/RoleChart.jsx'; 
import { AuthContext } from "../context/AuthContext"; 

function Dashboard() {
  const { token, user } = useContext(AuthContext); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users); 
      setLoading(false); 
    } catch (err) {
      console.error("Failed to load users", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]); 

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
        {/* Storage Card */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card" >
            {/* style={{
    background: 'linear-gradient(to right,rgb(255, 95, 162),rgb(211, 105, 158))',
    borderRadius: '10px',
    padding: '20px',
    color: 'white',
  }}> */}
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                
                    <i className="fas fa-users text-primary "></i>

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
              <div className="stats" onClick={fetchUsers}  style={{ cursor: 'pointer' }}>
                <i className="fas fa-sync-alt mr-1"></i> Update Now
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card" >
            {/* style={{
    background: 'linear-gradient(to right,rgb(95, 196, 255),rgb(123, 164, 254))',
    borderRadius: '10px',
    padding: '20px',
    color: 'white',
  }}> */}
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    {/* <i className="fas fa-dollar-sign text-success"></i> */}
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
              <div className="stats" onClick={fetchUsers}style={{ cursor: 'pointer' }}>
                <i className="far fa-calendar-alt mr-1"></i> Last day
              </div>
            </div>
          </div>
        </div>

        {/* Errors Card */}
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card">
             {/* style={{
    background: 'linear-gradient(to right,rgb(59, 212, 28),rgb(34, 187, 116))',
    borderRadius: '10px',
    padding: '20px',
    color: 'white',
  }}> */}
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    {/* <i className="fas fa-exclamation-triangle text-danger"></i> */}
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
              <div className="stats" onClick={fetchUsers} style={{ cursor: 'pointer' }}>
                <i className="far fa-clock mr-1"></i> In the last hour
              </div>
            </div>
          </div>
        </div>

      
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card-stats card" >
            {/* style={{
    background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
    borderRadius: '10px',
    padding: '20px',
    color: 'white',
  }}> */}
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-user text-primary"></i>
                  </div>
                </div>
                <div className="col-4">
                  <div className="numbers">
                    <p className="card-category">Admin</p>
                    <h4 className="card-title">{users.filter(user => user.role === "admin").length}</h4>
                  </div>
                </div>
                <div className="col-3">
                  <div className="numbers">
                    <p className="card-category">Users</p>
                    <h4 className="card-title">{users.filter(user => user.role === "user").length}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats" onClick={fetchUsers} style={{ cursor: 'pointer' }}>
                <i className="fas fa-sync-alt mr-1"></i> Update now
              </div>
            </div>
          </div>
        </div>

          
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card-stats card"> 
          {/* style={{
    background: 'linear-gradient(to right,rgb(239, 255, 95),rgb(134, 254, 123))',
    borderRadius: '10px',
    // padding: '20px',
    color: 'white',
  }}> */}
            <div className="card-body">
         
              <RoleChart users={users} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
