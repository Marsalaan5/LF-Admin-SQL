// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext"; // Import your AuthContext

// function RolesManagement() {
//   const { token } = useContext(AuthContext); // Get token from context
//   const [roles, setRoles] = useState([]);
//   const [name, setName] = useState("");
//   const [permissions, setPermissions] = useState({});
//   const [editId, setEditId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modules, setModules] = useState({});

//   useEffect(() => {
//     fetchRoles();
//     fetchModules();
//   }, []);

//   // Fetch roles data
//   const fetchRoles = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/roles", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include token in headers
//         },
//       });
//       const parsed = res.data.map((role) => ({
//         ...role,
//         permissions:
//           typeof role.permissions === "string"
//             ? JSON.parse(role.permissions || "{}")
//             : role.permissions || {},
//       }));
//       setRoles(parsed);
//     } catch (err) {
//       alert("Failed to load roles");
//     }
//   };

//   // Fetch modules data
//   const fetchModules = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/auth/modules", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include token in headers
//         },
//       });
//       setModules(res.data);
//     } catch (err) {
//       alert("Failed to load modules");
//     }
//   };

//   // Handle permission changes in the modal
//   const handlePermissionChange = (component, action) => {
//     setPermissions((prev) => ({
//       ...prev,
//       [component]: {
//         ...prev[component],
//         [action]: !prev[component]?.[action],
//       },
//     }));
//   };

//   // Edit role
//   const handleEdit = (role) => {
//     setName(role.name);

//     const defaultPerms = generateDefaultPermissions(modules);
//     const mergedPermissions = { ...defaultPerms };

//     Object.keys(role.permissions).forEach((key) => {
//       if (mergedPermissions[key]) {
//         if (Array.isArray(role.permissions[key])) {
//           role.permissions[key].forEach((action) => {
//             if (mergedPermissions[key][action] !== undefined) {
//               mergedPermissions[key][action] = true;
//             }
//           });
//         }
//       }
//     });

//     setPermissions(mergedPermissions);
//     setEditId(role.id);
//     setShowModal(true);
//   };

//   // Delete role
//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this role?")) {
//       try {
//         await axios.delete(`http://localhost:5001/auth/roles/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         });
//         fetchRoles();
//       } catch {
//         alert("Delete failed");
//       }
//     }
//   };

//   // Submit role (add or edit)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name.trim()) return alert("Role name required");

//     try {
//       const roleData = { name, permissions };

//       if (editId) {
//         await axios.put(
//           `http://localhost:5001/auth/roles/${editId}`,
//           roleData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Include token in headers
//             },
//           }
//         );
//       } else {
//         await axios.post("http://localhost:5001/auth/roles", roleData, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         });
//       }

//       setShowModal(false);
//       fetchRoles(); // Refresh the roles list
//     } catch (err) {
//       alert("Error saving role");
//     }
//   };

//   // Generate default permissions based on modules
//   const generateDefaultPermissions = (modules) => {
//     const perms = {};

//     Object.keys(modules).forEach((module) => {
//       perms[module] = {};
//       modules[module].forEach((action) => {
//         perms[module][action] = false;
//       });
//     });

//     return perms;
//   };

 
//   const formatPermissions = (permissions) => {
//     return Object.entries(permissions)
//       .map(([component, actions]) => {
//         const allowed = Object.entries(actions)
//           .filter(([_, allowed]) => allowed)
//           .map(([action]) => action);
//         return `${component}: ${allowed.join(", ") || "None"}`;
//       })
//       .join(" | ");
//   };

//   // Open modal to add a new role
//   const openAddModal = () => {
//     setName("");
//     setPermissions(generateDefaultPermissions(modules));
//     setEditId(null);
//     setShowModal(true);
//   };


//   const headerCellStyle = {
//   padding: "12px 15px",
//   textAlign: "left",
//   borderBottom: "1px solid #0f0f0fff",
//   fontWeight: "600",
//   fontSize: 14,
// };

// const cellStyle = {
//   padding: "10px 12px",
//   verticalAlign: "top",
//   fontSize: 14,
// };


//   return (
//     // <div className="container mt-5 p-5">
//     //   <h2 className="text-center mb-4">Role Management</h2>
//     //   <div className="mb-3 text-end">
//     //     <button className="btn btn-success" onClick={openAddModal}>
//     //       Add Role
//     //     </button>
//     //   </div>

