

// import { useContext, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// function TrackComplaint() {
//   const [id, setId] = useState("");
//   const [complaint, setComplaint] = useState(null);
//   const [error, setError] = useState("");
//   const { token } = useContext(AuthContext);

//   const handleSearch = async () => {
//     if (!id.trim()) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:5001/auth/complaints/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//        console.log("Complaint API response:", res.data);
//       setComplaint(res.data);
//       setError("");
//     } catch (err) {
//       setComplaint(null);
//       setError(err.response?.data?.message || "Complaint not found.");
//     }
//   };

//   return (


 
   


//     <div
//     className="container-fluid border shadow-sm"
//     style={{ marginTop: "100px", width: "98%" }}
//     >

//          <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
//         <div className="col-sm-6">
//           <h3>Track Your Complaint</h3>
//           <div className="col-sm-6">
//             <ol className="breadcrumb float-sm-right">
//               <li className="breadcrumb-item">
//                 <a href="/">Home</a>
//               </li>
//               <li className="breadcrumb-item active text-center">Track-Complaint</li>
//             </ol>
//           </div>
//         </div>
//       </div>


//       {/* <div className="d-flex justify-content-between align-items-center mt-5 mb-3"> */}
//        <div
//         className="container-fluid p-3 border shadow-sm"
//         style={{ maxWidth: "600px" }}
//       >
//          {/* <h2 className="text-center">Track Your Complaint</h2> */}
//         <div className="col-sm-6 text-center">
//         <p className="text-muted">Enter your complaint ID to see the status.</p>
//             </div>

//       <div className="card shadow-sm mb-3 p-4">
//         <div className="input-group mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter Complaint ID"
//             value={id}
//             onChange={(e) => setId(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             />
//           <button className="btn btn-primary" onClick={handleSearch}>
//             Track
//           </button>
//         </div>

//         {error && <div className="alert alert-danger">{error}</div>}

//         {complaint && (
//           <div className="mt-4">
//     <h5 className="mb-3">Complaint Details</h5>
//     <ul className="list-group">
//       <li className="list-group-item"><strong>Complaint ID:</strong> {complaint.id}</li>
//       {/* <li className="list-group-item"><strong>Name:</strong> {complaint.user_name}</li> */}
//       <li className="list-group-item"><strong>Mobile:</strong> {complaint.mobile}</li>
//       <li className="list-group-item"><strong>Address:</strong> {complaint.address}</li>
//       <li className="list-group-item"><strong>Category:</strong> {complaint.category_name}</li>
//       <li className="list-group-item"><strong>Subcategory:</strong> {complaint.subcategory_name || "N/A"}</li>
//       <li className="list-group-item"><strong>Description:</strong> {complaint.description}</li>
//       <li className="list-group-item">
//         <strong>Status:</strong>{" "}
//         <span
//           className={`badge ${
//             complaint.status === "resolved"
//             ? "bg-success"
//             : complaint.status === "pending"
//             ? "bg-warning text-dark"
//             : "bg-secondary"
//           }`}
//         >
//           {complaint.status}
//         </span>
//       </li>
//       <li className="list-group-item"><strong>Assigned To:</strong> {complaint.assigned_to_name || "Not Assigned"}</li>
//       <li className="list-group-item"><strong>Latitude:</strong> {complaint.latitude || "N/A"}</li>
//       <li className="list-group-item"><strong>Longitude:</strong> {complaint.longitude || "N/A"}</li>
//     </ul>

//           </div>
//         )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TrackComplaint;



// import { useContext, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// function TrackComplaint() {
//   const [id, setId] = useState("");
//   const [complaint, setComplaint] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { token } = useContext(AuthContext);

//   const handleSearch = async () => {
//     if (!id.trim()) return;

