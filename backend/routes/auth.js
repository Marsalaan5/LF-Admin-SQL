import multer from 'multer';
import express from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../server.js'; 
import { authenticateToken,isAdmin } from '../middleware/authMiddleware.js';
import path from 'path';

const router = express.Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extname) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed.'));
  }
});

router.post('/register', upload.single('image'), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  const { name, email, password, role = 'user' } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const [existingUser] = await pool.execute(
      'SELECT * FROM login WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      'INSERT INTO login (name, email, password, role, image, insert_time) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [name, email, hashedPassword, role, image]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const [userRows] = await pool.execute(
      'SELECT * FROM login WHERE email = ?',
      [email]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userRows[0];

 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ id: user.id, email: user.email,role:user.role},process.env.JWT_SECRET ,{ expiresIn: '1h' }
    );

    res.status(200).json({message: 'Login successful',token, result: { id: user.id, name: user.name, email: user.email,role:user.role }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await pool.execute('SELECT id, name, email,role FROM login');
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.put('/users/:id', authenticateToken,isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, password,role } = req.body;
  
  try {
    const [user] = await pool.execute('SELECT * FROM login WHERE id = ?', [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user[0].password;

    const [result] = await pool.execute(
      'UPDATE login SET name = ?, email = ?, password = ?,  role = ? WHERE id = ?',
      [name, email, hashedPassword,role, id, ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});


router.delete('/users/:id', authenticateToken,isAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
   
    const [result] = await pool.execute('DELETE FROM login WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});



export default router;
