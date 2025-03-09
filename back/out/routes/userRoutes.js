import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
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
//Get user household fields to autofill when filling out a form
router.get('/userHouseholds', async (req, res) => {
    let userId = req.params.id;
    let householdResult;
    try {
        householdResult = await db.all('SELECT * FROM UserHousehold;');
        res.json(householdResult);
    }
    catch (err) {
        return res.status(500).json({ error: "failed to fetch user households" });
    }
    return res.json({ householdResult });
});
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, // plaintext from the client
        address, state, city, zip_code, phone_number, date_of_birth, role, // optional: defaults to 'ADOPTER' if not provided
        household_size, household_allergies, current_pets, } = req.body;
        // Hash the password before storing
        const hashed_password = await bcrypt.hash(password, 10);
        // Insert into the Users table. Note: Adjust the SQL as needed.
        const result = await db.run(`INSERT INTO Users (first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role || 'ADOPTER']);
        // Retrieve newly created user
        const newUser = await db.get(`SELECT * FROM Users WHERE user_id = ?`, [result.lastID]);
        // Insert into the UserHousehold table
        await db.run(`INSERT INTO UserHousehold (user_id, household_size, household_allergies, current_pets)
       VALUES (?, ?, ?, ?)`, [newUser.user_id, household_size, household_allergies, current_pets]);
        // Generate a JWT token for the new user
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
        const token = jwt.sign({ user_id: newUser.user_id, username: newUser.username, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
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
        const token = jwt.sign({ user_id: user.user_id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role } });
    }
    catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});
router.get('/me', async (req, res) => {
    try {
        // Get the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        // Extract the token from header (assumes "Bearer <token>")
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }
        // Verify the token directly in the endpoint
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded); // This should appear in the terminal
        // Check if the token has the user_id property
        if (!decoded || !decoded.user_id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        // Query the database for the user based on user_id from the token
        const user = await db.get('SELECT user_id, username, email, role FROM Users WHERE user_id = ?', [1]);
        console.log("Database query result:", user); // This should also log to the terminal
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return the user data
        res.json(user);
    }
    catch (error) {
        console.error("Error in /me endpoint:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/test-all', async (req, res) => {
    try {
        const users = await db.all("SELECT * FROM Users");
        console.log("Test-all endpoint, users:", users);
        res.json(users);
    }
    catch (error) {
        console.error("Error in test-all endpoint:", error);
        res.status(500).json({ message: "Error fetching all users" });
    }
});
export default router;