//      <div className="container-fluid border shadow-sm" style={{marginTop:"100px", width:"98%"}}>
//       <div className=" d-flex justify-content-between align-items-center mt-5 mb-3">
//          <div className="col-sm-6">
//                 <h3>Role Management</h3>
//                 <div className="col-sm-6">
//                   <ol className="breadcrumb float-sm-right">
//                     <li className="breadcrumb-item">
//                       <a href="/">Home</a>
//                     </li>
//                     <li className="breadcrumb-item active">Role Management</li>
//                   </ol>
//                 </div>
//               </div>
//         {/* <h4 className="mb-0 fw-semibold text-primary">Role Management</h4> */}
      

//        <button className="btn btn-success" onClick={openAddModal}>
//        < i className="fas fa-plus me-2"></i>
//        Add Role
//       </button>
      
//       </div>

//       <div className="mt-5">

 

// <div
//   className="table-responsive mt-4"
//   style={{
//     overflowX: "auto",
//     borderRadius: 8,
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//     backgroundColor: "#f1f3f5",
//   }}
// >
//   <table
//     className="table table-bordered table-hover"
//     style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%" }}
//   >
//     <thead
//       className="table-secondary"
//       style={{ borderRadius: "8px 8px 0 0", userSelect: "none" }}
//     >
//       <tr>
//         <th style={headerCellStyle}>#</th>
//         <th style={headerCellStyle}>ID</th>
//         <th style={headerCellStyle}>Role Name</th>
//         <th style={headerCellStyle}>Permissions</th>
//         <th style={{ ...headerCellStyle, textAlign: "center" }}>Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {roles.length === 0 ? (
//         <tr>
//           <td
//             colSpan="4"
//             style={{
//               textAlign: "center",
//               padding: 20,
//               color: "#6c757d",
//               fontStyle: "italic",
//             }}
//           >
//             No roles found.
//           </td>
//         </tr>
//       ) : (
//         roles.map((role, i) => {
//           const rowBg = i % 2 === 0 ? "#f9f9f9" : "white";
//           return (
//             <tr key={role.id} style={{ backgroundColor: rowBg }}>
//               <td style={cellStyle} className="text-muted">{i+1}</td>
//               <td style={cellStyle} className="text-muted">{role.id}</td>
//               <td style={{ ...cellStyle, fontWeight: 600, textTransform: "capitalize" }}>
//                 {role.name}
//               </td>
//               <td style={{ ...cellStyle, fontSize: 13, color: "#6c757d" }}>
//                 {formatPermissions(role.permissions)}
//               </td>
//               <td style={{ ...cellStyle, textAlign: "center" }}>
//                 <button
//                   className="btn btn-sm me-1"
//                   onClick={() => handleEdit(role)}
//                   title="Edit"
//                   style={{
//                     fontSize: 14,
//                     background: "none",
//                     border: "none",
//                     color: "#0d6efd",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <i className="fas fa-pen"></i>
//                 </button>
//                 <button
//                   className="btn btn-sm"
//                   onClick={() => handleDelete(role.id)}
//                   title="Delete"
//                   style={{
//                     fontSize: 14,
//                     background: "none",
//                     border: "none",
//                     color: "#dc3545",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <i className="fas fa-trash"></i>
//                 </button>
//               </td>
//             </tr>
//           );
//         })
//       )}
//     </tbody>
//   </table>
// </div>


//       </div>

//       {/* Modal for adding/editing a role */}
//       {showModal && (
//         <div className="modal show fade d-block" tabIndex="-1" role="dialog">
//           <div className="modal-dialog modal-lg" role="document">
//             <div className="modal-content">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {editId ? "Edit Role" : "Add Role"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label>Role Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                     />
//                   </div>
//                   <h5 className="mb-3">Permissions</h5>
// <div className="row">
//   {Object.keys(modules).map((component) => (
//     <div className="col-md-6 mb-3" key={component}>
//       <div className="card shadow-sm h-100">
//         <div className="card-header py-2">
//           <strong className="text-uppercase small">
//             {component.replace("_", " ")}
//           </strong>
//         </div>
//         <div className="card-body d-flex flex-wrap gap-2">
//           {modules[component].map((action) => (
//             <div key={action} className="form-check form-check-inline">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id={`${component}-${action}`}
//                 checked={permissions[component]?.[action] || false}
//                 onChange={() => handlePermissionChange(component, action)}
//               />
//               <label
//                 className="form-check-label small"
//                 htmlFor={`${component}-${action}`}
//               >
//                 {action}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
// </div>


//                 <div className="modal-footer">
//                   <button type="submit" className="btn btn-primary">
//                     {editId ? "Update" : "Create"}
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RolesManagement;



