export interface Message {
    sender_id : number,
    message : string,
    conversation_id : number;
    message_id: number;
    time_sent: string;
}

export interface Conversation {
    user_id: number;
    owner_id: number;
    conversation_id: number;
    pet_id: number | null;
    created_at: string;
  }

