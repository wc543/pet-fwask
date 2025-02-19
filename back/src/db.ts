import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";

const DB_PATH = path.join(__dirname, "../database.db");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run("PRAGMA foreign_keys = ON");
  }
});

const all = promisify(db.all.bind(db));
const get = promisify(db.get.bind(db));
const run = promisify(db.run.bind(db));

export default {db, all, get, run};
