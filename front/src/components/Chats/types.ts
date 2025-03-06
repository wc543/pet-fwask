export interface Message {
    sender_id : string,
    message : string,
    conversation_id : string;
    message_id: string;
    time_sent: string;
}

export interface Conversation {
    user_id: number;
    owner_id: number;
    conversation_id: number;
    pet_id: number | null;
    created_at: string;
  }

