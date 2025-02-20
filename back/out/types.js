"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const moment_1 = __importDefault(require("moment"));
// objects for parsing
let petBodySchema = zod_1.z.object({
    pet_id: zod_1.z.number(),
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    breed: zod_1.z.string(),
    size: zod_1.z.number(),
    gender: zod_1.z.string(),
    age: zod_1.z.number(),
    color: zod_1.z.string(),
    created_by_id: zod_1.z.number(),
    fosterable: zod_1.z.boolean(),
    pet_image_url: zod_1.z.string(),
    shelter_time: zod_1.z.string().refine((s) => {
        return (0, moment_1.default)(s, "YYYY-MM-DD", true).toString() !== "Invalid date";
    }),
    current_foster: zod_1.z.number(),
    current_adopter: zod_1.z.number(),
    notes: zod_1.z.string(),
});
let userBodySchema = zod_1.z.object({
    user_id: zod_1.z.number(),
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    username: zod_1.z.string(),
    address: zod_1.z.string(),
    state: zod_1.z.string(),
    city: zod_1.z.string(),
    zip_code: zod_1.z.string(),
    phone_number: zod_1.z.string(),
    email: zod_1.z.string(),
    date_of_birth: zod_1.z.string().refine((s) => {
        return (0, moment_1.default)(s, "YYYY-MM-DD", true).toString() !== "Invalid date";
    }),
    hashed_password: zod_1.z.string(),
    role: zod_1.z.string(),
});
