// import { roleHierarchy } from "../utils/roleHierarchy.js";
// import { pool } from "../server.js"; //
// import bcrypt from "bcryptjs";

// export const createUser = async (req, res) => {
//   const { name, email, password, role, status } = req.body;

//   if (!name || !email || !password || !role || !status) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   if (!roleHierarchy[role]) {
//     return res.status(400).json({ message: "Invalid role specified." });
//   }

//   if (roleHierarchy[role] >= roleHierarchy[req.user.role]) {
//     return res.status(403).json({
//       message: "Insufficient permissions to assign this role.",
//     });
//   }

//   try {

//     const [existingUser] = await pool.execute(
//       "SELECT * FROM login WHERE email = ?",
//       [email]
//     );
//     if (existingUser.length > 0) {
//       return res.status(409).json({ message: "Email already in use." });
//     }

//     const roleId = roleResult[0].id;

//     const hashedPassword = await bcrypt.hash(password, 10);
//        const [result]  =  await pool.execute(
//       // "INSERT INTO login (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
//       // [name, email, hashedPassword, role, status || "active"]
//         "INSERT INTO login (name, email, password, role_id, role, image, insert_time, status) VALUES (?, ?, ?, ?,?, ?, CURRENT_TIMESTAMP, ?)",
//       [name, email, hashedPassword, roleId, role, image, status]
//     );

//     res.status(201).json({ message: "User created successfully." });
//   } catch (err) {
//     console.error("User creation failed:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import { roleHierarchy } from "../utils/roleHierarchy.js";
import { pool } from "../server.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { name, email, password, role, status, image } = req.body;

  if (!name || !email || !password || !role || !status) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!roleHierarchy[role]) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (roleHierarchy[role] >= roleHierarchy[req.user.role]) {
    return res.status(403).json({
      message: "Insufficient permissions to assign this role.",
    });
  }

  try {
    const [existingUser] = await pool.execute(
      "SELECT * FROM login WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const [roleResult] = await pool.execute(
      "SELECT id FROM roles WHERE name = ?",
      [role]
    );
    if (roleResult.length === 0) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    const roleId = roleResult[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO login (name, email, password, role_id, role, image, insert_time, status) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
      [name, email, hashedPassword, roleId, role, image || null, status]
    );

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