import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Button,
  Table,
  Modal,
  Form,
  Card,
  Row,
  Col
} from "react-bootstrap";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function RolesManagement() {
  const { token } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState({});
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchModules();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = res.data.map((role) => ({
        ...role,
        permissions:
          typeof role.permissions === "string"
            ? JSON.parse(role.permissions || "{}")
            : role.permissions || {},
      }));
      setRoles(parsed);
    } catch {
      alert("Failed to load roles");
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:5001/auth/modules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(res.data);
    } catch {
      alert("Failed to load modules");
    }
  };

  const generateDefaultPermissions = (modules) => {
    const perms = {};
    Object.keys(modules).forEach((component) => {
      perms[component] = {};
      modules[component].forEach((action) => {
        perms[component][action] = false;
      });
    });
    return perms;
  };

  const handleEdit = (role) => {
    setName(role.name);
    const defaultPerms = generateDefaultPermissions(modules);
    const merged = { ...defaultPerms };
    Object.entries(role.permissions).forEach(([comp, acts]) => {
      if (merged[comp] && Array.isArray(acts)) {
        acts.forEach((act) => {
          if (merged[comp][act] !== undefined) {
            merged[comp][act] = true;
          }
        });
      }
    });
    setPermissions(merged);
    setEditId(role.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try {
      await axios.delete(`http://localhost:5001/auth/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoles();
    } catch {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Role name required");
      return;
    }
    try {
      const roleData = { name, permissions };
      if (editId) {
        await axios.put(`http://localhost:5001/auth/roles/${editId}`, roleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5001/auth/roles`, roleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchRoles();
    } catch {
      alert("Error saving role");
    }
  };

  const handlePermissionChange = (component, action) => {
    setPermissions((prev) => ({
      ...prev,
      [component]: {
        ...prev[component],
        [action]: !prev[component]?.[action],
      },
    }));
  };

  const formatPermissions = (perms) => {
    return Object.entries(perms)
      .map(([comp, acts]) => {
        const allowed = Object.entries(acts)
          .filter(([_, val]) => val)
          .map(([act]) => act);
        return `${comp}: ${allowed.join(", ") || "None"}`;
      })
      .join(" | ");
  };

  const headerCellStyle = {
    padding: "12px 15px",
    textAlign: "left",
    borderBottom: "1px solid #0f0f0fff",
    fontWeight: 600,
    fontSize: 14,
  };
  const cellStyle = { padding: "10px 12px", verticalAlign: "top", fontSize: 14 };

  return (
    <Container fluid className="border shadow-sm bg-light" style={{ marginTop: "100px", width: "98%",borderRadius: '10px'  }}>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h3>Role Management</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Role Management</li>
            </ol>
          </nav>
        </div>
        <Button variant="success" onClick={() => {
          setName("");
          setPermissions(generateDefaultPermissions(modules));
          setEditId(null);
          setShowModal(true);
        }}>
          <i className="fas fa-plus me-2"></i>Add Role
        </Button>
      </div>

      <div className="table-responsive mt-4" style={{ overflowX: "auto", borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", backgroundColor: "#f1f3f5" }}>
        <Table bordered hover style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%" }}>
          <thead className="table-secondary" style={{ borderRadius: "8px 8px 0 0", userSelect: "none" }}>
            <tr>
              <th style={headerCellStyle}>#</th>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Role Name</th>
              <th style={headerCellStyle}>Permissions</th>
              <th style={{ ...headerCellStyle, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#6c757d", fontStyle: "italic" }}>
                  No roles found.
                </td>
              </tr>
            ) : (
              roles.map((role, i) => (
                <tr key={role.id} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                  <td style={cellStyle} className="text-muted">{i + 1}</td>
                  <td style={cellStyle} className="text-muted">{role.id}</td>
                  <td style={{ ...cellStyle, fontWeight: 600, textTransform: "capitalize" }}>{role.name}</td>
                  <td style={{ ...cellStyle, fontSize: 13, color: "#6c757d" }}>
                    {formatPermissions(role.permissions)}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    <Button variant="link" className="text-primary me-1 p-0" onClick={() => handleEdit(role)} title="Edit">
                      <i className="fas fa-pen"></i>
                    </Button>
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(role.id)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? "Edit Role" : "Add Role"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <h5 className="mb-3">Permissions</h5>
            <Row className="g-3">
              {Object.keys(modules).map((component) => (
                <Col md={6} key={component}>
                  <Card className="h-100">
                    <Card.Header className="py-2">
                      <strong className="text-uppercase small">{component.replace("_", " ")}</strong>
                    </Card.Header>
                    <Card.Body className="d-flex flex-wrap gap-2">
                      {modules[component].map((action) => (
                        <Form.Check
                          inline
                          key={action}
                          type="checkbox"
                          id={`${component}-${action}`}
                          label={action}
                          checked={permissions[component]?.[action] || false}
                          onChange={() => handlePermissionChange(component, action)}
                        />
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editId ? "Update" : "Create"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default RolesManagement;
