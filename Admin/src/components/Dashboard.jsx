// import React from 'react';

// function Dashboard() {
//   return (
//     <div className='container-fluid container mt-5'>
//       <div className="row">
//         <div className="col-lg-3 col-md-4 col-sm-6">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-hdd text-warning"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Number</p>
//                     <h4 className="card-title">150GB</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="fas fa-sync-alt mr-1"></i>Update Now
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-sm-6">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-dollar-sign text-success"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Revenue</p>
//                     <h4 className="card-title">$1,345</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="far fa-calendar-alt mr-1"></i>Last day
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-sm-6">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-exclamation-triangle text-danger"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Errors</p>
//                     <h4 className="card-title">23</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="far fa-clock mr-1"></i>In the last hour
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-3 col-sm-6">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-users text-primary"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Followers</p>
//                     <h4 className="card-title">+45K</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="fas fa-sync-alt mr-1"></i>Update now
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useState,useEffect} from "react";
// import axios from "axios";
// import RoleChart from '../pages/RoleChart.jsx' ;

// function Dashboard() {

// const { token, user } = useContext(AuthContext);
//   const[users,setUsers] = useState();



//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users);
//       console.log("Fetched users:", res.data.users);
//     } catch (err) {
//       console.error("Failed to load users", err);
//       // setMessage("Error loading users.");
//     }
//   };

//   useEffect(() => {
//     fetchUsers(); // Fetch users when the component mounts
//   }, [token]); // Dependency array ensures this runs when token changes



//   return (
//     <div className="container-fluid mt-5" style={{ paddingTop: "60px" }}>
//       <div className="row">
//         {/* Storage Card */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-hdd text-warning"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Total Users</p>
//                     <h4 className="card-title">?</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="fas fa-sync-alt mr-1"></i> Update Now
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Revenue Card */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-dollar-sign text-success"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Active Users</p>
//                     <h4 className="card-title">?</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="far fa-calendar-alt mr-1"></i> Last day
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Errors Card */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-exclamation-triangle text-danger"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Inactive Users</p>
//                     <h4 className="card-title">23</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="far fa-clock mr-1"></i> In the last hour
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Followers Card */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-users text-primary"></i>
//                   </div>
//                 </div>
//                 <div className="col-4">
//                   <div className="numbers">
//                     <p className="card-category">Admin</p>
//                     <h4 className="card-title"> ? ?</h4>
//                   </div>
//                 </div>
//                 <div className="col-3">
//                   <div className="numbers">
//                     <p className="card-category">Users</p>
//                     <h4 className="card-title"> ? ?</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div className="stats">
//                 <i className="fas fa-sync-alt mr-1"></i> Update now
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-8 mb-4 border">
//             <div className="card-stats card">
//               <div className="card-body">
//               <RoleChart users={users} />
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4 mb-4 border">
//             <div className="card-stats card">
//               <div className="card-body">
//                 <div className="row"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import RoleChart from '../pages/RoleChart.jsx'; // Import the RoleChart component
import { AuthContext } from "../context/AuthContext"; // Assuming AuthContext is defined in your project

function Dashboard() {
  const { token, user } = useContext(AuthContext); // Get token and user from AuthContext
  const [users, setUsers] = useState([]); // Default empty array for users
  const [loading, setLoading] = useState(true); // Loading state to manage async data fetching

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users); // Store fetched users in state
      setLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      console.error("Failed to load users", err);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, [token]); // Dependency array ensures this runs when token changes

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
