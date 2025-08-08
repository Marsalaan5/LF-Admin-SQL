import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";

const typeIcons = {
  "Complaint Assigned": { icon: "fa-user-check", color: "#17a2b8" },
  "Complaint Status Update": { icon: "fa-sync-alt", color: "#ffc107" },
  info: { icon: "fa-info-circle", color: "#007bff" },
  error: { icon: "fa-exclamation-triangle", color: "red" },
  default: { icon: "fa-bell", color: "#6c757d" },
};

function Notification() {
  const { token,hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notificationsPerPage = 10;

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
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/auth/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updateReadStatus = (list) =>
        list.map((n) => (n.id === id ? { ...n, is_read: true } : n));

      setNotifications(updateReadStatus);
      setVisibleNotifications(updateReadStatus);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => markAsRead(n.id))
      );
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleViewMore = () => {
    const newCount = visibleNotifications.length + notificationsPerPage;
    setVisibleNotifications(notifications.slice(0, newCount));
  };

  const handleViewEntity = (notification) => {
    markAsRead(notification.id);
    if (notification.related_entity === 'complaint') {
      navigate('/complaints_management');
    }
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

  return (
    <Container fluid className="border shadow-sm bg-light" style={{ width: '98%', borderRadius: '10px',marginTop:"100px" }}>
   
       <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
              <div>
                <h3>Notifications</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb small">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active">Notifications</li>
                  </ol>
                </nav>
              </div>
             <Button variant="outline-secondary" size="sm" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
            </div>

      {notifications.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="fas fa-info-circle me-2"></i>
          You have no notifications.
        </Alert>
      )}

      <div className="d-flex flex-column align-items-center">
        {visibleNotifications.map((notification) => {
          const { icon, color } = typeIcons[notification.type] || typeIcons.default;

          return (
            <Card
              key={notification.id}
              className={`mb-4 shadow-sm border-0 rounded-lg w-100 ${!notification.is_read ? 'bg-light border-start border-primary border-4' : 'opacity-75'}`}
              style={{ maxWidth: '600px' }}
            >
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center">
                    <i className={`fas ${icon} me-3`} style={{ fontSize: '24px', color }}></i>
                    <Card.Title className="mb-0 text-capitalize">
                      {notification.type.replace(/_/g, ' ')}
                    </Card.Title>
                  </div>
                  {!notification.is_read && (
                    <span className="badge bg-primary">New</span>
                  )}
                </div>
                <Card.Text>{notification.message}</Card.Text>
                <small className="text-muted">
                  {new Date(notification.created_at).toLocaleString()}
                </small>

                {notification.related_entity === 'complaint' && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleViewEntity(notification)}
                    >
                      View Complaint
                    </Button>
                  </div>
                )}
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
