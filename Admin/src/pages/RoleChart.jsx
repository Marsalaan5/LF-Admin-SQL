import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#c42700ff", "#ff289eff", "#42ff4bff", "#00ffffff","#ff8019ff"];

function RoleDistributionChart({ users }) {
  // Prepare data for pie chart
  const roleCounts = users.reduce((acc, user) => {
    const normalizedRole = user.role.toLowerCase(); 
    acc[normalizedRole] = (acc[normalizedRole] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(roleCounts).map((role) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1), 
    value: roleCounts[role],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default RoleDistributionChart;
