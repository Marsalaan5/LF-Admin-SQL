// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';

// function Notification() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     axios
//       .get('http://localhost:5001/auth/notifications')
//       .then((response) => {
//         setNotifications(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching notifications:', error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <Container className="text-center" style={{ marginTop: '50px' }}>
//         <Spinner animation="border" variant="primary" />
//         <p>Loading notifications...</p>
//       </Container>
//     );
//   }

//   return (
//       <Container fluid className="border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//           <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//             <div>
//               <h3>Notification</h3>
//               <nav aria-label="breadcrumb">
//                 <ol className="breadcrumb small">
//                   <li className="breadcrumb-item"><a href="/">Home</a></li>
//                   <li className="breadcrumb-item active">Notification</li>
//                 </ol>
//               </nav>
//             </div>
//             </div>
//       <h1 className="text-center">Notifications</h1>
//       {notifications.length === 0 ? (
//         <Row>
//           <Col className="text-center">
//             <p>No notifications available.</p>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           {notifications.map((notification) => (
//             <Col key={notification.id} xs={12} md={6} lg={4}>
//               <Card className="mb-4">
//                 <Card.Body>
//                   <Card.Title>{notification.title}</Card.Title>
//                   <Card.Text>{notification.message}</Card.Text>
//                   <small className="text-muted">
//                     {new Date(notification.created_at).toLocaleString()}
//                   </small>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// }

// export default Notification;



// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
// import { AuthContext } from '../context/AuthContext';

// function Notification() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Added error state
//   const {token} = useContext(AuthContext)

//   useEffect(() => {
//     axios
//       .get('http://localhost:5001/auth/notifications',{
//         headers: {Authorization : `Bearer ${token}`}
//       })
//       .then((response) => {
//         setNotifications(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching notifications:', error);
//         setError('Failed to load notifications. Please try again later.'); // Set error message
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <Container className="text-center" style={{ marginTop: '50px' }}>
//         <Spinner animation="border" variant="primary" />
//         <p>Loading notifications...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="text-center" style={{ marginTop: '50px' }}>
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div>
//           <h3>Notification</h3>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb small">
//               <li className="breadcrumb-item"><a href="/">Home</a></li>
//               <li className="breadcrumb-item active">Notification</li>
//             </ol>
//           </nav>
//         </div>
//       </div>
//       <h1 className="text-center">Notifications</h1>
//       {notifications.length === 0 ? (
//         <Row>
//           <Col className="text-center">
//             <p>No notifications available.</p>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           {notifications.map((notification) => (
//             <Col key={notification.id} xs={12} md={6} lg={4}>
//               <Card className="mb-4">
//                 <Card.Body>
//                   <Card.Title>{notification.title}</Card.Title>
//                   <Card.Text>{notification.message}</Card.Text>
//                   <small className="text-muted">
//                     {new Date(notification.created_at).toLocaleString()}
//                   </small>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// }

// export default Notification;



// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
// import { AuthContext } from '../context/AuthContext';
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function Notification() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//     const [notificationsPerPage, setNotificationsPerPage] = useState(10);
//   const { token } = useContext(AuthContext);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5001/auth/notifications', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setNotifications(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching notifications:', error);
//         setError('Failed to load notifications. Please try again later.'); // Set error message
//         setLoading(false);
//       });
//   }, [token]);


//  const filteredNotifications =
//     activeStatus === "total"
//       ? visibleNotifications
//       : visibleNotifications.filter(
//           (c) => c.status.toLowerCase() === activeStatus
//         );

//   const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);


//   const currentComplaint = filteredNotifications.slice(
//     (page - 1) * notificationsPerPage,
//     page * notificationsPerPage
//   );



//   // Loading Spinner
//   if (loading) {
//     return (
//       <Container className="text-center" style={{ marginTop: '50px' }}>
//         <Spinner animation="grow" variant="primary" />
//         <p className="mt-3">Loading notifications...</p>
//       </Container>
//     );
//   }

  
//   if (error) {
//     return (
//       <Container className="text-center" style={{ marginTop: '50px' }}>
//         <Alert variant="danger">
//           <i className="fas fa-exclamation-triangle mr-2"></i>
//           {error}
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="border shadow-lg" style={{ marginTop: '100px', width: '98%', borderRadius: '10px' }}>
//       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div>
//           <h3>Notifications</h3>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb small">
//               <li className="breadcrumb-item"><a href="/">Home</a></li>
//               <li className="breadcrumb-item active">Notifications</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2 px-2">
//         <div>
//           <span className="text-muted small">
//             Showing{" "}
//             <strong>
//               {currentNotification.length === 0
//                 ? 0
//                 : (page - 1) * notificationsPerPage + 1}
//             </strong>{" "}
//             to{" "}
//             <strong>
//               {(page - 1) * notificationsPerPage + currentNotification.length}
//             </strong>{" "}
//             of <strong>{filteredNotification.length}</strong> notifications
//           </span>
//         </div>

