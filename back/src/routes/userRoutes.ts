import express, { Request, Response } from 'express';
import db from '../db';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
      const users = await db.all("SELECT * FROM Users");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
});

export default router;