// import axios from "axios";
// import RoleChart from "../pages/RoleChart.jsx";
// import { useState, useEffect, useContext, useRef, useMemo } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { io } from "socket.io-client";
// import toast from "react-hot-toast";
// import ComplaintCharts from '../pages/ComplaintCharts.jsx';
// // import 'react-datepicker/dist/react-datepicker.css';

// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// // import ChatBotFlow from "../chatbot/ChatBotFlow.jsx";

// function Dashboard() {
//   const { token,user } = useContext(AuthContext);
//   console.log("Dashboard token:", token);
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterRole, setFilterRole] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [complaints, setComplaints] = useState([]);


//   const socket = useRef(null);


//   const location = useLocation();
//   const pathnames = location.pathname.split("/").filter((x) => x);

//   // Fetch Users and Roles from backend
//   const fetchUsersAndRoles = async () => {
//     try {
//       const usersResponse = await axios.get(
//         "http://localhost:5001/auth/users",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const rolesResponse = await axios.get(
//         "http://localhost:5001/auth/roles",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setUsers(usersResponse.data.users);
//       setRoles(rolesResponse.data.roles);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch users or roles:", err);
//       setLoading(false);
//     }
//   };

//   const fetchComplaints = async () => {
//   try {
//     const res = await axios.get("http://localhost:5001/auth/complaints", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setComplaints(res.data);
//   } catch (err) {
//     console.error("Failed to fetch complaints", err);
//   }
// };


//   useEffect(() => {
//     socket.current = io("http://localhost:5001");
//     socket.current.on("connect", () => {
//       console.log("Connected to socket:", socket.current.id);
//     });

//     socket.current.on("new-signup", (user) => {
//       console.log("New user received:", user);
//       toast.success(`New user signed up:${user.name}`);
//     });

//     return () => {
//       socket.current.disconnect();
//       console.log("Socket disconnected");
//     };
//   }, []);

//   useEffect(() => {
//     fetchUsersAndRoles();
//      fetchComplaints();
//   }, [token]);

//   // Function to get role name by roleId
//   // const getRoleName = (roleId) => {
//   //   if (!roles || roles.length === 0) {
//   //     console.warn("Roles are not loaded yet.");
//   //     return "unknown";
//   //   }

//   //   console.log("Roles:", roles);
//   //   console.log("Searching for Role ID:", roleId);

//   //   const role = roles.find((r) => String(r.id) === String(roleId));

//   //   if (!role) {
//   //     console.warn(`Role not found for ID: ${roleId}`);
//   //   }

//   //   console.log(`Role matched for ID ${roleId}: ${role ? role.name : "unknown"}`);
//   //   return role ? role.name : "unknown";
//   // };

//   const roleMap = useMemo(() => {
//     const map = {};
//     if (Array.isArray(roles)) {
//       roles.forEach((role) => {
//         map[role.id] = role.name;
//       });
//     }
//     return map;
//   }, [roles]);

//   console.log("All roles:", roles);

//   // Filter logic
//   const filteredUsers = users.filter((user) => {
//     const nameOrEmailMatch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());

//     const statusMatch = filterStatus ? user.status === filterStatus : true;

//     // const roleName = getRoleName(user.roleId);
//     const roleName = roleMap[user.roleId] || "unknown";
//     // const roleMatch = filterRole ? roleName === filterRole : true;
//     const roleMatch = filterRole ? user.roleId === parseInt(filterRole) : true;

//     const userDate = new Date(user.createdAt);
//     const dateMatch =
//       (!startDate || userDate >= startDate) &&
//       (!endDate || userDate <= endDate);

//     return nameOrEmailMatch && statusMatch && roleMatch && dateMatch;
//   });

//   const uniqueStatuses = useMemo(() => {
//     const statuses = new Set(users.map((user) => user.status));
//     return Array.from(statuses);
//   }, [users]);

//   const activeCount = useMemo(
//     () => filteredUsers.filter((u) => u.status === "active").length,
//     [filteredUsers]
//   );

//   const inactiveCount = useMemo(
//     () => filteredUsers.filter((u) => u.status === "inactive").length,
//     [filteredUsers]
//   );

//   return (
//     <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%",borderRadius: '10px' }}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div className="col-sm-6">
//           <h3>Dashboard</h3>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active">Dashboard</li>
//             </ol>
//           </div>
//         </div>
//       </div>

