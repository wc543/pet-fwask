import express from 'express';
import db from '../db.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const adoption_forms = await db.all("SELECT * FROM AdoptionForms");
        const foster_parent_forms = await db.all("SELECT * FROM FosterParentForms");
        const foster_pet_forms = await db.all("SELECT * FROM FosterPetForms");
        const forms = [
            ...adoption_forms.map((form) => ({ ...form, form_type: 'adoption' })),
            ...foster_parent_forms.map((form) => ({ ...form, form_type: 'foster-parent' })),
            ...foster_pet_forms.map((form) => ({ ...form, form_type: 'foster-pets' })),
        ];
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch all forms" });
    }
});
//post adoption form
router.post('/adoption', async (req, res) => {
    try {
        const { user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, submitted_at, processed, } = req.body;
        let form_type = "Adoption";
        const result = await db.run(`INSERT INTO AdoptionForms (user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_resposibility , pet_care_agreement, adoption_agreement, submitted_at, processed, form_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, submitted_at, processed || false, form_type]);
        res.status(201).json({ message: 'Adoption form submitted', userId: result.lastID });
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting adoption form' });
    }
});
//post foster pet form
router.post('/foster-pet', async (req, res) => {
    try {
        const { user_id, pet_id, foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, submitted_at, processed, } = req.body;
        let form_type = "Foster Pet";
        const result = await db.run(`INSERT INTO FosterPetForms (user_id, pet_id,foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time,submitted_at, processed, form_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, pet_id, , foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, submitted_at, processed || false, form_type]);
        res.status(201).json({ message: 'Foster pet form submitted', userId: result.lastID });
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting foster pet form' });
    }
});
//post foster parent form
router.post('/foster-parent', async (req, res) => {
    try {
        const { user_id, foster_reason, max_alone_time, care_plan_details, pet_care_agreement, adoption_agreement, submitted_at, processed, } = req.body;
        let form_type = "Foster Parent";
        const result = await db.run(`INSERT INTO FosterParentForms (user_id,foster_reason, max_alone_time, care_plan_details, pet_care_agreement, adoption_agreement, submitted_at , processed,form_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, foster_reason, max_alone_time, care_plan_details, pet_care_agreement, adoption_agreement, submitted_at, processed || false, form_type]);
        res.status(201).json({ message: 'Foster parent form submitted', userId: result.lastID });
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting foster parent form' });
    }
});
//put adoption forms status
router.put("/adoption/:id", async (req, res) => {
    let id = req.params.id;
    let result;
    try {
        const { processed } = req.body;
        try {
            result = await db.all("UPDATE AdoptionForms SET processed=$1 WHERE adoption_form_id = $2 RETURNING *;", [processed, id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error udating adoption form status' });
    }
    return res.json({ result });
});
//put foster pet form status
router.put("/foster-pet/:id", async (req, res) => {
    let id = req.params.id;
    let result;
    try {
        const { processed } = req.body;
        try {
            result = await db.all("UPDATE FosterPetForms SET processed=$1 WHERE foster_pet_form_id = $2 RETURNING *;", [processed, id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error udating foster pet form status' });
    }
    return res.json({ result });
});
//put foster parent form status
router.put("/foster-parent/:id", async (req, res) => {
    let id = req.params.id;
    let result;
    try {
        const { processed } = req.body;
        try {
            result = await db.all("UPDATE FosterParentForms SET processed=$1 WHERE foster_parent_form_id=$2 RETURNING *;", [processed, id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error udating foster parent form status' });
    }
    return res.json({ result });
});
//view adoption form
//To Do: concatenate userid fields?
router.get('/adoption/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    try {
        result = await db.all('SELECT * FROM AdoptionForms WHERE adoption_form_id=$1;', [id]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ error: error.toString() });
    }
    return res.json(result);
});
//view foster pet form
//To Do: concatenate userid fields?
router.get('/foster-pet/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    try {
        result = await db.all('SELECT * FROM FosterPetForms WHERE foster_pet_form_id=$1;', [id]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ error: error.toString() });
    }
    return res.json(result);
});
//view foster parent form
//To Do: concatenate userid fields?
router.get('/foster-parent/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    try {
        result = await db.all('SELECT * FROM FosterParentForms WHERE foster_parent_form_id=$1;', [id]);
    }
    catch (err) {
        let error = err;
        return res.status(500).json({ error: error.toString() });
    }
    return res.json(result);
});
//get adoption form list
//when passed user id, returns all forms submitted by that user
//when passed employee id, returns all forms associated with employee
router.get('/adoptionList/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    result = [];
    let userRole = await db.get('SELECT role FROM Users WHERE user_id=$1;', [id]);
    if (userRole.role === "ADOPTER" || userRole.role === "FOSTER") {
        try {
            result = await db.all('SELECT * FROM AdoptionForms WHERE user_id=$1;', [id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
        return res.json(result);
    }
    else if (userRole.role === "STAFF") {
        let associatedPets;
        associatedPets = await db.all('SELECT pet_id FROM Pets WHERE created_by_id=$1;', [id]);
        for (let petId of associatedPets) {
            let forms = await db.all('SELECT * FROM AdoptionForms WHERE pet_id=$1;', [petId.pet_id]);
            for (let form of forms) {
                result.push(form);
            }
        }
        return res.json(result);
    }
    else {
        return res.status(201).json({ error: "invalid user" });
    }
});
//get foster pet form list
//when passed user id, returns all forms submitted by that user
//when passed employee id, returns all forms associated with employee
router.get('/fosterPetList/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    result = [];
    let userRole = await db.get('SELECT role FROM Users WHERE user_id=$1;', [id]);
    if (userRole.role === "ADOPTER" || userRole.role === "FOSTER") {
        try {
            result = await db.all('SELECT * FROM FosterPetForms WHERE user_id=$1;', [id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
        return res.json(result);
    }
    else if (userRole.role === "STAFF") {
        let associatedPets;
        associatedPets = await db.all('SELECT pet_id FROM Pets WHERE created_by_id=$1;', [id]);
        for (let petId of associatedPets) {
            let forms = await db.all('SELECT * FROM FosterPetForms WHERE pet_id=$1;', [petId.pet_id]);
            for (let form of forms) {
                result.push(form);
            }
        }
        return res.json(result);
    }
    else {
        return res.status(201).json({ error: "invalid user" });
    }
});
//get foster parent form list
//when passed user id, returns all forms submitted by that user
//when passed employee id, returns all forms (foster parent forms have no associated pet, and therefore no associated employee)
router.get('/fosterParentList/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    result = [];
    let userRole = await db.get('SELECT role FROM Users WHERE user_id=$1;', [id]);
    if (userRole.role === "ADOPTER" || userRole.role === "FOSTER") {
        try {
            result = await db.all('SELECT * FROM FosterParentForms WHERE user_id=$1;', [id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
        return res.json(result);
    }
    else if (userRole.role === "STAFF") {
        result = await db.all('SELECT * FROM FosterParentForms');
        return res.json(result);
    }
    else {
        return res.status(201).json({ error: "invalid user" });
    }
});
//get all unprocessed adoption forms for an employee
router.get('/employeeDashboard/adoptionList/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    result = [];
    let userRole = await db.get('SELECT role FROM Users WHERE user_id=$1;', [id]);
    if (userRole.role === "ADOPTER" || userRole.role === "FOSTER") {
        try {
            result = await db.all('SELECT * FROM AdoptionForms WHERE user_id=$1;', [id]);
        }
        catch (err) {
            let error = err;
            return res.status(500).json({ error: error.toString() });
        }
        return res.json(result);
    }
    else if (userRole.role === "STAFF") {
        let associatedPets;
        associatedPets = await db.all('SELECT pet_id FROM Pets WHERE created_by_id=$1;', [id]);
        for (let petId of associatedPets) {
            let forms = await db.all('SELECT * FROM AdoptionForms WHERE pet_id=$1 AND processed=$2; ', [petId.pet_id, false]);
            for (let form of forms) {
                result.push(form);
            }
        }
        return res.json(result);
    }
    else {
        return res.status(201).json({ error: "invalid user" });
    }
});
//get all unprocessed foster pet forms form an employee
router.get('/employeeDashboard/fosterPetList/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    result = [];
    let userRole = await db.get('SELECT role FROM Users WHERE user_id=$1;', [id]);
    if (userRole.role === "STAFF") {
        let associatedPets;
        associatedPets = await db.all('SELECT pet_id FROM Pets WHERE created_by_id=$1;', [id]);
        for (let petId of associatedPets) {
            let forms = await db.all('SELECT * FROM FosterPetForms WHERE pet_id=$1 AND processed=$2; ', [petId.pet_id, false]);
            for (let form of forms) {
                result.push(form);
            }
        }
        return res.json(result);
    }
    else {
        return res.status(201).json({ error: "invalid user" });
    }
});
//get all unprocessed foster parent forms an employee
router.get('/employeeDashboard/fosterParentList/:id', async (req, res) => {
    let id = req.params.id;
    let result;
    result = [];
    let userRole = await db.get('SELECT role FROM Users WHERE user_id=$1;', [id]);
    if (userRole.role === "STAFF") {
        result = await db.all('SELECT * FROM FosterParentForms WHERE processed=$1', [false]);
        return res.json(result);
    }
    else {
        return res.status(201).json({ error: "invalid user" });
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
