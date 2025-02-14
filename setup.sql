CREATE TABLE Users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	hashed_password TEXT NOT NULL, -- bcrypt or some other encrypt
	role TEXT -- ADOPTER, FOSTER, STAFF
);

CREATE TABLE Pets (
	pet_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	type TEXT,
	breed TEXT,
	size INTEGER,
	gender TEXT,
	age INTEGER,
	color TEXT,
	created_by_id INTEGER NOT NULL,
	fosterable BOOLEAN,
	pet_image_url TEXT, -- use text to image
	shelter_time DATE, -- YYYY-MM-DD
	current_foster INTEGER,
	current_adopter INTEGER,
	notes TEXT,
	-- adoption_fee NUMERIC, -- if we are doing payment
	FOREIGN KEY(created_by_id) REFERENCES Users(user_id),
	FOREIGN KEY(current_foster) REFERENCES Users(user_id),
	FOREIGN KEY(current_adopter) REFERENCES Users(user_id)
);

CREATE TABLE FosterHistory (
	user_id INTEGER NOT NULL,
	pet_id INTEGER NOT NULL,
	start_date DATE,
	end_date DATE,
	FOREIGN KEY(user_id) REFERENCES Users(user_id),
	FOREIGN KEY(pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE AdoptionHistory (
	user_id INTEGER NOT NULL,
	pet_id INTEGER NOT NULL,
	FOREIGN KEY(user_id) REFERENCES Users(user_id),
	FOREIGN KEY(pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE AdoptionForms (
	adoption_form_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	status TEXT, -- reject, accept, etc.
	FOREIGN KEY(user_id) REFERENCES Users(user_id)
);	

CREATE TABLE FosterForms (
	foster_form_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	foster_start_date DATE,
	foster_end_date DATE,
	status TEXT, -- reject, accept, etc.
	FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
	message_id INTEGER PRIMARY KEY AUTOINCREMENT,
	sender_id INTEGER NOT NULL,
	receiver_id INTEGER NOT NULL,
	message TEXT NOT NULL,
	time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(sender_id) REFERENCES Users(user_id),
	FOREIGN KEY(receiver_id) REFERENCES Users(user_id)
);

-- PRAGMA foreign_keys = ON; -- need to add this to server.ts to enable foreign keys