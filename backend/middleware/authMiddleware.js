import jwt from "jsonwebtoken";
import { pool } from "../server.js";

export function isAdmin(req, res, next) {
  if (req.user.role !== "Super Admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Super Admins only." });
  }
  next();
}

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.execute("SELECT * FROM login WHERE id = ?", [
      decoded.id,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "User not found" });

    const user = rows[0];

    let permissions = {};
    if (user.role) {
      const [roleRows] = await pool.execute(
        "SELECT * FROM roles WHERE name = ?",
        [user.role]
      );
      if (roleRows.length > 0) {
        try {
          permissions = JSON.parse(roleRows[0].permissions || "{}");
        } catch {
          permissions = {};
        }
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid token" });
  }
};
