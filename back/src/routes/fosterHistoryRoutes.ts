import express, { Request, Response } from 'express';
import db from '../db.js';
const router = express.Router();

router.get("/expiration/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const history = await db.all(
            `
            SELECT 
                p.pet_id,
                p.name,
                f.end_date
            FROM 
                Pets p
            JOIN 
                FosterHistory f ON p.pet_id = f.pet_id
            WHERE 
                p.created_by_id = ? AND CURRENT_DATE BETWEEN DATE(f.end_date, '-7 day') AND f.end_date
            `,
            [id]
        );

        if (history.length === 0) {
            return res.status(404).json({ message: "No results found for foster expiration" });
        }
        return res.json(history);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;