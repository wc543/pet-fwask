-- Users Table
INSERT INTO Users (first_name, last_name, username, hashed_password, role) VALUES
('Alice', 'Smith', 'alice', 'hashed_password_1', 'FOSTER'),
('Bob', 'Jones', 'bob', 'hashed_password_2', 'STAFF'),
('Charlie', 'Davis', 'charlie', 'hashed_password_3', 'FOSTER'),
('David', 'Williams', 'david', 'hashed_password_4', 'STAFF'),
('Eve', 'Brown', 'eve', 'hashed_password_5', 'FOSTER'),
('Grace', 'Taylor', 'grace', 'hashed_password_6', 'ADOPTER'),
('Hank', 'Wilson', 'hank', 'hashed_password_7', 'ADOPTER');

-- Pets Table
INSERT INTO Pets (name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter) VALUES
('Fluffy', 'Dog', 'Golden Retriever', 5, 'Male', 3, 'Golden', 1, TRUE, 'image_url_1', '2024-12-01', 1, 6),
('Bella', 'Cat', 'Siamese', 2, 'Female', 2, 'Cream', 1, TRUE, 'image_url_2', '2024-11-15', 2, NULL),
('Max', 'Dog', 'Labrador', 4, 'Male', 4, 'Black', 2, TRUE, 'image_url_3', '2024-10-10', NULL, 7),
('Luna', 'Cat', 'Persian', 3, 'Female', 1, 'White', 3, FALSE, 'image_url_4', '2024-09-05', NULL, NULL),
('Rex', 'Dog', 'Bulldog', 6, 'Male', 5, 'Brindle', 2, TRUE, 'image_url_5', '2023-12-22', NULL, NULL);

-- FosterHistory Table
INSERT INTO FosterHistory (user_id, pet_id, start_date) VALUES
(1, 1, '2024-12-01'),
(2, 3, '2024-10-10'),
(1, 2, '2024-11-15');

-- AdoptionHistory Table
INSERT INTO AdoptionHistory (user_id, pet_id) VALUES
(3, 1),
(2, 3);

-- AdoptionForms Table
INSERT INTO AdoptionForms (adopter_id, household_size, household_allergies, current_pets, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, status) VALUES
(3, 4, 'None', 'Dog, Cat', 'Had pets before', 'Looking for a family dog', 'Friendly, playful', '8 hours', 'Walks, food, and playtime', TRUE, TRUE, TRUE, 'accept'),
(2, 2, 'None', 'None', 'No prior experience', 'Looking for a cat', 'Independent, quiet', '6 hours', 'Feeding and light play', TRUE, FALSE, TRUE, 'reject');

-- FosterForms Table
INSERT INTO FosterForms (foster_id, household_size, household_allergies, current_pets, previous_foster_experience, foster_reason, max_alone_time, care_plan_details, pet_care_agreement, adoption_agreement, status) VALUES
(1, 3, 'None', 'Dog, Cat', 'Fostered 2 dogs before', 'Want to provide a temporary home', '8 hours', 'Feeding and playtime, along with vet visits', TRUE, TRUE, 'accept'),
(2, 2, 'None', 'None', 'No experience yet', 'Looking to help foster', '6 hours', 'Daily feeding and basic care', FALSE, FALSE, 'reject');

-- FosterReferences Table
INSERT INTO FosterReferences (foster_form_id, reference_name, relationship, phone_number, email) VALUES
(1, 'John Doe', 'Friend', '123-456-7890', 'john.doe@example.com'),
(1, 'Jane Doe', 'Neighbor', '234-567-8901', 'jane.doe@example.com'),
(1, 'Mike Johnson', 'Co-worker', '345-678-9012', 'mike.johnson@example.com'),
(2, 'Mary Smith', 'Co-worker', '234-567-8901', 'mary.smith@example.com');

-- Messages Table
INSERT INTO Messages (sender_id, receiver_id, message) VALUES
(1, 2, 'Hello, I am interested in fostering Bella.'),
(3, 1, 'Hey, Fluffy has been adopted!'),
(2, 3, 'Your adoption form for Bella has been rejected.'),
(6, 7, 'I am interested in adopting Max!');