//         <div className="d-flex align-items-center">
//           <label className="me-2 mb-0 small fw-medium text-nowrap">
//             Rows per page:
//           </label>
//           <select
//             className="form-select form-select-sm"
//             style={{ width: "100px" }}
//             value={notificationsPerPage}
//             onChange={(e) => {
//               setPage(1); // Reset to page 1 when rows per page changes
//               setNotificationsPerPage(Number(e.target.value));
//             }}
//           >
//             {[10, 20, 50, 100].map((n) => (
//               <option key={n} value={n}>
//                 {n}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* No Notifications State */}
//       {notifications.length === 0 ? (
//         <Row>
//           <Col className="text-center">
//             <i className="fas fa-bell" style={{ fontSize: '50px', color: '#6c757d' }}  />
//             <p>No notifications available.</p>
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           {notifications.map((notification) => {
            
//             let iconClass = 'fa-check-circle';
//             let iconColor = '#28a745'; 

//             if (notification.type === 'error') {
//               iconClass = 'fa-exclamation-triangle';
//               iconColor = 'red'; // red for errors
//             } else if (notification.type === 'info') {
//               iconClass = 'fa-info-circle';
//               iconColor = '#007bff';
//             }

//             return (
//               <Col key={notification.id} xs={12} md={6} lg={4}>
//                 <Card className="mb-4 shadow-sm border-0 rounded-lg">
//                   <Card.Body>
//                     <div className="d-flex align-items-center">
//                       <i
//                         className={`mb-3 fas ${iconClass}`}
//                         style={{ fontSize: '30px', color: iconColor }}
                      
//                       />
//                       <Card.Title>{notification.title}</Card.Title>
//                     </div>
//                     <Card.Text>{notification.message}</Card.Text>
//                     <small className="text-muted">
//                       {new Date(notification.created_at).toLocaleString()}
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       )}
//     </Container>
//   );
// }

// export default Notification;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import "@fortawesome/fontawesome-free/css/all.min.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationsPerPage] = useState(10);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5001/auth/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sorted = [...response.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(sorted);
        setVisibleNotifications(sorted.slice(0, notificationsPerPage));
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, notificationsPerPage]);

  const handleViewMore = () => {
    const newCount = visibleNotifications.length + notificationsPerPage;
    setVisibleNotifications(notifications.slice(0, newCount));
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="grow" variant="primary" />
        <p className="mt-3">Loading notifications...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  const typeIcons = {
    "Complaint Assigned": { icon: "fa-user-check", color: "#17a2b8" },
    "Complaint Status Update": { icon: "fa-sync-alt", color: "#ffc107" },
    "info": { icon: "fa-info-circle", color: "#007bff" },
    "error": { icon: "fa-exclamation-triangle", color: "red" },
  };

  return (
    <Container fluid className="border shadow-lg mt-5" style={{ width: '98%', borderRadius: '10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 px-3">
        <div>
          <h3>Notifications</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Notifications</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        {visibleNotifications.map((notification) => {
          const { icon, color } = typeIcons[notification.type] || typeIcons.info;

          return (
            <Card key={notification.id} className="mb-4 shadow-sm border-0 rounded-lg" style={{ width: '100%', maxWidth: '600px' }}>
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <i className={`fas ${icon} me-3`} style={{ fontSize: '24px', color }}></i>
                  <Card.Title className="mb-0 text-capitalize">
                    {notification.type.replace(/_/g, ' ')}
                  </Card.Title>
                </div>
                <Card.Text>{notification.message}</Card.Text>
                <small className="text-muted">
                  {new Date(notification.created_at).toLocaleString()}
                </small>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {visibleNotifications.length < notifications.length && (
        <div className="d-flex justify-content-center mt-4 mb-5">
          <Button variant="primary" onClick={handleViewMore}>
            View More
          </Button>
        </div>
      )}
    </Container>
  );
}

export default Notification;
