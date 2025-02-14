-- Users Table
INSERT INTO Users (username, hashed_password, role) VALUES
('alice', 'hashed_password_1', 'FOSTER'),
('bob', 'hashed_password_2', 'STAFF'),
('charlie', 'hashed_password_3', 'FOSTER'),
('david', 'hashed_password_4', 'STAFF'),
('eve', 'hashed_password_5', 'FOSTER'),
('grace', 'hashed_password_6', 'ADOPTER'),
('hank', 'hashed_password_7', 'ADOPTER');

-- Pets Table
INSERT INTO Pets (name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter) VALUES
('Fluffy', 'Dog', 'Golden Retriever', 5, 'Male', 3, 'Golden', 1, TRUE, 'image_url_1', '2024-12-01', 1, 6),
('Bella', 'Cat', 'Siamese', 2, 'Female', 2, 'Cream', 1, TRUE, 'image_url_2', '2024-11-15', 2, NULL),
('Max', 'Dog', 'Labrador', 4, 'Male', 4, 'Black', 2, TRUE, 'image_url_3', '2024-10-10', NULL, 7),
('Luna', 'Cat', 'Persian', 3, 'Female', 1, 'White', 3, FALSE, 'image_url_4', '2024-09-05', NULL, NULL),
('Rex', 'Dog', 'Bulldog', 6, 'Male', 5, 'Brindle', 2, TRUE, 'image_url_5', '2023-12-22', NULL, NULL);

-- FosterHistory Table
INSERT INTO FosterHistory (user_id, pet_id) VALUES
(1, 1),
(2, 3),
(1, 2);

-- AdoptionHistory Table
INSERT INTO AdoptionHistory (user_id, pet_id) VALUES
(3, 1),
(2, 3),

-- AdoptionForms Table
INSERT INTO AdoptionForms (user_id, status) VALUES
(3, 'accept'),
(2, 'reject');

-- FosterForms Table
INSERT INTO FosterForms (user_id, status) VALUES
(1, 'accept'),
(2, 'reject');

-- Messages Table
INSERT INTO Messages (sender_id, receiver_id, message) VALUES
(1, 2, 'Hello, I am interested in fostering Bella.'),
(3, 1, 'Hey, Fluffy has been adopted!'),
(2, 3, 'Your adoption form for Bella has been rejected.'),
(6, 7, 'I am interested in adopting Max!');
