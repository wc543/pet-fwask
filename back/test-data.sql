-- Users Table
INSERT INTO Users (first_name, last_name, username, hashed_password, role, address, state, city, zip_code, phone_number, email, date_of_birth) VALUES
('Alice', 'Smith', 'alice', '$2b$10$iOmkM9fMKVxx5JWJoFkaz.uSCk4lpuE4tpx31nq.kPJ7IIAg/ayPu', 'FOSTER', '123 Elm St', 'NY', 'New York', '10001', '123-456-7890', 'alice@example.com', '1985-04-12'), -- password: password
('Bob', 'Jones', 'bob', '$2b$10$3Px6Ol/MMLzUE/t4.zpfxO63gzRvpzXNcOjD.g0aB/jQJRwos17RK', 'STAFF', '456 Oak St', 'NY', 'Brooklyn', '11201', '987-654-3210', 'bob@example.com', '1980-05-20'), -- password: password
('Charlie', 'Davis', 'charlie', '$2b$10$58FydJDVf.ZZ5SGnfda0uufpdc3jypdCHCOchf/Wu0uiDeybWi3FS', 'FOSTER', '789 Pine St', 'CA', 'Los Angeles', '90001', '555-123-4567', 'charlie@example.com', '1990-07-15'), -- password: password
('David', 'Williams', 'david', '$2b$10$hCqwK9X7ag58XpoBTTZEPu8gGMWx81qxZh3lFd4FbGdrWqo8R4NBe', 'STAFF', '101 Maple St', 'CA', 'San Francisco', '94101', '555-234-5678', 'david@example.com', '1982-08-10'), -- password: password
('Eve', 'Brown', 'eve', '$2b$10$JND9Vm9zc/7CAODMRv0dUu5Xm63vl2yDKfBgO6ikHWXS0R.19yexW', 'FOSTER', '202 Birch St', 'TX', 'Austin', '73301', '555-345-6789', 'eve@example.com', '1987-01-30'), -- password: password
('Grace', 'Taylor', 'grace', '$2b$10$QnVgECPvCoGS9gViKuZ59e.5Hb4/19n5v94DBbXL9y4YcDXhqxOf.', 'ADOPTER', '303 Cedar St', 'FL', 'Miami', '33101', '555-456-7890', 'grace@example.com', '1995-02-25'), -- password: password
('Hank', 'Wilson', 'hank', '$2b$10$3a7uvdU7E8q3fwu6s3fQTeCq1ywNhc7.Evfu/Dz03xZyruGrMn5uW', 'ADOPTER', '404 Spruce St', 'TX', 'Houston', '77001', '555-567-8901', 'hank@example.com', '1988-09-11'); -- password: password

-- UserHousehold Table
INSERT INTO UserHousehold (user_id, household_size, household_allergies, current_pets) VALUES
(1, 3, 'Grass', 'Dog, Cat'),
(3, 4, 'None', 'Dog, Cat'),
(5, 3, 'Pet dander', 'Dog'),
(6, 2, 'None', 'None'),
(7, 4, 'None', 'Dog');

