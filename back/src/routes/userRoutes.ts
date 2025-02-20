import express, { Request, Response } from 'express';
import db from '../db.js';
const router = express.Router();

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

export default router;