//               {user && (
//   <div className="alert alert-info">
//     Welcome, <strong>{user.name}</strong>!{" "}
//     <strong>{roleMap[user.roleId]}</strong>.
//   </div>
// )}

//       {/* Filter Section */}
//       <div className="row mb-4">
//         <div className="col-md-3 mb-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by name or email"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* <div className="col-md-2 mb-2">
//           <select
//             className="form-control"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         <div className="col-md-2 mb-2">
//         <select
//   className="form-control"
//   value={filterRole}
//   onChange={(e) => setFilterRole(e.target.value)}
// >
//   <option value="">All Roles</option>
//   {roles?.map((role) => (
//   <option key={role.id} value={role.id}>
//     {role.name}
//   </option>

// ))}

// </select>

//         </div> */}




//         <div className="col-md-2 mb-2">
//           <select
//             className="form-control"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="">All Status</option>
//             {uniqueStatuses.map((status) => (
//               <option key={status} value={status}>
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-2 mb-2">
//           <select
//             className="form-control"
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//           >
//             <option value="">All Roles</option>
//             {roles?.map((role) => (
//               <option key={role.id} value={role.id}>
//                 {role.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-2 mb-2">
//           <ReactDatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="form-control"
//             placeholderText="Start Date"
//           />
//         </div>

//         <div className="col-md-2 mb-2">
//           <ReactDatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             className="form-control"
//             placeholderText="End Date"
//           />
//         </div>

//         <div className="col-md-1 mb-2">
//           <button
//             className="btn btn-secondary w-100"
//             onClick={() => {
//               setSearchTerm("");
//               setFilterStatus("");
//               setFilterRole("");
//               setStartDate(null);
//               setEndDate(null);
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       <p className="text-muted mt-2 text-end">
//         Showing {filteredUsers.length} user
//         {filteredUsers.length !== 1 ? "s" : ""} matching filters
//       </p>

//       {/* User Statistics */}
//       <div className="row ">
//         {/* Total Users */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
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
//                     <p className="card-category">Total Users</p>
//                     <h4 className="card-title">{filteredUsers.length}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div
//                 className="stats"
//                 onClick={fetchUsersAndRoles}
//                 style={{ cursor: "pointer" }}
//               >
//                 <i className="fas fa-sync-alt mr-1"></i> Update Now
//               </div>
//             </div>
//           </div>
//         </div>
       

//         {/* Active Users */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-user text-success"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Active Users</p>
//                     <h4 className="card-title">
//                       {/* {
//                         filteredUsers.filter((user) => user.status === "active")
//                           .length
//                       } */}
//                       {activeCount}
//                     </h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div
//                 className="stats"
//                 onClick={fetchUsersAndRoles}
//                 style={{ cursor: "pointer" }}
//               >
//                 <i className="far fa-calendar-alt mr-1"></i> Last day
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Inactive Users */}
//         <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     <i className="fas fa-user text-secondary"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Inactive Users</p>
//                     <h4 className="card-title">
//                       {/* {
//                         filteredUsers.filter(
//                           (user) => user.status === "inactive"
//                         ).length
//                       } */}
//                       {inactiveCount}
//                     </h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div
//                 className="stats"
//                 onClick={fetchUsersAndRoles}
//                 style={{ cursor: "pointer" }}
//               >
//                 <i className="far fa-clock mr-1"></i> In the last hour
//               </div>
//             </div>
//           </div>
//         </div>