-- Pets Table
INSERT INTO Pets (name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes) VALUES
('Fluffy', 'Dog', 'Golden Retriever', 2, 'Male', 3, 'Golden', 4, TRUE, 'fluffy.png', '2024-12-01', 1, NULL, 'Friendly'),
('Bella', 'Cat', 'Siamese', 0, 'Female', 1, 'Cream', 4, TRUE, 'bella.PNG', '2024-11-15', NULL, NULL, 'Needs vaccinations'),
('Max', 'Dog', 'Labrador', 2, 'Male', 4, 'Black', 4, TRUE, 'max.jpg', '2024-10-10', NULL, 3, NULL),
('Luna', 'Cat', 'Persian', 1, 'Female', 1, 'White', 4, FALSE, 'luna.jpg', '2024-09-05', NULL, NULL, 'Bite Risk'),
('Rex', 'Dog', 'Bulldog', 2, 'Male', 5, 'Brindle', 4, TRUE, 'rex.jpg', '2023-12-22', 5, NULL, NULL),
('Kiwi', 'Bird', 'Parakeet', 1, 'Male', 5, 'blue', 2, TRUE, 'kiwi.jpg', '2023-12-22', NULL, NULL, NULL),
('Spike', 'Reptile', 'Bearded Dragon', 0, 'Male', 5, 'brown', 2, TRUE, 'spike.jpg', '2023-12-22', NULL, NULL, NULL),
('Eggshell', 'Cat', 'Tabby', 1, 'Female', 3, 'Brown', 4, TRUE, 'eggshell.jpeg', '2023-12-01', NULL, NULL, NULL),
('Gulliver', 'Horse', 'Draft', 3, 'Male', 9, 'Brown', 4, FALSE, 'gulliver.jpg', '2023-3-05', NULL, NULL, NULL),
('Kono', 'Bird', 'Cockatoo', 0, 'Female', 2, 'White', 4, FALSE, 'kono.jpg', '2025-1-01', NULL, NULL, NULL),
('Minnie', 'Cat', 'American Shorthair', 1, 'Male', 1, 'Black', 4, TRUE, 'minnie.jpg', '2025-2-03', NULL, NULL, NULL),
('Mordred', 'Reptile', 'Ball Python', 1, 'Female', 1, 'Brown', 4, FALSE, 'mordred.jpg', '2024-2-05', NULL, NULL, NULL),
('Raquel', 'Rabbit', 'Angora', 0, 'Male', 1, 'Brown', 4, FALSE, 'raquel.jpg', '2025-3-10', NULL, NULL, NULL),
('Smudge', 'Rabbit', 'Rex', 0, 'Female', 1, 'White', 4, FALSE, 'smudge.jpg', '2025-2-03', NULL, NULL, NULL),
('Wilbur', 'Reptile', 'Hognose snake', 0, 'Female', 2, 'Orange', 4, FALSE, 'wilbur.jpg', '2025-1-03', NULL, NULL, NULL),
('Windy', 'Dog', 'Greyhound', 2, 'Male', 3, 'Brindle', 4, TRUE, 'windy.jpg', '2024-2-03', NULL, NULL, NULL);

-- FosterHistory Table
INSERT INTO FosterHistory (user_id, pet_id, start_date, end_date) VALUES
(1, 16, '2025-02-01', '2025-03-20'),
(3, 3, '2025-02-10', '2025-03-29');

-- AdoptionHistory Table
INSERT INTO AdoptionHistory (user_id, pet_id) VALUES
(5, 5);

-- AdoptionForms Table
INSERT INTO AdoptionForms (user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, processed, status) VALUES
(3, 1, 'Had pets before', 'Looking for a family dog', 'Friendly, playful', '8 hours', 'Walks, food, and playtime', TRUE, TRUE, TRUE, FALSE, 'NEEDS PROCESSING'),
(1, 2, 'No prior experience', 'Looking for a cat', 'Independent, quiet', '6 hours', 'Feeding and light play', TRUE, FALSE, TRUE, FALSE, 'NEEDS PROCESSING');

-- FosterParentForms Table
INSERT INTO FosterParentForms (user_id, foster_reason, pet_care_agreement, adoption_agreement, processed, status) VALUES
(6, 'Want to provide a temporary home', TRUE, TRUE, FALSE, 'NEEDS PROCESSING'),
(7, 'Looking to help foster', FALSE, FALSE, FALSE, 'NEEDS PROCESSING');


-- FosterPetForms Table
INSERT INTO FosterPetForms (user_id, pet_id, foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, processed, status) VALUES
(1, 2, '2024-12-01', '2026-01-01', 'Fostered 2 dogs before', 'Want to provide a temporary home', '8 hours', TRUE, 'DENIED'),
(5, 3,'2024-10-01', NULL, 'No experience yet', 'Looking to help foster', '6 hours', FALSE, 'NEEDS PROCESSING'); 

-- Conversations Table
INSERT INTO Conversations (user_id, owner_id, pet_id) VALUES
(7, 2, 3),
(6, 2, 3);

-- Conversations Table (Without pet_id)
INSERT INTO Conversations (user_id, owner_id) VALUES
(5, 2),
(7, 4);

-- Messages Table
INSERT INTO Messages (sender_id, conversation_id, message, read) VALUES
(7, 4,  'Hey, I have a question about vaccines', TRUE),
(4, 4, 'Happy to help! What is your question?', TRUE),
(7, 4, 'Are all adoptable dogs up to date on their vaccines?', FALSE),
(4, 4, 'Yes they are, we give each animal updated vaccines on intake.', TRUE);
