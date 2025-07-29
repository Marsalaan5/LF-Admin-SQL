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



import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const {token} = useContext(AuthContext)

  useEffect(() => {
    axios
      .get('http://localhost:5001/auth/notifications',{
        headers: {Authorization : `Bearer ${token}`}
      })
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications. Please try again later.'); // Set error message
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" variant="primary" />
        <p>Loading notifications...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center" style={{ marginTop: '50px' }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="border shadow-sm" style={{ marginTop: "100px", width: "98%" }}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h3>Notification</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Notification</li>
            </ol>
          </nav>
        </div>
      </div>
      <h1 className="text-center">Notifications</h1>
      {notifications.length === 0 ? (
        <Row>
          <Col className="text-center">
            <p>No notifications available.</p>
          </Col>
        </Row>
      ) : (
        <Row>
          {notifications.map((notification) => (
            <Col key={notification.id} xs={12} md={6} lg={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{notification.title}</Card.Title>
                  <Card.Text>{notification.message}</Card.Text>
                  <small className="text-muted">
                    {new Date(notification.created_at).toLocaleString()}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Notification;