//          <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
//           <div className="card-stats card">
//             <div className="card-body">
//               <div className="row">
//                 <div className="col-5">
//                   <div className="icon-big text-center icon-warning">
//                     {/* <i className="fas fa-users text-primary"></i> */}
//                     <i className="fas fa-exclamation-circle"></i>
//                   </div>
//                 </div>
//                 <div className="col-7">
//                   <div className="numbers">
//                     <p className="card-category">Total Complaints</p>
//                     <h4 className="card-title">{complaints.length}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="card-footer">
//               <hr />
//               <div
//                 className="stats"
//                 onClick={fetchUsersAndRoles}
//                 style={{ cursor: "pointer" }}
//               >
//                 <i className="fas fa-sync-alt mr-1"></i> Update Now
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Role Breakdown */}
//         {/* {["Super Admin", "Admin", "User"].map((roleKey) => (
//           <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={roleKey}>
//             <div className="card-stats card">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-12">
//                     <div className="numbers">
//                       <p className="card-category">
//                         {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
//                       </p>
//                       <h4 className="card-title">
//                         {
//                           filteredUsers.filter(
//                             (user) => getRoleName(user.roleId) === roleKey
//                           ).length
//                         }
//                       </h4>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-footer">
//                 <hr />
//                 <div
//                   className="stats"
//                   onClick={fetchUsersAndRoles}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <i className="fas fa-sync-alt mr-1"></i> Update now
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))} */}
//         {roles?.map((role) => (
//           <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={role.id}>
//             <div className="card-stats card">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-12">
//                     <div className="numbers">
//                       <p className="card-category">{role.name}</p>
//                       <h4 className="card-title">
//                         {
//                           filteredUsers.filter(
//                             (user) => user.roleId === role.id
//                           ).length
//                         }
//                       </h4>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-footer">
//                 <hr />
//                 <div
//                   className="stats"
//                   onClick={fetchUsersAndRoles}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <i className="fas fa-sync-alt mr-1"></i> Update now
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chart */}
      
// {/* Charts Row */}
// <div className="row">
//   <div className="col-md-4 mb-6">
//     <div className="card shadow-sm">
//       <div className="card-header bg-white fw-bold">Role Distribution</div>
//       <div className="card-body">
//         <RoleChart users={filteredUsers} roles={roles} />
//       </div>
//     </div>
//   </div>

//   <div className="col-md-8 mb-4">
//     <div className="card shadow-sm">
//       <div className="card-header bg-white fw-bold">Complaint Analytics</div>
//       <div className="card-body">
//         <ComplaintCharts />
//       </div>
//     </div>
//   </div>
// </div>


// {/* <ChatBotFlow /> */}
      
//     </div>

//   );
// }

// export default Dashboard;




import axios from "axios";
import RoleChart from "../pages/RoleChart.jsx";
import ComplaintCharts from '../pages/ComplaintCharts.jsx';
import ReactDatePicker from "react-datepicker";
import { Container, Row, Col, Card, Form, Button, Breadcrumb, Alert } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";

import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faUserTimes,
  faClipboardList,
  // faCheckCircle,
  // faClock,
  // faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';




dayjs.extend(relativeTime);

