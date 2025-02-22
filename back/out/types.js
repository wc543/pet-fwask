import { z } from "zod";
import moment from "moment";
function parseError(zodError) {
    let { formErrors, fieldErrors } = zodError.flatten();
    // fancy functional programming
    return [
        ...formErrors,
        ...Object.entries(fieldErrors).map(([property, message]) => `"${property}": ${message}`),
    ];
}
;
export { parseError };
// objects for parsing
let petBodySchema = z.object({
    name: z.string(),
    type: z.string(),
    breed: z.string(),
    size: z.number(),
    gender: z.string(),
    age: z.number(),
    color: z.string(),
    created_by_id: z.number(),
    fosterable: z.boolean(),
    pet_image_url: z.string(),
    shelter_time: z.string().refine((s) => {
        return moment(s, "YYYY-MM-DD", true).toString() !== "Invalid date";
    }),
    current_foster: z.number(),
    current_adopter: z.number(),
    notes: z.string().nullable().optional(),
});
let userBodySchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    username: z.string(),
    address: z.string(),
    state: z.string(),
    city: z.string(),
    zip_code: z.string(),
    phone_number: z.string(),
    email: z.string(),
    date_of_birth: z.string().refine((s) => {
        return moment(s, "YYYY-MM-DD", true).toString() !== "Invalid date";
    }),
    hashed_password: z.string(),
    role: z.string(),
});
export { petBodySchema, userBodySchema };
//MESSAGES TYPES
export const messageBodySchema = z.object({
    sender_id: z.number().min(1),
    message: z.string().min(1),
    conversation_id: z.number().min(1)
});
//CONVERSATIONS TYPES
export const conversationBodySchema = z.object({
    user_id: z.number().min(1),
    owner_id: z.number().min(1),
    pet_id: z.number().min(1).optional()
});
