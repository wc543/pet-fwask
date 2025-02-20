import express from 'express';
import db from '../db.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const forms = await db.all("SELECT * FROM AdoptionForms");
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch adoption forms" });
    }
});
export default router;
