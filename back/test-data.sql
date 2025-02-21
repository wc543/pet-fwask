-- Users Table
INSERT INTO Users (first_name, last_name, username, hashed_password, role, address, state, city, zip_code, phone_number, email, date_of_birth) VALUES
('Alice', 'Smith', 'alice', 'hashed_password_1', 'FOSTER', '123 Elm St', 'NY', 'New York', '10001', '123-456-7890', 'alice@example.com', '1985-04-12'),
('Bob', 'Jones', 'bob', 'hashed_password_2', 'STAFF', '456 Oak St', 'NY', 'Brooklyn', '11201', '987-654-3210', 'bob@example.com', '1980-05-20'),
('Charlie', 'Davis', 'charlie', 'hashed_password_3', 'FOSTER', '789 Pine St', 'CA', 'Los Angeles', '90001', '555-123-4567', 'charlie@example.com', '1990-07-15'),
('David', 'Williams', 'david', 'hashed_password_4', 'STAFF', '101 Maple St', 'CA', 'San Francisco', '94101', '555-234-5678', 'david@example.com', '1982-08-10'),
('Eve', 'Brown', 'eve', 'hashed_password_5', 'FOSTER', '202 Birch St', 'TX', 'Austin', '73301', '555-345-6789', 'eve@example.com', '1987-01-30'),
('Grace', 'Taylor', 'grace', 'hashed_password_6', 'ADOPTER', '303 Cedar St', 'FL', 'Miami', '33101', '555-456-7890', 'grace@example.com', '1995-02-25'),
('Hank', 'Wilson', 'hank', 'hashed_password_7', 'ADOPTER', '404 Spruce St', 'TX', 'Houston', '77001', '555-567-8901', 'hank@example.com', '1988-09-11');

-- UserHousehold Table
INSERT INTO UserHousehold (user_id, household_size, household_allergies, current_pets) VALUES
(1, 3, 'None', 'Dog, Cat'),
(2, 2, 'None', 'None'),
(3, 4, 'None', 'Dog, Cat'),
(4, 2, 'None', 'None'),
(5, 3, 'None', 'Dog'),
(6, 2, 'None', 'None'),
(7, 4, 'None', 'Dog');

-- Pets Table
INSERT INTO Pets (name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter) VALUES
('Fluffy', 'Dog', 'Golden Retriever', 5, 'Male', 3, 'Golden', 1, TRUE, 'image_url_1', '2024-12-01', 1, 6),
('Bella', 'Cat', 'Siamese', 2, 'Female', 2, 'Cream', 1, TRUE, 'image_url_2', '2024-11-15', 2, NULL),
('Max', 'Dog', 'Labrador', 4, 'Male', 4, 'Black', 2, TRUE, 'image_url_3', '2024-10-10', NULL, 7),
('Luna', 'Cat', 'Persian', 3, 'Female', 1, 'White', 3, FALSE, 'image_url_4', '2024-09-05', NULL, NULL),
('Rex', 'Dog', 'Bulldog', 6, 'Male', 5, 'Brindle', 2, TRUE, 'image_url_5', '2023-12-22', NULL, NULL);

-- FosterHistory Table
INSERT INTO FosterHistory (user_id, pet_id, start_date, end_date) VALUES
(1, 1, '2024-12-01', '2025-01-01'),
(2, 3, '2024-10-10', NULL),
(1, 2, '2024-11-15', '2024-12-15');

-- AdoptionHistory Table
INSERT INTO AdoptionHistory (user_id, pet_id) VALUES
(3, 1),
(2, 3);

-- AdoptionForms Table
INSERT INTO AdoptionForms (adopter_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, processed) VALUES
(3, 'Had pets before', 'Looking for a family dog', 'Friendly, playful', '8 hours', 'Walks, food, and playtime', TRUE, TRUE, TRUE, FALSE),
(2, 'No prior experience', 'Looking for a cat', 'Independent, quiet', '6 hours', 'Feeding and light play', TRUE, FALSE, TRUE, FALSE);

-- FosterParentForms Table
INSERT INTO FosterParentForms (foster_id, foster_reason, max_alone_time, care_plan_details, pet_care_agreement, adoption_agreement, processed) VALUES
(1, 'Want to provide a temporary home', '8 hours', 'Feeding and playtime, along with vet visits', TRUE, TRUE, FALSE),
(2, 'Looking to help foster', '6 hours', 'Daily feeding and basic care', FALSE, FALSE, FALSE);

-- FosterReferences Table
INSERT INTO FosterReferences (foster_parent_form_id, reference_name, relationship, phone_number, email) VALUES
(1, 'John Doe', 'Friend', '123-456-7890', 'john.doe@example.com'),
(1, 'Jane Doe', 'Neighbor', '234-567-8901', 'jane.doe@example.com'),
(1, 'Mike Johnson', 'Co-worker', '345-678-9012', 'mike.johnson@example.com'),
(2, 'Mary Smith', 'Co-worker', '234-567-8901', 'mary.smith@example.com');

-- Conversations Table
INSERT INTO Conversations (adopter_id, employee_id, pet_id) VALUES
(8, 2, 2);

-- FosterPetForms Table
INSERT INTO FosterPetForms (foster_id, foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, processed) VALUES
(1, '2024-12-01', '2025-01-01', 'Fostered 2 dogs before', 'Want to provide a temporary home', '8 hours', FALSE),
(2, '2024-10-01', NULL, 'No experience yet', 'Looking to help foster', '6 hours', FALSE); 

-- Messages Table
INSERT INTO Messages (sender_id, conversation_id, message) VALUES
(8, 1,  'Hello, I am interested in fostering Bella.'),
(2, 1, 'Hey, Bella has been adopted! Sorry!'),
(8, 1, 'Thank you anyways!');
