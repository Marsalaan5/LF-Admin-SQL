import multer from "multer";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { pool, io } from "../server.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
import moduleConfig from "../config/moduleConfig.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { createUser } from "../controller/userController.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Parser } from "json2csv";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import Joi from "joi";
import nodemailer from "nodemailer";
import getAllowedRegistrationRoles from "../services/roleServices.js";
import Handlebars from "handlebars";
import {
  transporter,
  renderTemplate,
  sendComplaintEmail,
} from "../mail/mailer.js";
// import createNotification from "../services/notificationService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory.");
}

//image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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

function organizeMenu(menuItems, parentId = null) {
  return menuItems
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: organizeMenu(menuItems, item.id),
    }));
}

const createNotification = async (userId,type, message, relatedEntity, entityId) => {
  try {

// const userId = req.user?.id;


    await pool.execute(
      "INSERT INTO notifications (user_id,type, message, related_entity, entity_id) VALUES (?,?, ?, ?, ?)",
      [userId,type, message, relatedEntity, entityId]
    );

    const notification = {
      userId,
      type,
      message,
      relatedEntity,
      entityId,
      created_at: new Date(),
    };
    io.emit("new-notification", notification);
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

const logAudit = async (
  // adminId,
  action,
  recordId = null,
  oldData = null,
  newData = null
) => {
  try {
    console.log("Logging audit:", {
      // adminId,
      action,
      recordId,
      oldData,
      newData,
    });
    await pool.execute(
      "INSERT INTO audit_log (action, record_id, old_data, new_data) VALUES (?, ?, ?, ?)",
      [
        // adminId,
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

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+"))
    .required(),
  mobile: Joi.string()
    .pattern(/^\d{10}$/)
    .optional(),
  role: Joi.string()
    .valid("user", "admin", "super admin", "viewer", "Water", "CCMS")
    .insensitive()
    .required()
    .default("user"),
  status: Joi.string().valid("active", "inactive").default("active"),
}).prefs({ convert: true });

// const loginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });

router.use("/uploads", express.static(uploadDir));
// GET /modules
router.get("/modules", (req, res) => {
  res.json(moduleConfig);
});

// //register
// router.post("/register",authenticateToken,createUser, upload.single("image"), async (req, res) => {
//   if (req.fileValidationError) {
//     return res.status(400).json({ message: req.fileValidationError });
//   }

//   const { error, value } = registerSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//   const { name, email, password, role = "user", status = "active" } = req.body;
//   const image = req.file ? req.file.path : null;
//   const token = req.headers.authorization?.split(" ")[1];

//   try {
//     const [roleResult] = await pool.execute(
//       "SELECT id FROM roles WHERE name = ?",
//       [role]
//     );

//     if (roleResult.length === 0) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     const roleId = roleResult[0].id;

//     const [existingUser] = await pool.execute(
//       "SELECT * FROM login WHERE email = ?",
//       [email]
//     );

//     if (existingUser.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const [result] = await pool.execute(
//       "INSERT INTO login (name, email, password, role_id, role, image, insert_time, status) VALUES (?, ?, ?, ?,?, ?, CURRENT_TIMESTAMP, ?)",
//       [name, email, hashedPassword, roleId, role, image, status]
//     );
//     console.log("Audit INSERT result:", result);

//     io.emit("new-signup", { name, email });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const adminId = decoded.id;
//     await logAudit(adminId, "INSERT", result.insertId, null, {
//       name,
//       email,
//       role_id: roleId,
//       role,
//       image,
//       status,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       userId: result.insertId,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

//main register.js

router.post(
  "/register",
  // authenticateToken,
  upload.single("image"),
  async (req, res) => {

    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      name,
      email,
      password,
      mobile,
      role = "user",
      status = "active",
    } = value;
    const image = req.file ? req.file.path : null;
    // const token = req.headers.authorization?.split(" ")[1];

    try {
      // Check if role is valid
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
        return res.status(409).json({ message: "User already exists" });
      }

      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user
      const [result] = await pool.execute(
        "INSERT INTO login (name, email, password,mobile, role_id, role, image, insert_time, status) VALUES (?, ?,?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
        [name, email, hashedPassword, mobile, roleId, role, image, status]
      );

      io.emit("new-signup", { name, email });

      await createNotification(
 "New User Registered",
  
  "A new user has been registered.",
  "user",
   result.insertId,
);

      // Audit log
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // const adminId = decoded.id;
      await logAudit("INSERT", result.insertId, null, {
        name,
        email,
        mobile,
        role_id: roleId,
        role,
        image,
        status,
      });

      // Respond
      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    } catch (err) {
      console.error("User registration error:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/public-roles", (req, res) => {
  const publicRoles = [
    {
      id: "Water",
      label: "Water Department",
      image: "/register/meter.png",
      backgroundImage: "/register/water.jpg",
      quote: "Managing urban water needs made smarter.",
      author: "Xyz, Water Admin",
    },
    {
      id: "CCMS",
      label: "City Control Mgmt",
      image: "/register/ccms.jpg",
      backgroundImage: "/register/ccms.jpg",
      quote: "Smarter cities start with smarter control systems.",
      author: "Xyz, CCMS Admin",
    },
    {
      id: "User",
      label: "User",
      image: "/register/user.jpg",
      backgroundImage: "/register/user.avif",
      quote: "Citizen voices matter – and now they’re heard.",
      author: "Xyz, Resident",
    },
  ];
  res.json(publicRoles);
});

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     //  const { error, value } = loginSchema.validate(req.body);
//     // if (error) {
//     //   return res.status(400).json({ message: 'Invalid email or password' });
//     // }

//     const [userRows] = await pool.execute(
//       "SELECT * FROM login WHERE email = ?",
//       [email]
//     );

//     if (userRows.length === 0) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const user = userRows[0];

//     if (user.status !== "active") {
//       return res.status(403).json({ message: "Your account is inactive." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const roleId = user.role_id;

//     const token = jwt.sign(
//       { id: user.id, email: user.email, mobile:user.mobile, role: user.role, role_id: roleId },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Fetch permissions based on the user's role_id
//     const [permissionRows] = await pool.execute(
//       "SELECT permissions FROM roles WHERE id = ?",
//       [roleId]
//     );

//     let permissions = {};
//     if (permissionRows.length > 0) {
//       try {
//         permissions = JSON.parse(permissionRows[0].permissions || "{}");
//       } catch (error) {
//         console.error("Error parsing permissions JSON:", error);
//         permissions = {};
//       }
//     }

//     const now = new Date();

//     await pool.execute(
//       "UPDATE login SET token = ?, last_login = ? WHERE id = ?",
//       [token, now, user.id]
//     );

//     await logAudit(user.id, "LOGIN", user.id, null, {
//       login_time: now,
//       role_id: roleId,
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       result: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//         role_id: roleId,
//         last_login: now,
//       },
//       permissions,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body; // accept role from client

  try {
    const [userRows] = await pool.execute(
      "SELECT * FROM login WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userRows[0];

    if (user.status !== "active") {
      return res.status(403).json({ message: "Your account is inactive." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // if (role !== user.role) {
    //   return res.status(403).json({ message: "Incorrect role selected" });
    // }

    // Only check role if it's provided and not "Other"
    // if (role && role !== "Other" && role !== user.role) {
    //   return res.status(403).json({ message: "Incorrect role selected" });
    // }

    // If user role is Water or CCMS
    if (user.role === "Water" || user.role === "CCMS") {
      // Then role from client must exactly match user.role
      if (role !== user.role) {
        return res.status(403).json({ message: "Incorrect role selected" });
      }
    } else {
      // For other user roles:
      // role can be "Other" or null or match user.role
      if (role && role !== "Other" && role !== user.role) {
        return res.status(403).json({ message: "Incorrect role selected" });
      }
    }

    const roleId = user.role_id;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        role_id: roleId,
      },
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
        mobile: user.mobile,
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

//  password reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.execute("SELECT * FROM login WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(400).json({ message: "No user found with that email" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await pool.execute(
      "UPDATE login SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//  password with token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const [users] = await pool.execute(
      "SELECT * FROM login WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "UPDATE login SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, users[0].id]
    );

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//routes for profile

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await pool.execute(
      "SELECT id, name, email,mobile, image FROM login WHERE id = ?",
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

// router.put("/profile", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, email, password,mobile } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ message: "Name and email are required" });
//     }

//     const [existingUser] = await pool.execute(
//       "SELECT * FROM login WHERE id = ?",
//       [userId]
//     );
//     if (existingUser.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const hashedPassword = password
//       ? await bcrypt.hash(password, 10)
//       : existingUser[0].password;

//     await pool.execute(
//       "UPDATE login SET name = ?, email = ?, password = ?, mobile = ?  WHERE id = ?",
//       [name, email, hashedPassword,mobile, userId]
//     );

//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (err) {
//     console.error("Profile update error:", err);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// });

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, mobile } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Optional: Validate mobile format here if needed
    // e.g., if (mobile && !isValidMobile(mobile)) return res.status(400)...

    // Check if user exists
    const [existingUser] = await pool.execute(
      "SELECT * FROM login WHERE id = ?",
      [userId]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already used by another user
    const [emailExists] = await pool.execute(
      "SELECT id FROM login WHERE email = ? AND id != ?",
      [email, userId]
    );
    if (emailExists.length > 0) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Hash new password if provided, otherwise keep existing password hash
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : existingUser[0].password;

    // Update user profile with correct parameters order
    await pool.execute(
      "UPDATE login SET name = ?, email = ?, password = ?, mobile = ? WHERE id = ?",
      [name, email, hashedPassword, mobile, userId]
    );

    // Fetch updated user info to send back
    const [updatedUser] = await pool.execute(
      "SELECT id, name, email, mobile, image FROM login WHERE id = ?",
      [userId]
    );

    res.status(200).json(updatedUser[0]);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

//dashboard route

router.get(
  "/dashboard/stats",
  authenticateToken,
  checkPermission("dashboard", "enable", "view"),
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
  checkPermission("user_management", "enable", "view"),
  async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [users] = await pool.execute(
        "SELECT id, name, email,mobile,role_id,role,image,status FROM login"
      );
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

router.get("/users/:id", authenticateToken, isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);

  // Basic input validation
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email,mobile, role_id, role, image, status, insert_time AS insertTime, 
              last_login AS lastLogin 
       FROM login 
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

router.post(
  "/users",
  checkPermission("user_management", "enable", "create"),
  async (req, res) => {}
);

router.put(
  "/users/:id",
  authenticateToken,
  checkPermission("user_management", "enable", "edit"),
  async (req, res) => {
    const { id } = req.params;
    const { name, email, password, mobile, role_id, role, image, status } =
      req.body;
    console.log("Received data for update:", {
      name,
      email,
      mobile,
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
        "UPDATE login SET name = ?, email = ?,password = ?,mobile = ?,  role_id = ?, role = ?, image = ?, status = ? WHERE id = ?",
        [name, email, hashedPassword, mobile, roleId, role, image, status, id]
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
        mobile,
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
  checkPermission("user_management", "enable", "delete"),
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

      await logAudit(adminId, "DELETE", id, oldData, null);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);

// GET /auth/status-options
router.get("/status-options", authenticateToken, (req, res) => {
  res.json(["active", "inactive"]);
});

// Search users by name or role
router.get("/search", authenticateToken, async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm || searchTerm.trim() === "") {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const [results] = await pool.execute(
      `SELECT id, name, email,mobile, role, role_id, image, status
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
  checkPermission("user_management", "enable", "export"),
  async (req, res) => {
    try {
      const [users] = await pool.execute(
        "SELECT id, name, email,mobile, role, status FROM login"
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
  checkPermission("role_management", "enable", "view"),
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
  checkPermission("role_management", "enable", "view"),
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
  checkPermission("role_management", "enable", "create"),
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
        [name, JSON.stringify(permissions)]
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
  checkPermission("role_management", "enable", "edit"),
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
  checkPermission("role_management", "enable", "delete"),
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

// menu route

router.get(
  "/menu",
  authenticateToken,
  checkPermission("menu_management", "enable", "view"),
  async (req, res) => {
    const userRole = req.query.role;
    const showAll = req.query.showAll === "true";

    let query = `
    SELECT id, path, icon, title, roles, parent_id, status, time, order_by
    FROM menu_items
    WHERE FIND_IN_SET(?, roles) > 0
  `;

    if (!showAll) {
      query += ` AND status = 'active'`;
    }

    query += ` ORDER BY order_by ASC`;

    try {
      const [results] = await pool.execute(query, [userRole]);
      const organizedMenu = organizeMenu(results);

      res.json(organizedMenu);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/menu",
  authenticateToken,
  checkPermission("menu_management", "enable", "create"),
  async (req, res) => {
    const { title, path, icon, roles, parent_id, status, order_by } = req.body;

    const query = `INSERT INTO menu_items(title,path,icon,roles,parent_id,status,order_by,time)
  VALUES(?,?,?,?,?,?,?,NOW())
  `;

    try {
      const [result] = await pool.execute(query, [
        title,
        path,
        icon,
        roles,
        parent_id || null,
        status,
        order_by || 0,
      ]);
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error("Error adding menu item:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/reorder",
  authenticateToken,
  checkPermission("menu_management", "enable", "edit"),
  async (req, res) => {
    const { menu } = req.body;

    if (!Array.isArray(menu)) {
      return res.status(400).json({ error: "Invalid menu format" });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update each menu item's `order_by` based on new index
      for (let index = 0; index < menu.length; index++) {
        const item = menu[index];
        await connection.execute(
          `UPDATE menu_items SET order_by = ? WHERE id = ?`,
          [index, item.id]
        );
      }

      await connection.commit();
      res.status(200).json({ message: "Menu order updated successfully" });
    } catch (err) {
      await connection.rollback();
      console.error("Error reordering menu:", err);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      connection.release();
    }
  }
);

router.put(
  "/menu/:id",
  authenticateToken,
  checkPermission("menu_management", "enable", "edit"),
  async (req, res) => {
    const { title, path, icon, roles, parent_id, status, order_by } = req.body;
    const { id } = req.params;

    const query = `
  UPDATE menu_items
  SET title = ? , path = ?,icon=?,roles =?,parent_id = ?,status =?,order_by = ?
  WHERE id = ?
  `;

    try {
      await pool.execute(query, [
        title,
        path,
        icon,
        roles,
        parent_id || null,
        status,
        order_by || 0,
        id,
      ]);
      res.status(200).json({ message: "Menu item updated" });
    } catch (err) {
      console.error("Error updating menu item:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/menu/:id",
  authenticateToken,
  checkPermission("menu_management", "enable", "delete"),
  async (req, res) => {
    const { id } = req.params;
    try {
      await pool.execute(`DELETE FROM menu_items WHERE id = ?`, [id]);
    } catch (err) {
      console.error("Error deleting menu items:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch("/menu/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.execute(`UPDATE menu_items SET status = ? WHERE id = ?`, [
      status,
      id,
    ]);
    res.status(200).json({ message: `Menu item status set to ${status}` });
  } catch (err) {
    console.error("Error updating menu item status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//categories

// router.get(
//   "/categories",
//   authenticateToken,
//   checkPermission("category", "enable", "view"),
//   async (req, res) => {
//     try {
//       const [rows] = await pool.execute("SELECT * FROM category");
//       res.json(rows);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       res.status(500).send("Server Error");
//     }
//   }
// );

//category api

// Get all categories
router.get(
  "/categories",
  authenticateToken,
  checkPermission("category", "enable", "view"),
  async (req, res) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM category");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send("Server Error");
    }
  }
);

router.get(
  "/categories/:categoryId",
  authenticateToken,
  checkPermission("category", "enable", "view"),
  async (req, res) => {
    const { categoryId } = req.params;
    try {
      const [rows] = await pool.execute("SELECT * FROM category WHERE id = ?", [
        categoryId,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).send("Server Error");
    }
  }
);

// Create category
router.post(
  "/categories",
  authenticateToken,
  checkPermission("category", "enable", "create"),
  async (req, res) => {
    const { category_name, description } = req.body;

    if (!category_name || !description) {
      return res
        .status(400)
        .json({ error: "Category name and description are required." });
    }

    try {
      const [result] = await pool.execute(
        "INSERT INTO category (category_name, description) VALUES (?, ?)",
        [category_name, description]
      );
      res.status(201).json({ id: result.insertId, category_name, description });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Error creating category" });
    }
  }
);

// Update category
router.put(
  "/categories/:id",
  authenticateToken,
  checkPermission("category", "enable", "edit"),
  async (req, res) => {
    const { id } = req.params;
    const { category_name, description } = req.body;

    if (!category_name || !description) {
      return res
        .status(400)
        .json({ error: "Category name and description are required." });
    }

    try {
      const [result] = await pool.execute(
        "UPDATE category SET category_name = ?, description = ? WHERE id = ?",
        [category_name, description, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ message: "Category updated", id, category_name, description });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Error updating category" });
    }
  }
);

// Delete category
router.delete(
  "/categories/:id",
  authenticateToken,
  checkPermission("category", "enable", "delete"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.execute("DELETE FROM category WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Error deleting category" });
    }
  }
);

// subcategory api

router.get(
  "/subcategories",
  authenticateToken,
  checkPermission("subcategory", "enable", "view"),
  async (req, res) => {
    const { categoryId } = req.params;
    // console.log("Category ID:", categoryId);

    try {
      const [rows] = await pool.execute("SELECT * FROM subcategory", []);

      res.json(rows);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).send("Server Error");
    }
  }
);

router.get(
  "/categories/:categoryId/subcategories",
  authenticateToken,
  checkPermission("subcategory", "enable", "view"),
  async (req, res) => {
    const { categoryId } = req.params;
    // console.log("Category ID:", categoryId);

    try {
      const [rows] = await pool.execute(
        "SELECT * FROM subcategory WHERE category_id = ?",
        [categoryId]
      );

      res.json(rows);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).send("Server Error");
    }
  }
);

// Create a subcategory
router.post(
  "/categories/:categoryId/subcategories",
  authenticateToken,
  checkPermission("subcategory", "enable", "create"),
  async (req, res) => {
    const { categoryId } = req.params;
    const { subcategory_name, description } = req.body;

    if (!subcategory_name || !description) {
      return res
        .status(400)
        .json({ error: "Subcategory name and description are required." });
    }

    try {
      const [result] = await pool.execute(
        "INSERT INTO subcategory (category_id, subcategory_name, description) VALUES (?, ?, ?)",
        [categoryId, subcategory_name, description]
      );
      res.status(201).json({
        id: result.insertId,
        subcategory_name,
        description,
        category_id: categoryId,
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      res.status(500).json({ error: "Error creating subcategory" });
    }
  }
);

// Update a subcategory
router.put(
  "/subcategories/:id",
  authenticateToken,
  checkPermission("subcategory", "enable", "edit"),
  async (req, res) => {
    const { id } = req.params;
    const { subcategory_name, description } = req.body;

    if (!subcategory_name || !description) {
      return res
        .status(400)
        .json({ error: "Subcategory name and description are required." });
    }

    try {
      const [result] = await pool.execute(
        "UPDATE subcategory SET subcategory_name = ?, description = ? WHERE id = ?",
        [subcategory_name, description, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      res.json({
        message: "Subcategory updated",
        id,
        subcategory_name,
        description,
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({ error: "Error updating subcategory" });
    }
  }
);

router.put(
  "/categories/:categoryId/subcategories/:id",
  authenticateToken,
  checkPermission("subcategory", "enable", "edit"),
  async (req, res) => {
    const { id } = req.params;
    const { subcategory_name, description } = req.body;

    if (!subcategory_name || !description) {
      return res
        .status(400)
        .json({ error: "Subcategory name and description are required." });
    }

    try {
      const [result] = await pool.execute(
        "UPDATE subcategory SET subcategory_name = ?, description = ? WHERE id = ?",
        [subcategory_name, description, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      res.json({
        message: "Subcategory updated",
        id,
        subcategory_name,
        description,
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({ error: "Error updating subcategory" });
    }
  }
);

// Delete a subcategory
router.delete(
  "/subcategories/:id",
  authenticateToken,
  checkPermission("subcategory", "enable", "delete"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.execute(
        "DELETE FROM subcategory WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({ error: "Error deleting subcategory" });
    }
  }
);

//complaints

// router.get(
//   "/complaints",
//   authenticateToken,
//   checkPermission("complaint_management", "enable", "view"),
//   async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const role = req.user.role;

//       let query = `
//         SELECT
//           c.*,
//           cat.category_name,
//           sub.subcategory_name
//         FROM complaints c
//         LEFT JOIN category cat ON c.categories = cat.id
//         LEFT JOIN subcategory sub ON c.subcategory = sub.id`;
//       const params = [];

//       if (role !== "Super Admin" && role !== "Admin") {
//         query += ` WHERE c.user_id = ?`;
//         params.push(userId);
//       }

//       query += ` ORDER BY c.created_at DESC`;

//       const [rows] = await pool.execute(query, params);

//       res.status(200).json(rows);
//     } catch (err) {
//       console.error("Error fetching complaints:", err);
//       res.status(500).json({ message: "Error retrieving complaints" });
//     }
//   }
// );

router.get(
  "/complaints",
  authenticateToken,
  checkPermission("complaint_management", "enable", "view"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const { priority } = req.query; // <-- new param

      let query = `
        SELECT 
          c.*, 
          cat.category_name, 
          sub.subcategory_name 
        FROM complaints c
        LEFT JOIN category cat ON c.categories = cat.id
        LEFT JOIN subcategory sub ON c.subcategory = sub.id`;
      const params = [];

      let conditions = [];

      if (role !== "Super Admin" && role !== "Admin") {
        conditions.push(`c.user_id = ?`);
        params.push(userId);
      }

      if (priority) {
        conditions.push(`c.priority = ?`);
        params.push(priority);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += ` ORDER BY c.created_at DESC`;

      const [rows] = await pool.execute(query, params);

      res.status(200).json(rows);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      res.status(500).json({ message: "Error retrieving complaints" });
    }
  }
);

router.get(
  "/complaints/status-options",
  authenticateToken,
  checkPermission("complaint_management", "enable", "view"),
  async (req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT COLUMN_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'complaints' AND COLUMN_NAME = 'status'
      `);

      if (rows.length === 0) {
        return res.status(500).json({ message: "Status column not found" });
      }

      const enumStr = rows[0].COLUMN_TYPE;
      const matches = enumStr.match(/enum\((.*)\)/i);

      if (!matches) {
        return res.status(500).json({ message: "Could not parse ENUM values" });
      }

      const values = matches[1]
        .split(",")
        .map((val) => val.trim().replace(/^'(.*)'$/, "$1"))
        .map((status, idx) => ({ id: idx + 1, status }));

      res.status(200).json(values);
    } catch (err) {
      console.error("Error fetching status options:", err);
      res.status(500).json({ message: "Error retrieving status options" });
    }
  }
);

router.get(
  "/complaints/:id",
  authenticateToken,
  checkPermission("complaint_management", "enable", "view"),
  async (req, res) => {
    const complaintId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    try {
      let query = `
        SELECT 
          c.*, 
          cat.category_name, 
          sub.subcategory_name, 
          u.name AS assigned_to_name
        FROM complaints c
        LEFT JOIN category cat ON c.categories = cat.id
        LEFT JOIN subcategory sub ON c.subcategory = sub.id
        LEFT JOIN login u ON c.assigned_to = u.id
        WHERE c.id = ?
      `;
      const params = [complaintId];

      if (role !== "Super Admin" && role !== "Admin") {
        query += ` AND c.user_id = ?`;
        params.push(userId);
      }

      const [rows] = await pool.execute(query, params);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      res.status(200).json(rows[0]);
    } catch (err) {
      console.error("Error fetching complaint:", err);
      res.status(500).json({ message: "Error retrieving complaint" });
    }
  }
);

router.post(
  "/complaints",
  upload.single("image"),
  authenticateToken,
  checkPermission("complaint_management", "enable", "create"),
  async (req, res) => {
    try {
      const {
        categories,
        subcategory,
        description,
        mobile,
        address,
        latitude: latRaw,
        longitude: longRaw,
        priority: priorityRaw,
      } = req.body;

      const priority = ["Low", "Medium", "High"].includes(priorityRaw)
        ? priorityRaw
        : "Medium";

      const image = req.file ? req.file.filename : null;
      const userId = req.user.id;

      // Fetch full user details including name
      const [userRows] = await pool.execute(
        "SELECT name, email FROM login WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = {
        name: userRows[0].name,
        email: userRows[0].email,
      };

      const latitude =
        latRaw !== undefined && latRaw !== "" ? parseFloat(latRaw) : null;
      const longitude =
        longRaw !== undefined && longRaw !== "" ? parseFloat(longRaw) : null;

      const sanitize = (val) => (val === undefined || val === "" ? null : val);

      const categoryId =
        categories && categories !== "" ? parseInt(categories) : null;
      const subcategoryId =
        subcategory && subcategory !== "" ? parseInt(subcategory) : null;

      const [categoryRows] = await pool.execute(
        "SELECT id, category_name FROM category WHERE id = ?",
        [categoryId]
      );
      if (categoryRows.length === 0) {
        return res.status(400).json({ message: "Invalid category selected." });
      }
      const categoryName = categoryRows[0].category_name;

      const [subRows] = await pool.execute(
        "SELECT id FROM subcategory WHERE category_id = ?",
        [categoryId]
      );

      if (subRows.length > 0 && !subcategoryId) {
        return res.status(400).json({
          message: "Subcategory is required for the selected category.",
        });
      }

      if (subcategoryId) {
        const [validSub] = await pool.execute(
          "SELECT id FROM subcategory WHERE id = ? AND category_id = ?",
          [subcategoryId, categoryId]
        );

        if (validSub.length === 0) {
          return res
            .status(400)
            .json({ message: "Invalid subcategory for selected category." });
        }
      }



      // Prepare the database parameters
      const params = [
        userId,
        sanitize(mobile),
        sanitize(address),
        categoryId,
        subcategoryId,
        sanitize(description),
        image || null,
        "pending",
        priority,
        latitude,
        longitude,
      ];

      const [insertResult] = await pool.execute(
        `INSERT INTO complaints 
          (user_id, mobile, address, categories, subcategory, description, image, status, priority, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

    const complaintId = insertResult.insertId;



await createNotification(
 "New Complaint Registered",
  
  `A new complaint has been registered with Ticket #${complaintId} in category: ${categoryName}.`,
  "complaint",
  complaintId,
  userId
);
      let templateName;
      let subject;

      switch (categoryName.toLowerCase()) {
        case "water":
          templateName = "complaintWater";
          subject = `Water Complaint Registered - Ticket #${complaintId}`;
          break;
        case "ccms":
          templateName = "complaintCCMS";
          subject = `Complaint Registered - Ticket #${complaintId}`;
          break;
        default:
          templateName = "complaintOther";
          subject = `Your Complaint Has Been Registered - Ticket #${complaintId}`;
      }

      const emailHtml = renderTemplate(templateName, {
        userName: user.name,
        ticketId: complaintId,
        categoryName: categoryName,
        description: description,
      });

      await transporter.sendMail({
        from: `Support Team <${process.env.EMAIL_ID}>`,
        to: user.email,
        subject,
        html: emailHtml,
      });

      res.status(200).json({
        id: complaintId,
        user_id: userId,
        mobile,
        address,
        categories: categoryId,
        subcategory: subcategoryId,
        description,
        image,
        status: "pending",
        priority,
        latitude,
        longitude,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Error inserting complaint:", err);
      res.status(500).json({ message: "Error saving complaint" });
    }
  }
);

// router.post(
//   "/complaints",
//   upload.single("image"),
//   authenticateToken,
//   checkPermission("complaint_management", "enable", "create"),
//   async (req, res) => {
//     try {
//       const {
//         categories,
//         subcategory,
//         description,
//         mobile,
//         address,
//         latitude: latRaw,
//         longitude: longRaw,
//          priority: priorityRaw,
//       } = req.body;

//       const priority = ['Low', 'Medium', 'High'].includes(priorityRaw) ? priorityRaw : 'Medium';

//       const image = req.file ? req.file.filename : null;
//       const userId = req.user.id;

//       // Fetch full user details including name
// const [userRows] = await pool.execute(
//   "SELECT name, email FROM login WHERE id = ?",
//   [userId]
// );

// if (userRows.length === 0) {
//   return res.status(404).json({ message: "User not found." });
// }

// const user = {
//   name: userRows[0].name,
//   email: userRows[0].email,
// };

//       const latitude =
//         latRaw !== undefined && latRaw !== "" ? parseFloat(latRaw) : null;
//       const longitude =
//         longRaw !== undefined && longRaw !== "" ? parseFloat(longRaw) : null;

//       const sanitize = (val) => (val === undefined || val === "" ? null : val);

//       const categoryId =
//         categories && categories !== "" ? parseInt(categories) : null;
//       const subcategoryId =
//         subcategory && subcategory !== "" ? parseInt(subcategory) : null;

//       const [categoryRows] = await pool.execute(
//         "SELECT id, category_name FROM category WHERE id = ?",
//         [categoryId]
//       );
//       if (categoryRows.length === 0) {
//         return res.status(400).json({ message: "Invalid category selected." });
//       }
//       const categoryName = categoryRows[0].category_name;

//       const [subRows] = await pool.execute(
//         "SELECT id FROM subcategory WHERE category_id = ?",
//         [categoryId]
//       );

//       if (subRows.length > 0 && !subcategoryId) {
//         return res
//           .status(400)
//           .json({
//             message: "Subcategory is required for the selected category.",
//           });
//       }

//       if (subcategoryId) {
//         const [validSub] = await pool.execute(
//           "SELECT id FROM subcategory WHERE id = ? AND category_id = ?",
//           [subcategoryId, categoryId]
//         );

//         if (validSub.length === 0) {
//           return res
//             .status(400)
//             .json({ message: "Invalid subcategory for selected category." });
//         }
//       }

//       // Prepare the database parameters
//       const params = [
//         userId,
//         sanitize(mobile),
//         sanitize(address),
//         categoryId,
//         subcategoryId,
//         sanitize(description),
//         image || null,
//         "pending",
//         latitude,
//         longitude,
//           priority,
//       ];

//       const [insertResult] = await pool.execute(
//         `INSERT INTO complaints
//           (user_id, mobile, address, categories, subcategory, description, image, status,priority,latitude, longitude)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
//         params
//       );

//       const complaintId = insertResult.insertId;

// // console.log("req.user:", req.user);

//       // const user = { name: req.user.name, email: req.user.email };

//         let templateName;
//       let subject;

//       switch (categoryName.toLowerCase()) {
//         case "water":
//           templateName = "complaintWater";
//           subject = `Water Complaint Registered - Ticket #${complaintId}`;
//           break;
//         case "ccms":
//           templateName = "complaintCCMS";
//           subject = `Complaint Registered - Ticket #${complaintId}`;
//           break;
//         default:
//           templateName = "complaintOther";
//           subject = `Your Complaint Has Been Registered - Ticket #${complaintId}`;
//       }

// const emailHtml = renderTemplate(templateName, {
//   userName: user.name,
//   ticketId: complaintId,
//   categoryName: categoryName,
//   description: description,
// });

//       await transporter.sendMail({
//         from: `Support Team <${process.env.EMAIL_ID}>`,
//         to: user.email,
//         subject: `Your Complaint Has Been Registered - Ticket #${complaintId}`,
//         html: emailHtml,
//       });

//       res.status(200).json({
//         id: complaintId,
//         user_id: userId,
//         mobile,
//         address,
//         categories: categoryId,
//         subcategory: subcategoryId,
//         description,
//         image,
//         status: "pending",
//         priority,
//         latitude,
//         longitude,
//         createdAt: new Date(),
//       });
//     } catch (err) {
//       console.error("Error inserting complaint:", err);
//       res.status(500).json({ message: "Error saving complaint" });
//     }
//   }
// );

// router.put("/complaints/:id/priority", authenticateToken, checkPermission("complaint_management", "enable", "update"), async (req, res) => {
//   const complaintId = req.params.id;
//   const { priority } = req.body;  // New priority value

//   const validPriorities = ['Low', 'Medium', 'High'];

//   if (!validPriorities.includes(priority)) {
//     return res.status(400).json({ message: "Invalid priority value" });
//   }

//   try {
//     const [result] = await pool.execute(
//       `UPDATE complaints SET priority = ? WHERE id = ?`,
//       [priority, complaintId]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//      await createNotification('Priority Updated', `The priority for complaint ID: ${complaintId} has been updated to ${priority}.`, 'complaint', complaintId);

//     res.status(200).json({ message: "Priority updated", priority });
//   } catch (err) {
//     console.error("Error updating priority:", err);
//     res.status(500).json({ message: "Error updating priority" });
//   }
// });

router.put(
  "/complaints/:id/priority",
  authenticateToken,
  checkPermission("complaint_management", "enable", "update"),
  async (req, res) => {
    const complaintId = req.params.id;
    const { priority } = req.body;

    const validPriorities = ["Low", "Medium", "High"];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    try {
      const [result] = await pool.execute(
        `UPDATE complaints SET priority = ? WHERE id = ?`,
        [priority, complaintId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      await createNotification(
        "Priority Updated",
        `The priority for complaint ID: ${complaintId} has been updated to ${priority}.`,
        "complaint",
        complaintId
      );

      res.status(200).json({ message: "Priority updated", priority });
    } catch (err) {
      console.error("Error updating priority:", err);
      res.status(500).json({ message: "Error updating priority" });
    }
  }
);

router.put(
  "/complaints/:id/status",
  authenticateToken,
  checkPermission("complaint_management", "enable", "update"),
  async (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;

    try {
      // Fetch ENUM values from MySQL schema
      const [rows] = await pool.execute(`
        SELECT COLUMN_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'complaints' AND COLUMN_NAME = 'status'
      `);

      if (rows.length === 0) {
        return res.status(500).json({ message: "Status column not found" });
      }

      const enumStr = rows[0].COLUMN_TYPE;
      const matches = enumStr.match(/enum\((.*)\)/i);

      if (!matches) {
        return res.status(500).json({ message: "Could not parse ENUM values" });
      }

      const validStatuses = matches[1]
        .split(",")
        .map((val) => val.trim().replace(/^'(.*)'$/, "$1")); // remove quotes

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const [result] = await pool.execute(
        `UPDATE complaints SET status = ? WHERE id = ?`,
        [status, complaintId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      await pool.execute(
        `INSERT INTO activities (type, message, user_id) VALUES (?, ?, ?)`,
        [
          "assignment",
          `Complaint #${complaintId} status changed to ${status}` ,
          req.user.id,
        ]
      );

      res.status(200).json({ message: "Status updated", status });
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ message: "Error updating complaint status" });
    }
  }
);

// router.put(
//   "/complaints/:id/assign",
//   authenticateToken,
//   checkPermission("complaint_management", "enable", "update"),
//   async (req, res) => {
//     const complaintId = req.params.id;
//     const { assignedToId } = req.body;
//     const assignedBy = req.user.id;

//     try {
//       // Check if the user being assigned to exists and is admin/staff
//       const [userRows] = await pool.execute(
//         `SELECT id FROM login WHERE id = ? AND role IN ('Admin')`,
//         [assignedToId]
//       );
//       if (userRows.length === 0) {
//         return res.status(400).json({ message: "Invalid assignee" });
//       }

//       const [result] = await pool.execute(
//         `UPDATE complaints SET assigned_to = ?, assigned_by = ?, assigned_at = NOW() WHERE id = ?`,
//         [assignedToId, assignedBy, complaintId]
//       );

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Complaint not found" });
//       }

//       res.status(200).json({ message: "Complaint assigned successfully" });
//     } catch (err) {
//       console.error("Error assigning complaint:", err);
//       res.status(500).json({ message: "Failed to assign complaint" });
//     }
//   }
// );

router.put(
  "/complaints/:id/assign",
  authenticateToken,
  checkPermission("complaint_management", "enable", "update"),
  async (req, res) => {
    const complaintId = req.params.id;
    const { assignedToId } = req.body;
    const assignedBy = req.user.id;

    try {
      // Check if the user being assigned to exists and is admin/staff
      const [userRows] = await pool.execute(
        `SELECT id, name FROM login WHERE id = ? AND role IN ('Admin')`,
        [assignedToId]
      );
      if (userRows.length === 0) {
        return res.status(400).json({ message: "Invalid assignee" });
      }

      const assigneeName = userRows[0].name;

      const [result] = await pool.execute(
        `UPDATE complaints SET assigned_to = ?, assigned_by = ?, assigned_at = NOW() WHERE id = ?`,
        [assignedToId, assignedBy, complaintId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

    
      await pool.execute(
        `INSERT INTO activities (type, message, user_id) VALUES (?, ?, ?)`,
        [
          "assignment",
          `Complaint #${complaintId} assigned to ${assigneeName}`,
          assignedBy
        ]
      );

      res.status(200).json({ message: "Complaint assigned successfully" });
    } catch (err) {
      console.error("Error assigning complaint:", err);
      res.status(500).json({ message: "Failed to assign complaint" });
    }
  }
);


router.put(
  "/complaints/:id/feedback",
  authenticateToken,
  checkPermission("complaint_management", "enable", "update"),
  async (req, res) => {
    const complaintId = req.params.id;
    const userId = req.user.id;
    const { feedback, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    try {
      // Ensure complaint exists and belongs to the current user
      const [fetch] = await pool.execute(
        "SELECT user_id, status FROM complaints WHERE id = ?",
        [complaintId]
      );
      if (fetch.length === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      const c = fetch[0];
      if (c.user_id !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to give feedback" });
      }
      if (c.status !== "resolved") {
        return res
          .status(400)
          .json({ message: "Can only give feedback on resolved complaints" });
      }

      const [result] = await pool.execute(
        `UPDATE complaints
         SET feedback = ?, rating = ?, feedback_at = NOW()
         WHERE id = ?`,
        [feedback, rating, complaintId]
      );

      res.status(200).json({ message: "Feedback saved" });
    } catch (err) {
      console.error("Error saving feedback:", err);
      res.status(500).json({ message: "Error saving feedback" });
    }
  }
);

// complaint dasboard api

// router.get("/complaints/stats/count", authenticateToken, async (req, res) => {
//   const { period } = req.query; // 'day', 'week', 'month'
//   let groupBy = "DATE(created_at)";
//   if (period === "week") groupBy = "YEARWEEK(created_at)";
//   else if (period === "month") groupBy = "DATE_FORMAT(created_at, '%Y-%m')";

//   try {
//     const [rows] = await pool.execute(`
//       SELECT ${groupBy} AS period, COUNT(*) AS count
//       FROM complaints
//       GROUP BY ${groupBy}
//       ORDER BY ${groupBy}
//     `);
//     res.json(rows);
//   } catch (err) {
//     console.error("Stats error:", err);
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// });

// router.get("/complaints/stats/status", authenticateToken, async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`
//       SELECT status, COUNT(*) AS count
//       FROM complaints
//       GROUP BY status
//     `);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Error retrieving status stats" });
//   }
// });

// router.get(
//   "/complaints/stats/resolution-time",
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const [rows] = await pool.execute(`
//       SELECT 
//         DATE(created_at) AS date,
//         AVG(TIMESTAMPDIFF(HOUR, created_at, feedback_at)) AS avg_hours
//       FROM complaints
//       WHERE feedback_at IS NOT NULL
//       GROUP BY DATE(created_at)
//     `);
//       res.json(rows);
//     } catch (err) {
//       res.status(500).json({ message: "Error calculating resolution time" });
//     }
//   }
// );

// router.get(
//   "/complaints/stats/categories",
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const [rows] = await pool.execute(`
//       SELECT c.category_name, COUNT(*) AS count
//       FROM complaints cp
//       JOIN category c ON cp.categories = c.id
//       GROUP BY cp.categories
//       ORDER BY count DESC
//       LIMIT 5
//     `);
//       res.json(rows);
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching category stats" });
//     }
//   }
// );


router.get("/complaints/stats/count", authenticateToken, async (req, res) => {
  const userId = req.user.id;  // get user id from token
  const { period } = req.query;
  let groupBy = "DATE(created_at)";
  if (period === "week") groupBy = "YEARWEEK(created_at)";
  else if (period === "month") groupBy = "DATE_FORMAT(created_at, '%Y-%m')";

  try {
    const [rows] = await pool.execute(`
      SELECT ${groupBy} AS period, COUNT(*) AS count
      FROM complaints
      WHERE user_id = ?
      GROUP BY ${groupBy}
      ORDER BY ${groupBy}
    `, [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

router.get("/complaints/stats/status", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.execute(`
      SELECT status, COUNT(*) AS count
      FROM complaints
      WHERE user_id = ?
      GROUP BY status
    `, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving status stats" });
  }
});

router.get("/complaints/stats/resolution-time", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.execute(`
      SELECT 
        DATE(created_at) AS date,
        AVG(TIMESTAMPDIFF(HOUR, created_at, feedback_at)) AS avg_hours
      FROM complaints
      WHERE feedback_at IS NOT NULL AND user_id = ?
      GROUP BY DATE(created_at)
    `, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error calculating resolution time" });
  }
});

router.get("/complaints/stats/categories", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.execute(`
      SELECT c.category_name, COUNT(*) AS count
      FROM complaints cp
      JOIN category c ON cp.categories = c.id
      WHERE cp.user_id = ?
      GROUP BY cp.categories
      ORDER BY count DESC
      LIMIT 5
    `, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category stats" });
  }
});


// router.get("/notifications", authenticateToken, async (req, res) => {
//   try {
//     const [notifications] = await pool.execute(
//       "SELECT * FROM notifications ORDER BY created_at DESC"
//     );

//     // Send back the notifications
//     res.status(200).json(notifications);
//   } catch (err) {
//     console.error("Error fetching notifications:", err);
//     res.status(500).json({ message: "Failed to fetch notifications" });
//   }
// });



// router.get("/notifications", authenticateToken, async (req, res) => {
//   try {
//     // Limiting to the latest 5 notifications
//     const [notifications] = await pool.execute(
//       "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5"
//     );

//     // Send back the notifications
//     res.status(200).json(notifications);
//   } catch (err) {
//     console.error("Error fetching notifications:", err);
//     res.status(500).json({ message: "Failed to fetch notifications" });
//   }
// });


router.get('/notifications', authenticateToken, 
   checkPermission("complaint_management", "enable", "view"),
  async (req, res) => {
  try {
    
    const { role, userId } = req.user;

   
    let query = 'SELECT * FROM notifications';
    let queryParams = [];

    if (role !== 'Super Admin') {
    
      query += ' WHERE user_id = ?';
      queryParams = [userId];
    }
    const [notifications] = await pool.execute(query, queryParams);
    res.json(notifications);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});



router.put("/notifications/:id/read", authenticateToken, 
    checkPermission("complaint_management", "enable", "update"),
    async (req, res) => {
  const notificationId = req.params.id;

  try {
    const [result] = await pool.execute(
      "UPDATE notifications SET read = TRUE WHERE id = ?",
      [notificationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});



// GET /auth/recent-activities
router.get('/recent-activities', 
  //  checkPermission("recent_activity", "enable", "view"),
  authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let activitiesQuery = '';
    let params = [];

    if (user.role === 'Super Admin' || user.role === 'Admin') {
      activitiesQuery = `
        SELECT * FROM activities
        ORDER BY createdAt DESC
        LIMIT 20
      `;
    } else {
      activitiesQuery = `
        SELECT * FROM activities
        WHERE user_id = ?
        ORDER BY createdAt DESC
        LIMIT 20
      `;
      params = [user.id];
    }

    const [activities] = await pool.execute(activitiesQuery, params);
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ message: 'Failed to fetch recent activities.' });
  }
});


// router.get(
//   '/recent-activities',
//   authenticateToken,
//   checkPermission('recent_activity', 'enable', 'view'),
//   async (req, res) => {
//     try {
//       const user = req.user;

//       let activitiesQuery = '';
//       let params = [];

//       if (user.role === 'Super Admin' || user.role === 'Admin') {
//         activitiesQuery = `SELECT * FROM activities ORDER BY createdAt DESC LIMIT 20`;
//       } else {
//         activitiesQuery = `SELECT * FROM activities WHERE user_id = ? ORDER BY createdAt DESC LIMIT 20`;
//         params = [user.id];
//       }

//       const [activities] = await pool.execute(activitiesQuery, params);
//       res.status(200).json(activities);
//     } catch (error) {
//       console.error('Error fetching recent activities:', error);
//       res.status(500).json({ message: 'Failed to fetch recent activities.' });
//     }
//   }
// );






export default router;
