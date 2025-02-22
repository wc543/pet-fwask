import express from 'express';
import db from '../db.js';
const router = express.Router();
import { parseError, petBodySchema } from '../types.js';
// Get all pets
async function getPets(req, res) {
    try {
        const result = await db.all("SELECT * FROM Pets");
        return res.json({ pets: result });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch pets" });
    }
}
;
// Get pets by user -- username is sent in params, user_id is selected and used to find pet
async function getPetsByUser(req, res) {
    const { username } = req.params;
    try {
        const user = await db.get(`SELECT * FROM Users WHERE username = ?`, [username]);
        if (!user) {
            return res.status(400).json({ error: "Username does not exist" });
        }
        const user_id = user.user_id;
        const result = await db.all(`SELECT * FROM Pets WHERE created_by_id = ?`, [user_id]);
        if (!result) {
            return res.status(404).json({ message: "No pets created by this user" });
        }
        return res.json({ pets: result });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch pets by user" });
    }
}
;
// Get pet by id
async function getPetById(req, res) {
    const { id } = req.params;
    try {
        const result = await db.get("SELECT * FROM Pets WHERE pet_id = ?", [id]);
        if (!result) {
            return res.status(400).json({ error: "Pet does not exist" });
        }
        return res.json({ pets: result });
    }
    catch (error) {
        return res.status(404).json({ error: "Failed to fetch pet by id" });
    }
}
;
// Delete pet by id
async function deletePet(req, res) {
    const { id } = req.params;
    const result = await db.run("DELETE FROM Pets WHERE pet_id = ?", [id]);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Pet not found" });
    }
    return res.status(204).send();
}
;
// Post pet
async function postPet(req, res) {
    let parseResult = petBodySchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseError(parseResult.error) });
    }
    let { name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes } = parseResult.data;
    let dbResult;
    let result;
    let maxId;
    let newId;
    try {
        maxId = await db.get("SELECT MAX(pet_id) FROM Pets");
        if (!maxId) {
            newId = 1;
        }
        else {
            newId = (maxId["MAX(pet_id)"]) + 1;
        }
        dbResult = await db.run("INSERT INTO Pets(pet_id, name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [newId, name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes]);
        result = await db.get("SELECT * FROM Pets WHERE pet_id = ?", [newId]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ error: error.toString() });
    }
    return res.status(201).json(result);
}
;
// Edit (put) pet by id
async function editPet(req, res) {
    const { id } = req.params;
    let parseResult = petBodySchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ errors: parseError(parseResult.error) });
    }
    let { name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes } = parseResult.data;
    let result;
    try {
        result = await db.run("UPDATE Pets \
      SET name = ?, type = ?, breed = ?, size = ?, gender = ?, age = ?, color = ?, created_by_id = ?, fosterable = ?, pet_image_url = ?, shelter_time = ?, current_foster = ?, current_adopter = ?, notes = ? \
      WHERE pet_id = ?", [name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ error: error.toString() });
    }
    return res.status(201).json(result);
}
;
router.get('/', getPets);
router.get('/user/:username', getPetsByUser);
router.get('/id/:id', getPetById);
router.delete('/:id', deletePet);
router.post('/', postPet);
router.put('/:id', editPet);
export default router;
