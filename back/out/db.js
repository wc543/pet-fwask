"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
const DB_PATH = path_1.default.join(__dirname, "../database.db");
const db = new sqlite3_1.default.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    }
    else {
        console.log("Connected to SQLite database.");
        db.run("PRAGMA foreign_keys = ON");
    }
});
const all = (0, util_1.promisify)(db.all.bind(db));
const get = (0, util_1.promisify)(db.get.bind(db));
const run = (0, util_1.promisify)(db.run.bind(db));
exports.default = { db, all, get, run };
