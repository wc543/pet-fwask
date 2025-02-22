import axios from "axios";
import sqlite3 from "sqlite3";
import db from './db.js';
sqlite3.verbose();
let port = 3000;
let host = "localhost";
let protocol = "http";
let baseURL = `${protocol}://${host}:${port}/api/`;
axios.defaults.baseURL = baseURL;
// test data ---------------
let pets = [
    {
        "pet_id": 1,
        "name": "Fluffy",
        "type": "Dog",
        "breed": "Golden Retriever",
        "size": 5,
        "gender": "Male",
        "age": 3,
        "color": "Golden",
        "created_by_id": 1,
        "fosterable": 1,
        "pet_image_url": "image_url_1",
        "shelter_time": "2024-12-01",
        "current_foster": 1,
        "current_adopter": 6,
        "notes": null
    },
    {
        "pet_id": 2,
        "name": "Bella",
        "type": "Cat",
        "breed": "Siamese",
        "size": 2,
        "gender": "Female",
        "age": 2,
        "color": "Cream",
        "created_by_id": 1,
        "fosterable": 1,
        "pet_image_url": "image_url_2",
        "shelter_time": "2024-11-15",
        "current_foster": 2,
        "current_adopter": null,
        "notes": null
    },
    {
        "pet_id": 3,
        "name": "Max",
        "type": "Dog",
        "breed": "Labrador",
        "size": 4,
        "gender": "Male",
        "age": 4,
        "color": "Black",
        "created_by_id": 2,
        "fosterable": 1,
        "pet_image_url": "image_url_3",
        "shelter_time": "2024-10-10",
        "current_foster": null,
        "current_adopter": 7,
        "notes": null
    },
    {
        "pet_id": 4,
        "name": "Luna",
        "type": "Cat",
        "breed": "Persian",
        "size": 3,
        "gender": "Female",
        "age": 1,
        "color": "White",
        "created_by_id": 3,
        "fosterable": 0,
        "pet_image_url": "image_url_4",
        "shelter_time": "2024-09-05",
        "current_foster": null,
        "current_adopter": null,
        "notes": null
    },
    {
        "pet_id": 5,
        "name": "Rex",
        "type": "Dog",
        "breed": "Bulldog",
        "size": 6,
        "gender": "Male",
        "age": 5,
        "color": "Brindle",
        "created_by_id": 2,
        "fosterable": 1,
        "pet_image_url": "image_url_5",
        "shelter_time": "2023-12-22",
        "current_foster": null,
        "current_adopter": null,
        "notes": null
    }
];
let users = [
    {
        "user_id": 1,
        "first_name": "Alice",
        "last_name": "Smith",
        "username": "alice",
        "address": "123 Elm St",
        "state": "NY",
        "city": "New York",
        "zip_code": "10001",
        "phone_number": "123-456-7890",
        "email": "alice@example.com",
        "date_of_birth": "1985-04-12",
        "hashed_password": "hashed_password_1",
        "role": "FOSTER"
    },
    {
        "user_id": 2,
        "first_name": "Bob",
        "last_name": "Jones",
        "username": "bob",
        "address": "456 Oak St",
        "state": "NY",
        "city": "Brooklyn",
        "zip_code": "11201",
        "phone_number": "987-654-3210",
        "email": "bob@example.com",
        "date_of_birth": "1980-05-20",
        "hashed_password": "hashed_password_2",
        "role": "STAFF"
    },
    {
        "user_id": 3,
        "first_name": "Charlie",
        "last_name": "Davis",
        "username": "charlie",
        "address": "789 Pine St",
        "state": "CA",
        "city": "Los Angeles",
        "zip_code": "90001",
        "phone_number": "555-123-4567",
        "email": "charlie@example.com",
        "date_of_birth": "1990-07-15",
        "hashed_password": "hashed_password_3",
        "role": "FOSTER"
    },
    {
        "user_id": 4,
        "first_name": "David",
        "last_name": "Williams",
        "username": "david",
        "address": "101 Maple St",
        "state": "CA",
        "city": "San Francisco",
        "zip_code": "94101",
        "phone_number": "555-234-5678",
        "email": "david@example.com",
        "date_of_birth": "1982-08-10",
        "hashed_password": "hashed_password_4",
        "role": "STAFF"
    },
    {
        "user_id": 5,
        "first_name": "Eve",
        "last_name": "Brown",
        "username": "eve",
        "address": "202 Birch St",
        "state": "TX",
        "city": "Austin",
        "zip_code": "73301",
        "phone_number": "555-345-6789",
        "email": "eve@example.com",
        "date_of_birth": "1987-01-30",
        "hashed_password": "hashed_password_5",
        "role": "FOSTER"
    },
    {
        "user_id": 6,
        "first_name": "Grace",
        "last_name": "Taylor",
        "username": "grace",
        "address": "303 Cedar St",
        "state": "FL",
        "city": "Miami",
        "zip_code": "33101",
        "phone_number": "555-456-7890",
        "email": "grace@example.com",
        "date_of_birth": "1995-02-25",
        "hashed_password": "hashed_password_6",
        "role": "ADOPTER"
    },
    {
        "user_id": 7,
        "first_name": "Hank",
        "last_name": "Wilson",
        "username": "hank",
        "address": "404 Spruce St",
        "state": "TX",
        "city": "Houston",
        "zip_code": "77001",
        "phone_number": "555-567-8901",
        "email": "hank@example.com",
        "date_of_birth": "1988-09-11",
        "hashed_password": "hashed_password_7",
        "role": "ADOPTER"
    }
];
// set up test ---------------
beforeEach(async () => {
    await Promise.all(users.map(({ user_id, first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role }) => db.run("INSERT INTO Users(user_id, first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user_id, first_name, last_name, username, address, state, city, zip_code, phone_number, email, date_of_birth, hashed_password, role])));
    await Promise.all(pets.map(({ pet_id, name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes }) => db.run("INSERT INTO Pets(pet_id, name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [pet_id, name, type, breed, size, gender, age, color, created_by_id, fosterable, pet_image_url, shelter_time, current_foster, current_adopter, notes])));
});
afterEach(async () => {
    await Promise.all([
        db.run("DELETE FROM Pets"),
        db.run("DELETE FROM Users")
    ]);
});
// GET requests (pet) ---------------
test("GET /pets/ returns all pets", async () => {
    let { data } = await axios.get("/pets");
    expect(data).toEqual({ pets });
});
test("GET /pets/user/:username returns pets made by user", async () => {
    let petsByAlice = [];
    petsByAlice.push(pets[0]);
    petsByAlice.push(pets[1]);
    let { data } = await axios.get("/pets/user/alice");
    expect(data).toEqual({ "pets": petsByAlice });
});
test("GET /pets/id/:id returns pet with id", async () => {
    let { data } = await axios.get("/pets/id/1");
    expect(data).toEqual({ "pets": pets[0] });
});
test("DELETE /pets/:id deletes pet", async () => {
    let { status } = await axios.delete("/pets/1");
    expect(status).toEqual(204);
});
// DELETE requests ---------------
test("DELETE /pets/:id invalid id returns error", async () => {
    try {
        let { status } = await axios.delete("/pets/xyz");
    }
    catch (error) {
        let errorObj = error;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(404);
        expect(response.data).toEqual({ error: "Pet not found" });
    }
});
// POST requests (pet) ---------------
test("POST /pets valid body creates pet", async () => {
    let { name, type, breed, size, gender, age, color, created_by_id, pet_image_url, shelter_time, current_foster, current_adopter, notes } = pets[0];
    let validPet = { name, type, breed, size, gender, age, color, created_by_id, fosterable: true, pet_image_url, shelter_time, current_foster, current_adopter, notes };
    try {
        let { status, data } = await axios.post("/pets", validPet);
        expect(status).toEqual(201);
        expect(data.pet_id).toEqual(6);
    }
    catch (error) {
        let errorObj = error;
        throw errorObj;
    }
});
// PUT requests (pet) ---------------
test("PUT /pets/:id edits pet", async () => {
    let editedPet = { name: "Diva", type: "Cat", breed: "Siamese", size: 2, gender: "Female", age: 1, color: "Cream", created_by_id: 2, fosterable: false, pet_image_url: "image_url_2", shelter_time: "2025-02-22", current_foster: 2, current_adopter: null, notes: "Hi" };
    let expectedPet = { pet_id: 1, name: "Diva", type: "Cat", breed: "Siamese", size: 2, gender: "Female", age: 1, color: "Cream", created_by_id: 2, fosterable: 0, pet_image_url: "image_url_2", shelter_time: "2025-02-22", current_foster: 2, current_adopter: null, notes: "Hi" };
    try {
        let { status } = await axios.put("/pets/1", editedPet);
        expect(status).toEqual(201);
        let { data } = await axios.get("/pets/id/1");
        expect(data.pets).toEqual(expectedPet);
    }
    catch (error) {
        let errorObj = error;
        throw errorObj;
    }
});
