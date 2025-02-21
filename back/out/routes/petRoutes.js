import express from 'express';
import db from '../db.js';
const router = express.Router();
// Get all pets
async function getPets(req, res) {
    try {
        const pets = await db.all("SELECT * FROM Pets");
        res.json(pets);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch pets" });
    }
}
;
// Get pets by user -- username is sent in params, user_id is selected and used to find pet
async function getPetsByUser(req, res) {
    const { username } = req.params;
    try {
        let user = await db.get(`SELECT * FROM Users WHERE username = ?`, [username]);
        if (!user) {
            res.status(400).json({ error: "Username does not exist" });
        }
        console.log("user", user);
        const user_id = user.user_id;
        console.log("id", user_id);
        const pets = await db.all(`SELECT * FROM Pets WHERE created_by_id = ?`, [user_id]);
        console.log("pets", pets);
        res.json(pets);
        if (!pets) {
            res.status(404).json({ message: "No pets created by this user" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch pets by user" });
    }
}
;
router.get('/', getPets);
router.get('/user/:username', getPetsByUser);
export default router;
