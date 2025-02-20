"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Get all pets
function getPets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pets = yield db_1.default.all("SELECT * FROM Pets");
            res.json(pets);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch pets" });
        }
    });
}
;
// Get pets by user -- username is sent in params, user_id is selected and used to find pet
function getPetsByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username } = req.params;
        try {
            let user = yield db_1.default.get(`SELECT * FROM Users WHERE username = ${username}`);
            if (!user) {
                res.status(400).json({ error: "Username does not exist" });
            }
            console.log("user", user);
            const user_id = user.user_id;
            const pets = yield db_1.default.all(`SELECT * FROM Pets WHERE created_by_id = ${user_id}`);
            if (!pets) {
                res.status(404).json({ message: "No pets created by this user" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch pets by user" });
        }
    });
}
;
router.get('/', getPets);
router.get('/:username', getPetsByUser);
exports.default = router;
