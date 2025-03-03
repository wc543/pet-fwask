import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as url from "url";
import path from 'path';
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = path.join(__dirname, "database.db");
console.log("DB file path:", dbfile);
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
export default db;
