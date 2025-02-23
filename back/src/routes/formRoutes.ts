import express, { Request, Response } from 'express';
import db from '../db.js';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const adoption_forms = await db.all("SELECT * FROM AdoptionForms");
    const foster_parent_forms = await db.all("SELECT * FROM FosterParentForms");
    const foster_pet_forms = await db.all("SELECT * FROM FosterPetForms");
    
    const forms = [
      ...adoption_forms.map((form: any) => ({ ...form, form_type: 'Adoption' })),
      ...foster_parent_forms.map((form: any) => ({ ...form, form_type: 'Foster Parent' })),
      ...foster_pet_forms.map((form: any) => ({ ...form, form_type: 'Foster Pets' })),
    ];

    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all forms" });
  }
});

router.get('/adoption', async (req: Request, res: Response) => {
    try {
      const forms = await db.all("SELECT * FROM AdoptionForms");
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adoption forms" });
    }
});

router.get('/foster-parents', async (req: Request, res: Response) => {
  try {
    const forms = await db.all("SELECT * FROM FosterParentForms");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch foster parent forms" });
  }
});

router.get('/foster-pets', async (req: Request, res: Response) => {
  try {
    const forms = await db.all("SELECT * FROM FosterPetForms");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch foster pet forms" });
  }
});


export default router;