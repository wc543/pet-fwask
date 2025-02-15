import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "../database.db");

// Initialize Database if not exists
if (!fs.existsSync(DB_PATH)) {
  console.log("Database file not found. Initializing database...");
  execSync(`sqlite3 ${DB_PATH} < ${path.join(__dirname, "../setup.sql")}`);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run("PRAGMA foreign_keys = ON");
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Pet Adoption Site API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});