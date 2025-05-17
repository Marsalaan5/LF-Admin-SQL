import multer from "multer";
import express from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool, io } from "../server.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import path from "path";
import moduleConfig from "../config/moduleConfig.js";

import { checkPermission } from "../middleware/checkPermission.js";

import fs from "fs";
import csv from "csv-parser";
import { Parser } from "json2csv";
import XLSX from "xlsx";




const router = express.Router();


//image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimeType && extname) {
      return cb(null, true);
    }
    return cb(new Error("Only image files are allowed."));
  },
});

const logAudit = async (
  adminId,
  action,
  recordId = null,
  oldData = null,
  newData = null
) => {
  try {
    console.log("Logging audit:", {
      adminId,
      action,
      recordId,
      oldData,
      newData,
    });
    await pool.execute(
      "INSERT INTO audit_log (admin_id, action, record_id, old_data, new_data) VALUES (?, ?, ?, ?, ?)",
      [
        adminId,
        action,
        recordId,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
      ]
    );
  } catch (err) {
    console.error("Error logging audit:", err);
  }
};

// GET /modules
router.get("/modules", (req, res) => {
  res.json(moduleConfig);
});

router.post("/register", upload.single("image"), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  const { name, email, password, role = "user", status = "active" } = req.body;
  const image = req.file ? req.file.path : null;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const [roleResult] = await pool.execute(
      "SELECT id FROM roles WHERE name = ?",
      [role]
    );

    if (roleResult.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const roleId = roleResult[0].id;

    const [existingUser] = await pool.execute(
      "SELECT * FROM login WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      "INSERT INTO login (name, email, password, role_id, role, image, insert_time, status) VALUES (?, ?, ?, ?,?, ?, CURRENT_TIMESTAMP, ?)",
      [name, email, hashedPassword, roleId, role, image, status]
    );
    console.log("Audit INSERT result:", result);

    io.emit("new-signup", { name, email });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;
    await logAudit(adminId, "INSERT", result.insertId, null, {
      name,
      email,
      role_id: roleId,
      role,
      image,
      status,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userRows] = await pool.execute(
      "SELECT * FROM login WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const roleId = user.role_id;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, role_id: roleId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Fetch permissions based on the user's role_id
    const [permissionRows] = await pool.execute(
      "SELECT permissions FROM roles WHERE id = ?",
      [roleId]
    );

    let permissions = {};
    if (permissionRows.length > 0) {
      try {
        permissions = JSON.parse(permissionRows[0].permissions || "{}");
      } catch (error) {
        console.error("Error parsing permissions JSON:", error);
        permissions = {};
      }
    }

    const now = new Date();

    await pool.execute(
      "UPDATE login SET token = ?, last_login = ? WHERE id = ?",
      [token, now, user.id]
    );

    await logAudit(user.id, "LOGIN", user.id, null, {
      login_time: now,
      role_id: roleId,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      result: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        role_id: roleId,
        last_login: now,
      },
      permissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//routes for profile

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await pool.execute(
      "SELECT id, name, email, image FROM login WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userRows[0]);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const [existingUser] = await pool.execute(
      "SELECT * FROM login WHERE id = ?",
      [userId]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : existingUser[0].password;

    await pool.execute(
      "UPDATE login SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, hashedPassword, userId]
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

//dashboard route

router.get(
  "/dashboard/stats",
  authenticateToken,
  checkPermission("dashboard", "view"),
  async (req, res) => {
    try {
      const [users] = await pool.execute("SELECT id, role, status FROM login");

      const totalUsers = users.length;
      const activeUsers = users.filter(
        (user) => user.status === "active"
      ).length;
      const inactiveUsers = users.filter(
        (user) => user.status === "inactive"
      ).length;

      const [roles] = await pool.execute("SELECT id, name FROM roles");

      const roleBreakdown = roles.map((role) => ({
        role: role.name,
        count: users.filter(
          (user) => user.role === role.name || user.role === role.id
        ).length,
      }));

      res.status(200).json({
        totalUsers,
        activeUsers,
        inactiveUsers,
        roleBreakdown,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  }
);

router.get(
  "/users",
  authenticateToken,
  checkPermission("user_management", "view"),
  async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [users] = await pool.execute(
        "SELECT id, name, email,role_id,role,image,status FROM login"
      );
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

router.post(
  "/users",
  checkPermission("user_management", "create"),
  async (req, res) => {}
);

router.put(
  "/users/:id",
  authenticateToken,
  checkPermission("user_management", "edit"),
  async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role_id, role, image, status } = req.body;
    console.log("Received data for update:", {
      name,
      email,
      role_id,
      role,
      image,
      status,
    });
    const token = req.headers.authorization?.split(" ")[1];

    try {
      const [user] = await pool.execute("SELECT * FROM login WHERE id = ?", [
        id,
      ]);

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldData = user[0];
      // const roleId = role_id;

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : oldData.password;

      const roleId = parseInt(role_id, 10);
      const [result] = await pool.execute(
        "UPDATE login SET name = ?, email = ?, password = ?, role_id = ?, role = ?, image = ?, status = ? WHERE id = ?",
        [name, email, hashedPassword, roleId, role, image, status, id]
      );
      console.log("Updated user:", result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const adminId = decoded.id;
      await logAudit(adminId, "UPDATE", id, oldData, {
        name,
        email,
        role_id: roleId,
        role,
        image,
        status,
      });

      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update user" });
    }
  }
);

router.delete(
  "/users/:id",
  authenticateToken,
  checkPermission("user_management", "delete"),
  async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    try {
      const [user] = await pool.execute("SELECT * FROM login WHERE id = ?", [
        id,
      ]);

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldData = user[0];

      const [result] = await pool.execute("DELETE FROM login WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const adminId = decoded.id;
      // const adminId = req.user.id;
      await logAudit(adminId, "DELETE", id, oldData, null);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);


//csv import

// Import users from CSV

router.post(
  "/users/import",
  authenticateToken,
  checkPermission("user_management", "import"),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const user of results) {
            const { name, email, password, role, status = "active" } = user;

            const [roleRow] = await pool.execute(
              "SELECT id FROM roles WHERE name = ?",
              [role]
            );
            if (roleRow.length === 0) continue;

            const roleId = roleRow[0].id;
            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.execute(
              "INSERT INTO login (name, email, password, role_id, role, insert_time, status) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
              [name, email, hashedPassword, roleId, role, status]
            );
          }

          fs.unlinkSync(filePath);
          res.status(200).json({ message: "Users imported successfully" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Import failed" });
        }
      });
  }
);



//search 

// Search users by name or role
router.get("/search", authenticateToken, async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm || searchTerm.trim() === "") {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const [results] = await pool.execute(
      `SELECT id, name, email, role, role_id, image, status
       FROM login
       WHERE name LIKE ? OR role LIKE ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Failed to perform search" });
  }
});



// Export users to CSV
router.get(
  "/users/export/csv",
  authenticateToken,
  checkPermission("user_management", "export"),
  async (req, res) => {
    try {
      const [users] = await pool.execute(
        "SELECT id, name, email, role, status FROM login"
      );

      const parser = new Parser();
      const csvData = parser.parse(users);

      res.header("Content-Type", "text/csv");
      res.attachment("users.csv");
      res.send(csvData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Export failed" });
    }
  }
);


// Import users from Excel
router.post(
  "/users/import/excel",
  authenticateToken,
  checkPermission("user_management", "import"),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const filePath = req.file.path;

    try {
      
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const users = XLSX.utils.sheet_to_json(sheet);

      for (const user of users) {
        const { name, email, password, role, status = "active" } = user;

        if (!name || !email || !password || !role) continue;

        const [roleRow] = await pool.execute(
          "SELECT id FROM roles WHERE name = ?",
          [role]
        );
        if (roleRow.length === 0) continue;

        const roleId = roleRow[0].id;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
          "INSERT INTO login (name, email, password, role_id, role, insert_time, status) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
          [name, email, hashedPassword, roleId, role, status]
        );
      }

      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Users imported from Excel successfully" });
    } catch (err) {
      console.error("Excel import error:", err);
      res.status(500).json({ message: "Excel import failed" });
    }
  }
);


//excel export 



router.get("/users/export/excel", authenticateToken, async (req, res) => {
  try {
    const [allUsers] = await pool.execute(
      "SELECT id, name, email, status, role FROM login"
    );

    const worksheet = XLSX.utils.json_to_sheet(allUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Error exporting users:", err);
    res.status(500).json({ message: "Failed to export users" });
  }
});




//modules 

router.get("/modules", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute("SELECT * FROM modules WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Module not found" });
    }

    const module = rows[0];

    res.json({
      module: {
        id: module.id,
        name: module.title,
        permissions: JSON.parse(module.permission),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add Module (POST)
router.post("/modules", async (req, res) => {
  const { title, permissions } = req.body;
  try {
    const [result] = await pool.execute(
      "INSERT INTO modules (title, permissions) VALUES (?, ?)",
      [title, JSON.stringify(permissions)]
    );
    res.status(201).json({ id: result.insertId, title, permissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add module" });
  }
});

// Update Module (PUT)
router.put("/modules/:id", async (req, res) => {
  const { id } = req.params;
  const { title, permissions } = req.body;
  try {
    await pool.execute(
      "UPDATE modules SET title = ?, permissions = ? WHERE id = ?",
      [title, JSON.stringify(permissions), id]
    );
    res.status(200).json({ message: "Module updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update module" });
  }
});

router.delete("/modules/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM modules WHERE id = ?", [id]);
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete module" });
  }
});

//for role

router.get(
  "/roles",
  authenticateToken,
  checkPermission("role_management", "view"),
  async (req, res) => {
    try {
      const [roles] = await pool.execute("SELECT * FROM roles");

      const parsedRoles = roles.map((role) => {
        try {
          role.permissions = JSON.parse(role.permissions || "{}");
        } catch {
          role.permissions = {};
        }
        return role;
      });

      res.status(200).json(parsedRoles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  }
);

// Get a specific role by ID with permissions
router.get(
  "/roles/:id",
  authenticateToken,
  checkPermission("role_management", "view"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const [role] = await pool.execute("SELECT * FROM roles WHERE id = ?", [
        id,
      ]);

      if (role.length === 0) {
        return res.status(404).json({ message: "Role not found" });
      }

      try {
        role[0].permissions = JSON.parse(role[0].permissions || "{}");
      } catch {
        role[0].permissions = {};
      }

      res.status(200).json(role[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch role" });
    }
  }
);

// Create a new role with permissions
router.post(
  "/roles",
  authenticateToken,
  checkPermission("role_management", "create"),
  async (req, res) => {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    if (typeof permissions !== "object" || permissions === null) {
      return res
        .status(400)
        .json({ message: "Permissions must be a valid JSON object" });
    }

    try {
      await pool.execute(
        "INSERT INTO roles (name, permissions) VALUES (?, ?)",
        [name, JSON.stringify(permissions)] // Store permissions as JSON string
      );
      res.status(201).json({ message: "Role created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create role" });
    }
  }
);

// Update a role with permissions
router.put(
  "/roles/:id",
  authenticateToken,
  checkPermission("role_management", "edit"),
  async (req, res) => {
    const { id } = req.params;
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    if (
      permissions &&
      (typeof permissions !== "object" || permissions === null)
    ) {
      return res
        .status(400)
        .json({ message: "Permissions must be a valid JSON object" });
    }

    try {
      const [result] = await pool.execute(
        "UPDATE roles SET name = ?, permissions = ? WHERE id = ?",
        [name, JSON.stringify(permissions), id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Role not found" });
      }

      res.status(200).json({ message: "Role updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update role" });
    }
  }
);

// Delete a role
router.delete(
  "/roles/:id",
  authenticateToken,
  checkPermission("role_management", "delete"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.execute("DELETE FROM roles WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete role" });
    }
  }
);

export default router;
