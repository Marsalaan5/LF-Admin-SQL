

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
    if (!id.trim()) return;

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

  const statusLabels = {
    resolved: "Resolved",
    pending: "Pending",
    open: "Open",
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Please log in to track a complaint.</div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid border shadow-sm"
      style={{ marginTop: "100px", width: "98%" }}
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

      <div
        className="container-fluid p-3 border shadow-sm"
        style={{ maxWidth: "600px" }}
      >
        <div className="col-sm-6 text-center">
          <p className="text-muted">Enter your complaint ID to see the status.</p>
        </div>

        <div className="card shadow-sm mb-3 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Complaint ID"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  if (error) setError("");
                }}
              />
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Track"}
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          {complaint && (
            <div className="mt-4">
              <h5 className="mb-3">Complaint Details</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Complaint ID:</strong> {complaint.id}
                </li>
                <li className="list-group-item">
                  <strong>Mobile:</strong> {complaint.mobile || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Address:</strong> {complaint.address || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Category:</strong> {complaint.category_name || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Subcategory:</strong> {complaint.subcategory_name || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Description:</strong> {complaint.description || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      complaint.status === "resolved"
                        ? "bg-success"
                        : complaint.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {statusLabels[complaint.status] || complaint.status}
                  </span>
                </li>
                <li className="list-group-item">
                  <strong>Assigned To:</strong> {complaint.assigned_to_name || "Not Assigned"}
                </li>
                <li className="list-group-item">
                  <strong>Latitude:</strong> {complaint.latitude || "N/A"}
                </li>
                <li className="list-group-item">
                  <strong>Longitude:</strong> {complaint.longitude || "N/A"}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackComplaint;