function Dashboard() {
  const { token, user, permissions } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [activities, setActivities] = useState([]);

  const socket = useRef(null);
  const location = useLocation();



const fetchRecentActivities = async () => {
  try {
    const res = await axios.get("http://localhost:5001/auth/recent-activities", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setActivities(res.data);
  } catch (err) {
    console.error("Failed to fetch recent activities", err);
  }
};

useEffect(() => {
  if (token) {
    fetchRecentActivities();
  }
}, [token]);


  

  const fetchUsersAndRoles = async () => {
    try {
      const usersResponse = await axios.get(
        "http://localhost:5001/auth/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const rolesResponse = await axios.get(
        "http://localhost:5001/auth/roles",
        { headers: { Authorization: `Bearer ${token}` } }
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

    socket.current.on("new-signup", (newUser) => {
      toast.success(`New user signed up: ${newUser.name}`);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if(token) {
      fetchUsersAndRoles();
      fetchComplaints();
    }
  }, [token]);

  const roleMap = useMemo(() => {
    const map = {};
    if (Array.isArray(roles)) {
      roles.forEach((role) => {
        map[role.id] = role.name;
      });
    }
    return map;
  }, [roles]);

  const visibleUsers = useMemo(() => {
    if (!users) return [];

    if (user.role === "Super Admin" || user.role === "Admin") {
      return users;
    }

    return users.filter((u) => u.id === user.id);
  }, [users, user, permissions]);

  const visibleComplaints = useMemo(() => {
    if (!complaints) return [];

    if (user.role === "Super Admin" || user.role === "Admin") {
      return complaints;
    }

    return complaints.filter((c) => String(c.user_id) === String(user.id));
  }, [complaints, user, permissions]);

  const filteredUsers = visibleUsers.filter((userItem) => {
    const nameOrEmailMatch =
      userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filterStatus ? userItem.status === filterStatus : true;

    const roleMatch = filterRole ? userItem.roleId === parseInt(filterRole) : true;

    const userDate = new Date(userItem.createdAt);
    const dateMatch =
      (!startDate || userDate >= startDate) &&
      (!endDate || userDate <= endDate);

    return nameOrEmailMatch && statusMatch && roleMatch && dateMatch;
  });

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(visibleUsers.map((user) => user.status));
    return Array.from(statuses);
  }, [visibleUsers]);

  const activeCount = useMemo(
    () => filteredUsers.filter((u) => u.status === "active").length,
    [filteredUsers]
  );

  const inactiveCount = useMemo(
    () => filteredUsers.filter((u) => u.status === "inactive").length,
    [filteredUsers]
  );

  return (
    // <Container fluid className="shadow sm" style={{ maxWidth: "98%", borderRadius: '10px',marginTop:"100px"}}>
    //   <Row className="d-flex justify-content-between align-items-center mt-5 mb-3">
    //     <Col md={6}>
    //       <h3>Dashboard</h3>
    //     </Col>
    //     <Col md={6} className="text-md-end">
    //       <Breadcrumb>
    //         <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    //         <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
    //       </Breadcrumb>
    //     </Col>
    //   </Row>

     <Container fluid className="border shadow-sm bg-light" style={{marginTop:"100px", width:"98%",borderRadius: '10px' }}>
          {/* <div className="d-flex justify-content-between align-items-center mt-5 mb-3">

            <div>
              <h3>Dashboard</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb small">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </nav>
            </div>
          
          </div> */}
<div className="mt-5 mb-3">

      {user && (
        <Alert variant="info">
          Welcome, <strong>{user.name}</strong>! &nbsp;
          <strong>{roleMap[user.roleId]}</strong>.
        </Alert>
      )}
      </div>

      {/* Filters */}
      <Row className="mt-5 mb-4 g-2">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>

        <Col md={2}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <ReactDatePicker
            selected={startDate}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
            placeholderText="Start Date"
          />
        </Col>

        <Col md={2}>
          <ReactDatePicker
            selected={endDate}
            onChange={setEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="form-control"
            placeholderText="End Date"
          />
        </Col>

        <Col md={1}>
          <Button
            variant="secondary"
            className="w-100"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("");
              setFilterRole("");
              setStartDate(null);
              setEndDate(null);
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      <p className="text-muted text-end">
        Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} matching filters
      </p>

      <Row className="mb-4 g-3">

  <Col lg={3} md={4} sm={6}>
  <Card border="dark" className="shadow-sm h-100">
    <Card.Body className="text-start">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Card.Title className="mb-0" style={{fontSize:"14px"}}>Total Users</Card.Title>
        <FontAwesomeIcon icon={faUsers} size="lg" className="me-2 text-dark" />
      </div>
      <Card.Text className="h4 fw-bold text-dark">{filteredUsers.length}</Card.Text>
    </Card.Body>
  </Card>
</Col>


  <Col lg={3} md={4} sm={6}>
    <Card border="success" className="shadow-sm h-100">
      <Card.Body className="text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0" style={{fontSize:"14px"}}>Active Users</Card.Title>
          <FontAwesomeIcon icon={faUserCheck} size="lg" className="me-2 text-success" />
        </div>
        <Card.Text className="h4 fw-bold text-success">{activeCount}</Card.Text>
      </Card.Body>
    </Card>
  </Col>

  <Col lg={3} md={4} sm={6}>
    <Card border="danger" className="shadow-sm h-100">
      <Card.Body className="text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0" style={{fontSize:"14px"}}>Inactive Users</Card.Title>
          <FontAwesomeIcon icon={faUserTimes} size="lg" className="me-2 text-danger" />
        </div>
        <Card.Text className="h4 fw-bold text-danger">{inactiveCount}</Card.Text>
      </Card.Body>
    </Card>
  </Col>

    <Col lg={3} md={4} sm={6}>
    <Card border="dark" className="shadow-sm h-100">
      <Card.Body className="text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0" style={{fontSize:"14px"}}>Total Complaints</Card.Title>
          <FontAwesomeIcon icon={faClipboardList} size="lg" className="me-2 text-dark" />
        </div>
        <Card.Text className="h4 fw-bold text-dark">{visibleComplaints.length}</Card.Text>
      </Card.Body>
    </Card>
  </Col>

</Row>


      {/* Complaints Statistics */}
      {/* <Row className="mb-4 g-3">
        <Col lg={3} md={4} sm={6}>
          <Card border="primary" className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Total Complaints</Card.Title>
              <Card.Text className="display-5 fw-bold">{visibleComplaints.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={4} sm={6}>
          <Card border="success" className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Resolved Complaints</Card.Title>
              <Card.Text className="display-5 fw-bold">
                {visibleComplaints.filter(c => c.status === 'resolved').length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={4} sm={6}>
          <Card border="warning" className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Pending Complaints</Card.Title>
              <Card.Text className="display-5 fw-bold">
                {visibleComplaints.filter(c => c.status === 'pending').length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={4} sm={6}>
          <Card border="info" className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Open Complaints</Card.Title>
              <Card.Text className="display-5 fw-bold">
                {visibleComplaints.filter(c => c.status === 'open').length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
      {/* <Row className="mb-4 g-3"> */}

  {/* <Col lg={3} md={4} sm={6}>
    <Card border="success" className="shadow-sm h-100">
      <Card.Body className="text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">Resolved</Card.Title>
          <FontAwesomeIcon icon={faCheckCircle} size="lg" className="me-2 text-success" />
        </div>
        <Card.Text className="h4 fw-bold text-success">
          {visibleComplaints.filter(c => c.status === 'resolved').length}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col> */}

  {/* <Col lg={3} md={4} sm={6}>
    <Card border="warning" className="shadow-sm h-100">
      <Card.Body className="text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">Pending</Card.Title>
          <FontAwesomeIcon icon={faClock} size="lg" className="me-2 text-warning" />
        </div>
        <Card.Text className="h4 fw-bold text-warning">
          {visibleComplaints.filter(c => c.status === 'pending').length}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>

  <Col lg={3} md={4} sm={6}>
    <Card border="info" className="shadow-sm h-100">
      <Card.Body className="text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">Open</Card.Title>
          <FontAwesomeIcon icon={faFolderOpen} size="lg" className="me-2 text-info" />
        </div>
        <Card.Text className="h4 fw-bold text-info">
          {visibleComplaints.filter(c => c.status === 'open').length}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col> */}
{/* </Row> */}


      {/* Charts */}
      <Row>
        <Col lg={4} md={8} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>User Roles Distribution</Card.Title>
              <RoleChart users={filteredUsers} roles={roles} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} md={12} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Complaints Overview</Card.Title>
              <ComplaintCharts complaints={visibleComplaints} />
            </Card.Body>
          </Card>
        </Col>
      </Row>



{/* <Row className="mb-4">
  <Col md={12}>
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Recent Activities</Card.Title>
        <ul className="list-unstyled mb-0">
          {activities.length === 0 && (
            <li className="text-muted">No recent activity found.</li>
          )}
          {activities.map((activity) => (
            <li key={activity.id} className="mb-2">
              <div className="d-flex justify-content-between">
                <span>{activity.message}</span>
                <small className="text-muted">
                  {dayjs(activity.createdAt).isValid()
                    ? dayjs(activity.createdAt).format('YYYY-MM-DD HH:mm:ss')
                    : 'Invalid date'}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  </Col>
</Row> */}

<Row className="mb-4">
  <Col md={12}>
    <Card className="shadow-sm border-0">
      <Card.Body>
        <Card.Title className="mb-3">Recent Activities</Card.Title>
        <ul className="list-unstyled mb-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {activities.length === 0 ? (
            <li className="text-muted text-center py-3">No recent activity found.</li>
          ) : (
            activities.map((activity) => {
              let iconClass = 'fas fa-info-circle text-info'; // default icon
              if (activity.type === 'success') iconClass = 'fas fa-check-circle text-success';
              else if (activity.type === 'warning') iconClass = 'fas fa-exclamation-circle text-warning';
              else if (activity.type === 'error') iconClass = 'fas fa-times-circle text-danger';

              return (
                <li key={activity.id} className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className={`${iconClass} me-2 mt-1`} style={{ fontSize: '1.1rem' }}></i>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span>{activity.message}</span>
                        <small className="text-muted">
                          {dayjs(activity.createdAt).isValid()
                            ? dayjs(activity.createdAt).fromNow()
                            : 'Invalid date'}
                            
                        </small>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </Card.Body>
    </Card>
  </Col>
</Row>


    </Container>
  );
}

export default Dashboard;
