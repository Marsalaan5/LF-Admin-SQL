// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   BarChart,
//   Bar,
// } from "recharts";
// import { AuthContext } from "../context/AuthContext";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

// function ComplaintCharts() {
//   const {token} = useContext(AuthContext)
//   const [statusData, setStatusData] = useState([]);
//   const [trendData, setTrendData] = useState([]);
//   const [resolutionData, setResolutionData] = useState([]);
//   const [categoriesData, setCategoriesData] = useState([]);
//   const [period, setPeriod] = useState("day");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("ComplaintCharts received token:", token);


//     setLoading(true);
//     Promise.all([
//       axios.get("http://localhost:5001/auth/complaints/stats/status", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("http://localhost:5001/auth/complaints/stats/count", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { period },
//       }),
//       axios.get("http://localhost:5001/auth/complaints/stats/resolution-time", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("http://localhost:5001/auth/complaints/stats/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     ])
//       .then(
//         ([
//           statusRes,                                                                                                               
//           trendRes,
//           resolutionRes,
//           categoriesRes,
//         ]) => {
//             console.log("Status Data:", statusRes.data);
//   console.log("Trend Data:", trendRes.data);
//   console.log("Resolution Data:", resolutionRes.data);
//   console.log("Categories Data:", categoriesRes.data);
//           setStatusData(statusRes.data);
//           setTrendData(trendRes.data);
//           setResolutionData(resolutionRes.data);
//           setCategoriesData(categoriesRes.data);
//           console.log("One Status Data:", statusData[0]);
// console.log("One Trend Data:", trendData[0]);
// console.log("One Resolution Data:", resolutionData[0]);
// console.log("One Category Data:", categoriesData[0]);

//         }
//       )
//       .catch((e) => {
//         console.error("Failed to fetch complaint stats:", e);
//       })
//       .finally(() => setLoading(false));
//   }, [token, period]);

//   if (loading) return <p>Loading complaint stats...</p>;

//   return (
//     <div className="container">
//       <h2 className="my-4">Complaint Analytics</h2>

//       {/* Period selector for trend */}
//       <div className="mb-3">
//         <label>
//           Select Trend Period:{" "}
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="form-select w-auto d-inline-block"
//           >
//             <option value="day">Daily</option>
//             <option value="week">Weekly</option>
//             <option value="month">Monthly</option>
//           </select>
//         </label>
//       </div>

//       <div className="row">
//         {/* Status Pie Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Status Breakdown</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 dataKey="count"
//                 nameKey="status"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={90}
//                 label={(entry) => entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
//               >
//                 {statusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Complaint Trend Line Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Complaint Trends ({period})</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={trendData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="period" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="count" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="row">
//         {/* Resolution Time Bar Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Average Resolution Time (hours)</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={resolutionData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="avg_hours" fill="#82ca9d" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Top Categories Bar Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Top Complaint Categories</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={categoriesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="category_name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#ffc658" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ComplaintCharts;



import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { AuthContext } from "../context/AuthContext";

const COLORS = ["#e2b838ff", "#007bff","#17a2b8","#198754", "#dc3545", "#6c757d"];

function ComplaintCharts() {
  const { token } = useContext(AuthContext);

  const [statusData, setStatusData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [resolutionData, setResolutionData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [period, setPeriod] = useState("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      axios.get("http://localhost:5001/auth/complaints/stats/status", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:5001/auth/complaints/stats/count", {
        headers: { Authorization: `Bearer ${token}` },
        params: { period },
      }),
      axios.get("http://localhost:5001/auth/complaints/stats/resolution-time", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:5001/auth/complaints/stats/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([statusRes, trendRes, resolutionRes, categoriesRes]) => {
        // Set data
        setStatusData(statusRes.data);
        setTrendData(trendRes.data);
        setResolutionData(resolutionRes.data);
        setCategoriesData(categoriesRes.data);

  
        console.log("One Status Data:", statusRes.data?.[0]);
        console.log("One Trend Data:", trendRes.data?.[0]);
        console.log("One Resolution Data:", resolutionRes.data?.[0]);
        console.log("One Category Data:", categoriesRes.data?.[0]);
      })
      .catch((error) => {
        console.error("Failed to fetch complaint stats:", error);
      })
      .finally(() => setLoading(false));
  }, [token, period]);

  if (loading) return <p>Loading complaint stats...</p>;

//   return (
//     <div className="container">
//       <h2 className="my-4">Complaint Analytics</h2>

//       {/* Period Selector */}
//       <div className="mb-3">
//         <label>
//           Select Trend Period:{" "}
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="form-select w-auto d-inline-block"
//           >
//             <option value="day">Daily</option>
//             <option value="week">Weekly</option>
//             <option value="month">Monthly</option>
//           </select>
//         </label>
//       </div>

//       <div className="row">
//         {/* Status Pie Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Status Breakdown</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 dataKey="count"
//                 nameKey="status"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={90}
//                 label={(entry) =>
//                   entry.status.charAt(0).toUpperCase() + entry.status.slice(1)
//                 }
//               >
//                 {statusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Trend Line Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Complaint Trends ({period})</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={trendData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="period" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="count" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="row">
//         {/* Resolution Time Bar Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Avg Resolution Time (hours)</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={resolutionData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="avg_hours" fill="#82ca9d" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Categories Bar Chart */}
//         <div className="col-md-6 mb-4">
//           <h5>Top Complaint Categories</h5>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={categoriesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="category_name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#ffc658" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

return (
  <div className="container py-4">
    {/* <h2 className="mb-4 text-primary text-center">📊 Complaint Analytics Dashboard</h2> */}

    {/* Period Selector */}
    <div className="d-flex justify-content-end mb-4">
      <div className="d-inline-block">
        <label className="form-label me-2 fw-semibold">Trend Period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="form-select form-select-sm w-auto d-inline-block"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
    </div>

    <div className="row g-4">
      {/* Status Pie Chart */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">🧾 Status Breakdown</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) =>
                    entry.status.charAt(0).toUpperCase() + entry.status.slice(1)
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">
              📈 Complaint Trends ({period})
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-4 mt-2">
      {/* Resolution Time Chart */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">
              ⏱️ Avg Resolution Time (hours)
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg_hours" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Categories Chart */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">
              🏷️ Top Complaint Categories
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default ComplaintCharts;
