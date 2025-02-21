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
        const user = await db.get(`SELECT * FROM Users WHERE username = ?`, [username]);
        if (!user) {
            res.status(400).json({ error: "Username does not exist" });
        }
        const user_id = user.user_id;
        const pets = await db.all(`SELECT * FROM Pets WHERE created_by_id = ?`, [user_id]);
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
// Get pet by id
async function getPetById(req, res) {
    const { id } = req.params;
    try {
        const pet = await db.get("SELECT * FROM Pets WHERE pet_id = ?", [id]);
        if (!pet) {
            res.status(400).json({ error: "Pet does not exist" });
        }
        res.json(pet);
    }
    catch (error) {
        res.status(404).json({ error: "Failed to fetch pet by id" });
    }
}
;
router.get('/', getPets);
router.get('/user/:username', getPetsByUser);
router.get('/id/:id', getPetById);
export default router;
