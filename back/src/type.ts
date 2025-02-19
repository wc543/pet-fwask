import {z} from "zod";

//MESSAGES
export const messageBodySchema = z.object({
    sender_id : z.number().min(1),
    receiver_id : z.number().min(1),
    message : z.string().min(1),
    conversation_id : z.string().min(1)
})

export type Message = z.infer<typeof messageBodySchema>
export type MessageRow = Message & { message_id : number, time_sent : string};

//CONVERSATIONS
export const conversationBodySchema = z.object({
    conversation_id : z.number().min(1),
    adopter_id : z.number().min(1),
    employee_id : z.string().min(1),
    pet_id : z.string().min(1).optional()
})

export type Conversation = z.infer<typeof conversationBodySchema>
export type ConversationRow = Conversation & { conversation_id : number, created_at : string};
