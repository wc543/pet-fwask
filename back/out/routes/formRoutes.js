import express from 'express';
import db from '../db.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const adoption_forms = await db.all(`
      SELECT 
        AdoptionForms.*,
        Users.username AS user_name
      FROM AdoptionForms
      INNER JOIN Users ON AdoptionForms.user_id = Users.user_id;
      `);
        const foster_parent_forms = await db.all(`
      SELECT 
        FosterParentForms.*,
        Users.username AS user_name
      FROM FosterParentForms
      INNER JOIN Users ON FosterParentForms.user_id = Users.user_id;
      `);
        const foster_pet_forms = await db.all(`
      SELECT 
        FosterPetForms.*,
        Users.username AS user_name
      FROM FosterPetForms
      INNER JOIN Users ON FosterPetForms.user_id = Users.user_id;
      `);
        const forms = [
            ...adoption_forms.map((form) => ({ ...form, form_type: 'adoption' })),
            ...foster_parent_forms.map((form) => ({ ...form, form_type: 'foster-parent' })),
            ...foster_pet_forms.map((form) => ({ ...form, form_type: 'foster-pet' })),
        ];
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch all forms" });
    }
});
router.get('/unprocessed/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const adoption_forms = await db.all(`
      SELECT 
        AdoptionForms.*,
        Users.username AS user_name
      FROM AdoptionForms
      INNER JOIN Users ON AdoptionForms.user_id = Users.user_id
      INNER JOIN Pets ON AdoptionForms.pet_id = Pets.pet_id
      WHERE AdoptionForms.processed = FALSE
      AND Pets.created_by_id = ?
      `, [id]);
        const foster_parent_forms = await db.all(`
      SELECT 
        FosterParentForms.*,
        Users.username AS user_name
      FROM FosterParentForms
      INNER JOIN Users ON FosterParentForms.user_id = Users.user_id
      WHERE FosterParentForms.processed = FALSE
      `);
        const foster_pet_forms = await db.all(`
      SELECT 
        FosterPetForms.*,
        Users.username AS user_name
      FROM FosterPetForms
      INNER JOIN Users ON FosterPetForms.user_id = Users.user_id
      INNER JOIN Pets on FosterPetForms.pet_id = Pets.pet_id
      WHERE FosterPetForms.processed = FALSE
      AND Pets.created_by_id = ?
      `, [id]);
        const forms = [
            ...adoption_forms.map((form) => ({ ...form, form_type: 'adoption' })),
            ...foster_parent_forms.map((form) => ({ ...form, form_type: 'foster-parent' })),
            ...foster_pet_forms.map((form) => ({ ...form, form_type: 'foster-pet' })),
        ];
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch all forms" });
    }
});
router.get('/foster-expiration', async (req, res) => {
    try {
        const expiration = await db.all(`
          SELECT 
              FosterPetForms.foster_pet_form_id,
              FosterPetForms.foster_end_date,
              FosterPetForms.pet_id,
              Pets.name AS pet_name
          FROM FosterPetForms
          INNER JOIN Pets ON FosterPetForms.pet_id = Pets.pet_id
          WHERE FosterPetForms.processed = TRUE;
          `);
        res.json(expiration);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch foster expiration data" });
    }
});
//post adoption form
router.post('/adoption', async (req, res) => {
    try {
        const { user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, submitted_at, processed, status, first_name, last_name, address, state, city, zip_code, phone_number, household_size, household_allergies, current_pets, email } = req.body;
        let form_type = "adoption";
        const result = await db.run(`INSERT INTO AdoptionForms (
      user_id, 
      pet_id, 
      previous_pet_experience, 
      adoption_reason, 
      ideal_pet_qualities,
      max_alone_time, 
      care_plan_details, 
      financial_responsibility, 
      pet_care_agreement, 
      adoption_agreement, 
      submitted_at, 
      processed, 
      status,
      form_type,
      first_name,
    	last_name,
      address,
    	state,
    	city,
    	zip_code,
    	phone_number,
 	    household_size,
    	household_allergies,
    	current_pets,
    	email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, submitted_at, processed || false, status || "NEEDS PROCESSING", form_type, first_name, last_name, address, state, city, zip_code, phone_number, household_size, household_allergies, current_pets, email]);
        res.status(201).json({ message: 'Adoption form submitted', userId: result.lastID });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error submitting adoption form' });
    }
});
//post foster pet form
router.post('/foster-pet', async (req, res) => {
    try {
        const { user_id, pet_id, foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, submitted_at, processed, first_name, last_name, address, state, city, zip_code, phone_number, household_size, household_allergies, current_pets, email, status } = req.body;
        let form_type = "foster-pet";
        const result = await db.run(`INSERT INTO FosterPetForms (
      user_id, 
      pet_id,
      foster_start_date, 
      foster_end_date, 
      previous_foster_experience, 
      foster_reason, 
      max_alone_time,
      submitted_at,
      processed, 
      status,
      form_type, 
      first_name,
    	last_name,
      address,
    	state,
    	city,
    	zip_code,
    	phone_number,
 	    household_size,
    	household_allergies,
    	current_pets,
    	email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, pet_id, foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, submitted_at, processed || false, status || "NEEDS PROCESSING", form_type, first_name, last_name, address, state, city, zip_code, phone_number, household_size, household_allergies, current_pets, email]);
        res.status(201).json({ message: 'Foster pet form submitted', userId: result.lastID });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error submitting foster pet form' });
    }
});
//post foster parent form
router.post('/foster-parent', async (req, res) => {
    try {
        const { user_id, foster_reason, pet_care_agreement, adoption_agreement, submitted_at, processed, status, first_name, last_name, address, state, city, zip_code, phone_number, household_size, household_allergies, current_pets, email } = req.body;
        let form_type = "foster-parent";
        const result = await db.run(`INSERT INTO FosterParentForms (
        user_id,
        foster_reason,
        pet_care_agreement,
        adoption_agreement,
        submitted_at,
        processed,
        status,
        form_type, 
        first_name,
    	  last_name,
        address,
    	  state,
    	  city,
    	  zip_code,
    	  phone_number,
 	      household_size,
    	  household_allergies,
    	  current_pets,
    	  email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, foster_reason, pet_care_agreement, adoption_agreement, submitted_at, processed || false, status || "NEEDS PROCESSING", form_type, first_name, last_name, address, state, city, zip_code, phone_number, household_size, household_allergies, current_pets, email]);
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
        const { processed, status } = req.body;
        try {
            result = await db.all("UPDATE AdoptionForms SET processed=$1, status=$2 WHERE adoption_form_id = $3 RETURNING *;", [processed, status, id]);
            if (status == "APPROVED") {
                let adoption_info = await db.get('SELECT user_id, pet_id FROM AdoptionForms WHERE adoption_form_id=$1;', [id]);
                //set current_adopter in pet table
                await db.all("UPDATE Pets SET current_adopter=$1 WHERE pet_id = $2;", [adoption_info.user_id, adoption_info.pet_id]);
                //add row to AdoptionHistory table: user_id and pet_id
                await db.run(`INSERT INTO AdoptionHistory (
            user_id,
            pet_id)
           VALUES (?, ?)`, [adoption_info.user_id, adoption_info.pet_id]);
            }
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
        const { processed, status } = req.body;
        try {
            result = await db.all("UPDATE FosterPetForms SET processed=$1, status=$2 WHERE foster_pet_form_id = $3 RETURNING *;", [processed, status, id]);
            if (status == "APPROVED") {
                let foster_info = await db.get('SELECT user_id, pet_id, foster_start_date, foster_end_date FROM FosterPetForms WHERE foster_pet_form_id=$1;', [id]);
                //set current_foster in pet table
                await db.all("UPDATE Pets SET current_foster=$1 WHERE pet_id = $2;", [foster_info.user_id, foster_info.pet_id]);
                //add row to FosterHistory table: user_id, pet_id, start_date, & end_date
                await db.run(`INSERT INTO FosterHistory (
              user_id,
              pet_id,
              start_date,
              end_date)
             VALUES (?, ?, ?, ?)`, [foster_info.user_id, foster_info.pet_id, foster_info.foster_start_date, foster_info.foster_end_date]);
            }
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
        const { processed, status } = req.body;
        console.log("Received approval request with data:", req.body);
        try {
            result = await db.all("UPDATE FosterParentForms SET processed=$1, status=$2 WHERE foster_parent_form_id=$3 RETURNING *;", [processed, status, id]);
            if (status == "APPROVED") {
                let foster_parent_info = await db.get('SELECT user_id FROM FosterParentForms WHERE foster_parent_form_id=$1;', [id]);
                //set role in Users table to "FOSTER"
                await db.all("UPDATE Users SET role=$1 WHERE user_id = $2;", ["FOSTER", foster_parent_info.user_id]);
            }
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
    return res.json({ result });
});
//view foster pet form
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
    return res.json({ result });
});
//view foster parent form
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
    return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
    }
    else if (userRole.role === "STAFF") {
        result = await db.all('SELECT * FROM FosterParentForms');
        return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
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
        return res.json({ result });
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
router.get('/autofillForm/:id', async (req, res) => {
    let userId = req.params.id;
    let userResult;
    let householdResult;
    try {
        userResult = await db.all('SELECT first_name, last_name, address, state, city, zip_code, phone_number, email FROM Users WHERE user_id=$1;', [userId]);
        householdResult = await db.all('SELECT household_size, household_allergies, current_pets FROM UserHousehold WHERE user_id=$1;', [userId]);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
    return res.json({ userResult, householdResult });
});
export default router;
