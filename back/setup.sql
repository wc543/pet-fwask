CREATE TABLE Users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	first_name TEXT,
	last_name TEXT,
	username TEXT UNIQUE NOT NULL,
	address TEXT,
	state TEXT,
	city TEXT,
	zip_code TEXT,
	phone_number TEXT,
	email TEXT UNIQUE NOT NULL,
	date_of_birth DATE,
	hashed_password TEXT NOT NULL, -- bcrypt or some other encrypt
	role TEXT DEFAULT 'ADOPTER' -- ADOPTER, FOSTER, STAFF
);

CREATE TABLE UserHousehold (
	household_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	household_size INTEGER,
	household_allergies TEXT,
	current_pets TEXT,
	FOREIGN KEY(user_id) REFERENCES Users(user_id)
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
	created_by_id INTEGER NOT NULL, -- Employee's id
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
	adopter_id INTEGER NOT NULL,
	previous_pet_experience TEXT,
	adoption_reason TEXT,
	ideal_pet_qualities TEXT,
	max_alone_time TEXT,
	care_plan_details TEXT,
	financial_responsibility BOOLEAN,
	pet_care_agreement BOOLEAN,
	adoption_agreement BOOLEAN,
	submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	processed BOOLEAN DEFAULT FALSE,
	FOREIGN KEY(adopter_id) REFERENCES Users(user_id)
);	

CREATE TABLE FosterParentForms (
	foster_parent_form_id INTEGER PRIMARY KEY AUTOINCREMENT,
	foster_id INTEGER NOT NULL,
	foster_reason TEXT,
	max_alone_time TEXT,
	care_plan_details TEXT,
	pet_care_agreement BOOLEAN,
	adoption_agreement BOOLEAN,
	submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	processed BOOLEAN DEFAULT FALSE,
	FOREIGN KEY(foster_id) REFERENCES Users(user_id)
);

CREATE TABLE FosterReferences (
	reference_id INTEGER PRIMARY KEY AUTOINCREMENT,
	foster_parent_form_id INTEGER NOT NULL,
	reference_name TEXT,
	relationship TEXT,
	phone_number TEXT,
	email TEXT,
	FOREIGN KEY(foster_parent_form_id) REFERENCES FosterParentForms(foster_parent_form_id)
);

CREATE TABLE FosterPetForms (
	foster_pet_form_id INTEGER PRIMARY KEY AUTOINCREMENT,
	foster_id INTEGER NOT NULL,
	foster_start_date DATE,
	foster_end_date DATE,
	previous_foster_experience TEXT,
	foster_reason TEXT,
	max_alone_time TEXT,
	submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	processed BOOLEAN DEFAULT FALSE,
	FOREIGN KEY(foster_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
	message_id INTEGER PRIMARY KEY AUTOINCREMENT,
	sender_id INTEGER NOT NULL,
	conversation_id INTEGER NOT NULL,
	message TEXT NOT NULL,
	time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(sender_id) REFERENCES Users(user_id),
	FOREIGN KEY(conversation_id) REFERENCES Conversations(conversation_id)
);

CREATE TABLE Conversations (
  conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  pet_id INTEGER REFERENCES Pets(pet_id) ON DELETE SET NULL, -- Optional, if conversation is tied to a pet
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRAGMA foreign_keys = ON; -- need to add this to server.ts to enable foreign keys
