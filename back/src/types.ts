import { z } from "zod";
import moment from "moment";

// objects for parsing
let petBodySchema = z.object({
  pet_id: z.number(),
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
  notes: z.string(),
});

let userBodySchema = z.object({
  user_id: z.number(),
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

// types
type Pet = z.infer<typeof petBodySchema>
type User = z.infer<typeof userBodySchema>;

export type { User, Pet };