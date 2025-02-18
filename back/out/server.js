"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const petRoutes_1 = __importDefault(require("./routes/petRoutes"));
const formRoutes_1 = __importDefault(require("./routes/formRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const DB_PATH = path_1.default.join(__dirname, "../database.db");
// Initialize Database if not exists
if (!fs_1.default.existsSync(DB_PATH)) {
    console.log("Database file not found. Initializing database...");
    (0, child_process_1.execSync)(`sqlite3 ${DB_PATH} < ${path_1.default.join(__dirname, "../setup.sql")}`);
}
const db = new sqlite3_1.default.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    }
    else {
        console.log("Connected to SQLite database.");
        db.run("PRAGMA foreign_keys = ON");
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.use('/api/pets', petRoutes_1.default);
app.use('/api/forms', formRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("Pet Adoption Site API");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
