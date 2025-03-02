import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
const router = express.Router();
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
import authMiddleware from '../authMiddleware.js';
router.get('/', async (req, res) => {
    try {
        const users = await db.all("SELECT * FROM Users");
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
router.get('/:id', async (req, res) => {
    const user_id = req.params.id;
    try {
        const users = await db.all("SELECT * FROM Users WHERE user_id = ?", [user_id]);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, // plaintext from the client
        address, state, city, zip_code, phone_number, date_of_birth, role // optional: defaults to 'ADOPTER' if not provided
         } = req.body;
        // Hash the password before storing
        const hashed_password = await bcrypt.hash(password, 10);
        // Insert into the Users table. Note: Adjust the SQL as needed.
        const result = await db.run(`INSERT INTO Users (first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role || 'ADOPTER']);
        // Retrieve newly created user
        const newUser = await db.get(`SELECT * FROM Users WHERE user_id = ?`, [result.lastID]);
        // Generate a JWT token for the new user
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
        const token = jwt.sign({ user_id: newUser.user_id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { user_id: newUser.user_id, username: newUser.username, role: newUser.role } });
    }
    catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Retrieve the user record by username
        const user = await db.get(`SELECT * FROM Users WHERE username = ?`, [username]);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate a JWT token that includes the user's ID and role
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { user_id: user.user_id, username: user.username, role: user.role } });
    }
    catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await db.get('SELECT user_id, username, email, role FROM Users WHERE user_id = ?', [req.user.user_id]);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});
export default router;
