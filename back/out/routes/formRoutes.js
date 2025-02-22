import express from 'express';
import db from '../db.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const adoption_forms = await db.all("SELECT * FROM AdoptionForms");
        const foster_parent_forms = await db.all("SELECT * FROM FosterParentForms");
        const foster_pet_forms = await db.all("SELECT * FROM FosterPetForms");
        res.json({
            adoption_forms,
            foster_parent_forms,
            foster_pet_forms
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch all forms" });
    }
});
router.get('/adoption', async (req, res) => {
    try {
        const forms = await db.all("SELECT * FROM AdoptionForms");
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch adoption forms" });
    }
});
router.get('/foster-parents', async (req, res) => {
    try {
        const forms = await db.all("SELECT * FROM FosterParentForms");
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch foster parent forms" });
    }
});
router.get('/foster-pets', async (req, res) => {
    try {
        const forms = await db.all("SELECT * FROM FosterPetForms");
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch foster pet forms" });
    }
});
export default router;
