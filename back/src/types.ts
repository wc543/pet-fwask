import { object, z } from "zod";
import moment from "moment";

function parseError(zodError: z.ZodError): string[] {
  let { formErrors, fieldErrors } = zodError.flatten();
  // fancy functional programming
  return [
    ...formErrors,
    ...Object.entries(fieldErrors).map(
      ([property, message]) => `"${property}": ${message}`,
    ),
  ];
};

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
  pet_image_url: z.string().nullable().optional(),
  shelter_time: z.string().refine((s) => {
    return moment(s, "YYYY-MM-DD", true).toString() !== "Invalid date";
  }),
  current_foster: z.number().nullable(),
  current_adopter: z.number().nullable(),
  notes: z.string().optional(),
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

// types
type Pet = z.infer<typeof petBodySchema>
type User = z.infer<typeof userBodySchema>;

export { petBodySchema, userBodySchema };
export type { User, Pet };

//MESSAGES TYPES
export const messageBodySchema = z.object({
    sender_id : z.number().min(1),
    message : z.string().min(1),
    conversation_id : z.number().min(1)
})

export type Message = z.infer<typeof messageBodySchema>
export type MessageRow = Message & { message_id : number, time_sent : string};
export type MessageTimeRow = {time_sent : string}

//CONVERSATIONS TYPES
export const conversationBodySchema = z.object({
    user_id : z.number().min(1),
    owner_id : z.number().min(1),
    pet_id : z.number().min(1).optional()
})

export type Conversation = z.infer<typeof conversationBodySchema>
export type ConversationRow = Conversation & { conversation_id : number, created_at : string};
