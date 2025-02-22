import express, { Request, Response } from 'express';
import db from '../db.js';
const router = express.Router();
import { Pet, User } from '../types.js';

// Get all pets
async function getPets(req: Request, res: Response) {
  try {
    const result = await db.all("SELECT * FROM Pets") as Pet;
    res.json({ pets: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pets" });
  }
};

// Get pets by user -- username is sent in params, user_id is selected and used to find pet
async function getPetsByUser(req: Request, res: Response) {
  const { username } = req.params;
  try {
    const user = await db.get(`SELECT * FROM Users WHERE username = ?`, [username]);
    if (!user) {
      res.status(400).json({ error: "Username does not exist" });
    }
    const user_id = user.user_id;
    const result = await db.all(`SELECT * FROM Pets WHERE created_by_id = ?`, [user_id]);
    if (!result) {
      res.status(404).json({ message: "No pets created by this user" });
    }
    res.json({ pets: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pets by user" });
  }
};

// Get pet by id
async function getPetById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await db.get("SELECT * FROM Pets WHERE pet_id = ?", [id]);
    if (!result) {
      res.status(400).json({ error: "Pet does not exist" });
    }
    res.json({ pets: result });
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch pet by id" });
  }
};

// Delete pet by id
async function deletePet(req: Request, res: Response) {
  const { id } = req.params;
  const result = await db.run("DELETE FROM Pets WHERE pet_id = ?", [id]);
  if (result.changes === 0) {
    res.status(404).json({ error: "Pet not found" });
  }
  res.status(204).send();
};

router.get('/', getPets);
router.get('/user/:username', getPetsByUser);
router.get('/id/:id', getPetById);
router.delete('/:id', deletePet);

export default router;