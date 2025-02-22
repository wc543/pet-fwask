import express, { Request, Response } from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
const router = express.Router();
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.get('/', async (req: Request, res: Response) => {
    try {
      const users = await db.all("SELECT * FROM Users");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
  const user_id = req.params.id;
  try {
    const users = await db.all("SELECT * FROM Users WHERE user_id = ?",
      [user_id]
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password, // plaintext from the client
      address,
      state,
      city,
      zip_code,
      phone_number,
      date_of_birth,
      role // optional: defaults to 'ADOPTER' if not provided
    } = req.body;
    
    // Hash the password before storing
    const hashed_password = await bcrypt.hash(password, 10);
    
    // Insert into the Users table. Note: Adjust the SQL as needed.
    const result = await db.run(
      `INSERT INTO Users (first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role || 'ADOPTER']
    );
    
    res.status(201).json({ message: 'User created successfully', userId: result.lastID });
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Retrieve the user record by email
    const user = await db.get(`SELECT * FROM Users WHERE email = ?`, [email]);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate a JWT token that includes the user's ID and role
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, user: { user_id: user.user_id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ message: 'Error signing in' });
  }
});

export default router;