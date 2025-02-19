import express, { Request, Response } from 'express';
import db from '../db';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
      const pets = await db.all("SELECT * FROM pets");
      res.json(pets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pets" });
    }
});

export default router;