//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:5001/auth/complaints/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setComplaint(res.data);
//       setError("");
//     } catch (err) {
//       setComplaint(null);
//       setError(err.response?.data?.message || "Complaint not found.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusLabels = {
//     resolved: "Resolved",
//     pending: "Pending",
//     open: "Open",
//   };

//   const getStatusBadgeColorInline = (status) => {
//   switch (status) {
//     case "pending":
//       return { backgroundColor: "#ffc107", color: "#212529" };
//     case "open":
//       return { backgroundColor: "#0d6efd", color: "#fff" };
//     case "in progress":
//       return { backgroundColor: "#0dcaf0", color: "#212529" };
//     case "awaiting":
//       return { backgroundColor: "#6c757d", color: "#fff" };
//     case "resolved":
//       return { backgroundColor: "#198754", color: "#fff" };
//     case "rejected":
//       return { backgroundColor: "#dc3545", color: "#fff" };
//     case "closed":
//       return { backgroundColor: "#198754", color: "#fff" };
//     default:
//       return { backgroundColor: "#f8f9fa", color: "#212529" };
//   }
// };


//   if (!token) {
//     return (
//       <div className="container mt-5">
//         <div className="alert alert-warning">Please log in to track a complaint.</div>
//       </div>
//     );
//   }

//   return (
    // <div
    //   className="container-fluid border shadow-sm"
    //   style={{ marginTop: "100px", width: "98%" }}
    // >
    //   <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
    //     <div className="col-sm-6">
    //       <h3>Track Your Complaint</h3>
    //       <div className="col-sm-6">
    //         <ol className="breadcrumb float-sm-right">
    //           <li className="breadcrumb-item">
    //             <a href="/">Home</a>
    //           </li>
    //           <li className="breadcrumb-item active text-center">Track-Complaint</li>
    //         </ol>
    //       </div>
    //     </div>
    //   </div>

//       <div
//         className="container-fluid p-3 border shadow-sm"
//         style={{ maxWidth: "600px" }}
//       >
//         <div className="col-sm-6 text-center">
//           <p className="text-muted">Enter your complaint ID to see the status.</p>
//         </div>

//         <div className="card shadow-sm mb-3 p-4">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSearch();
//             }}
//           >
//             <div className="input-group mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Complaint ID"
//                 value={id}
//                 onChange={(e) => {
//                   setId(e.target.value);
//                   if (error) setError("");
//                 }}
//               />
//               <button className="btn btn-primary" type="submit" disabled={loading}>
//                 {loading ? "Loading..." : "Track"}
//               </button>
//             </div>
//           </form>

//           {error && <div className="alert alert-danger">{error}</div>}

//           {complaint && (
//             <div className="mt-4">
//               <h5 className="mb-3">Complaint Details</h5>
//               <ul className="list-group">
//                 <li className="list-group-item">
//                   <strong>Complaint ID:</strong> {complaint.id}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Mobile:</strong> {complaint.mobile || "N/A"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Address:</strong> {complaint.address || "N/A"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Category:</strong> {complaint.category_name || "N/A"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Subcategory:</strong> {complaint.subcategory_name || "N/A"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Description:</strong> {complaint.description || "N/A"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Status:</strong>{" "}
//                   {/* <span
//                     className={`badge ${
//                       complaint.status === "resolved"
//                         ? "bg-success"
//                         : complaint.status === "pending"
//                         ? "bg-warning text-dark"
//                         : "bg-secondary"
//                     }`}
//                   >
//                     {statusLabels[complaint.status] || complaint.status}
//                   </span> */}

//                   <span
//   style={{
//     display: "inline-block",
//     padding: "4px 12px",
//     borderRadius: 20,
//     fontWeight: "600",
//     fontSize: 12,
//     textTransform: "capitalize",
//     userSelect: "none",
//     ...getStatusBadgeColorInline(complaint.status?.toLowerCase()),
//   }}
// >
//   {statusLabels[complaint.status] || complaint.status}
// </span>

