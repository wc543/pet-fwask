-- Users Table
INSERT INTO Users (first_name, last_name, username, hashed_password, role, address, state, city, zip_code, phone_number, email, date_of_birth) VALUES
('Alice', 'Smith', 'alice', '$2b$10$Bi1nX8vWWbSeQHPXpCEoD.U8.C6J7e83FgvaZ2bfm5w5vUDbOtN7i', 'FOSTER', '123 Elm St', 'NY', 'New York', '10001', '123-456-7890', 'alice@example.com', '1985-04-12'), -- password: password_1
('Bob', 'Jones', 'bob', '$2b$10$c5xjQyA..mBUZvt1HLB1pOE5q5E5FzrOoyj6JJ7ySIVyjkNTZgA02', 'STAFF', '456 Oak St', 'NY', 'Brooklyn', '11201', '987-654-3210', 'bob@example.com', '1980-05-20'), -- password: password_2
('Charlie', 'Davis', 'charlie', '$2b$10$1garp/Yz9RFv6X7wPin3yOoBTZWSxHv5C4h9efC2FzpvY4YGYUKzW', 'FOSTER', '789 Pine St', 'CA', 'Los Angeles', '90001', '555-123-4567', 'charlie@example.com', '1990-07-15'), -- password: password_3
('David', 'Williams', 'david', '$2b$10$.hI6pqnZ4ZXp91InWzEQEehQqq2D99wQcQBTPhn9.MHneipotwiJK', 'STAFF', '101 Maple St', 'CA', 'San Francisco', '94101', '555-234-5678', 'david@example.com', '1982-08-10'), -- password: password_4
('Eve', 'Brown', 'eve', '$2b$10$wWnlLgruq3eFGjb3JCpGwuwcpg2vtRxp3uy3kwJiPO1gOUJq1GBtO', 'FOSTER', '202 Birch St', 'TX', 'Austin', '73301', '555-345-6789', 'eve@example.com', '1987-01-30'), -- password: password_5
('Grace', 'Taylor', 'grace', '$2b$10$0vKh/AOJyPJI8GvmQLkkoeWcBAeisbXE3G5QXzmum2t/MHMzRxeLm', 'ADOPTER', '303 Cedar St', 'FL', 'Miami', '33101', '555-456-7890', 'grace@example.com', '1995-02-25'), -- password: password_6
('Hank', 'Wilson', 'hank123', '$2b$10$MMDiR.QqvxbtolRFj5ywvONFv7GFWXYJ87J3BzaoeXPCDR0FVAO46', 'ADOPTER', '404 Spruce St', 'TX', 'Houston', '77001', '555-567-8901', 'hank@example.com', '1988-09-11'); -- password: password_7

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
('Fluffy', 'Dog', 'Golden Retriever', 5, 'Male', 3, 'Golden', 4, TRUE, 'fluffy.png', '2024-12-01', 1, 6),
('Bella', 'Cat', 'Siamese', 2, 'Female', 2, 'Cream', 4, TRUE, NULL, '2024-11-15', 2, NULL),
('Max', 'Dog', 'Labrador', 4, 'Male', 4, 'Black', 4, TRUE, NULL, '2024-10-10', NULL, 7),
('Luna', 'Cat', 'Persian', 3, 'Female', 1, 'White', 4, FALSE, NULL, '2024-09-05', NULL, NULL),
('Rex', 'Dog', 'Bulldog', 6, 'Male', 5, 'Brindle', 4, TRUE, NULL, '2023-12-22', NULL, NULL);

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
INSERT INTO AdoptionForms (user_id, pet_id, previous_pet_experience, adoption_reason, ideal_pet_qualities, max_alone_time, care_plan_details, financial_responsibility, pet_care_agreement, adoption_agreement, processed, status) VALUES
(3, 1, 'Had pets before', 'Looking for a family dog', 'Friendly, playful', '8 hours', 'Walks, food, and playtime', TRUE, TRUE, TRUE, FALSE, 'NEEDS PROCESSING'),
(2, 2, 'No prior experience', 'Looking for a cat', 'Independent, quiet', '6 hours', 'Feeding and light play', TRUE, FALSE, TRUE, FALSE, 'NEEDS PROCESSING');

-- FosterParentForms Table
INSERT INTO FosterParentForms (user_id, foster_reason, pet_care_agreement, adoption_agreement, processed, status) VALUES
(1, 'Want to provide a temporary home', TRUE, TRUE, FALSE, 'NEEDS PROCESSING'),
(2, 'Looking to help foster', FALSE, FALSE, FALSE, 'NEEDS PROCESSING');


-- FosterPetForms Table
INSERT INTO FosterPetForms (user_id, pet_id, foster_start_date, foster_end_date, previous_foster_experience, foster_reason, max_alone_time, processed, status) VALUES
(1, 2, '2024-12-01', '2026-01-01', 'Fostered 2 dogs before', 'Want to provide a temporary home', '8 hours', TRUE, 'NEEDS PROCESSING'),
(2, 3,'2024-10-01', NULL, 'No experience yet', 'Looking to help foster', '6 hours', FALSE, 'NEEDS PROCESSING'); 

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
(7, 1,  'Hello, I am interested in adopting Max.', TRUE),
(2, 1, 'Hey, Max has been adopted! Sorry!', TRUE),
(7, 1, 'Thank you anyways!', TRUE),
(7, 4,  'Hey, I have a question about vaccines', TRUE),
(4, 4, 'Hey, what up? Have you adopted a dog here before', TRUE),
(7, 4, 'Thank you anyways!', FALSE),
(6, 2,  'Hello! I am interested in adopting Max.', TRUE);