//                 </li>
//                 <li className="list-group-item">
//                   <strong>Assigned To:</strong> {complaint.assigned_to_name || "Not Assigned"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Latitude:</strong> {complaint.latitude || "N/A"}
//                 </li>
//                 <li className="list-group-item">
//                   <strong>Longitude:</strong> {complaint.longitude || "N/A"}
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TrackComplaint;


import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


function TrackComplaint() {
  const [id, setId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!id.trim()) {
      setError("Please enter a valid Ticket ID / Complaint ID.");
      return;
    }

    setLoading(true);
  
    try {
      const res = await axios.get(
        `http://localhost:5001/auth/complaints/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComplaint(res.data);
      setError("");
    } catch (err) {
      setComplaint(null);
      setError(err.response?.data?.message || "Complaint not found.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColorInline = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#ffc107", color: "#212529" };
      case "open":
        return { backgroundColor: "#0d6efd", color: "#fff" };
      case "in progress":
        return { backgroundColor: "#0dcaf0", color: "#212529" };
      case "awaiting":
        return { backgroundColor: "#6c757d", color: "#fff" };
      case "resolved":
      case "closed":
        return { backgroundColor: "#198754", color: "#fff" };
      case "rejected":
        return { backgroundColor: "#dc3545", color: "#fff" };
      default:
        return { backgroundColor: "#adb5bd", color: "#212529" };
    }
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          Please log in to track a complaint.
        </div>
      </div>
    );
  }

  return (
    // <div className="container py-5" style={{ maxWidth: "800px" }}>
     <div
      className="container-fluid border shadow-sm"
      style={{ marginTop: "100px", width: "98%",borderRadius: '10px'  }}
    >
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div className="col-sm-6">
          <h3>Track Your Complaint</h3>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active text-center">Track-Complaint</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="mb-4 text-center">
        {/* <h2 className="fw-bold">Track Your Complaint</h2> */}
        <p className="text-muted">Enter your Ticket / Complaint ID to get current status.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="d-flex flex-column align-items-center gap-3 mb-3"
      >
        <input
          type="text"
          className="form-control w-100"
          style={{ maxWidth: "400px" }}
          placeholder="Enter Ticket/Complaint ID"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            if (error) setError("");
          }}
        />
        <button
          className="btn btn-primary w-100"
          style={{ maxWidth: "200px" }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            "Track Complaint"
          )}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3 text-center">{error}</div>
      )}

      {complaint && (
        <div className="card shadow-sm mt-4 mb-3">
          <div className="card-header bg-light fw-bold">Complaint Details</div>
          <ul className="list-group list-group-flush">
            <DetailItem label="Complaint ID" value={complaint.id} />
            <DetailItem label="Mobile" value={complaint.mobile || "N/A"} />
            <DetailItem label="Address" value={complaint.address || "N/A"} />
            <DetailItem label="Category" value={complaint.category_name || "N/A"} />
            <DetailItem label="Subcategory" value={complaint.subcategory_name || "N/A"} />
            <DetailItem label="Description" value={complaint.description || "N/A"} />
            <li className="list-group-item">
              <strong>Status:</strong>{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontWeight: "600",
                  fontSize: 12,
                  textTransform: "capitalize",
                  userSelect: "none",
                  ...getStatusBadgeColorInline(complaint.status?.toLowerCase()),
                }}
              >
                {complaint.status || "N/A"}
              </span>
            </li>
            <DetailItem
              label="Assigned To"
              value={complaint.assigned_to_name || "Not Assigned"}
            />
            <DetailItem label="Latitude" value={complaint.latitude || "N/A"} />
            <DetailItem label="Longitude" value={complaint.longitude || "N/A"} />
          </ul>
        </div>
      )}
    </div>
  );
}

// Sub-component for detail rows
function DetailItem({ label, value }) {
  return (
    <li className="list-group-item">
      <strong>{label}:</strong> {value}
    </li>
  );
}

export default TrackComplaint;
