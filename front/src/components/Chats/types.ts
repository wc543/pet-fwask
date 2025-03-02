export interface Message {
    sender_id : string,
    message : string,
    conversation_id : string;
    message_id: string;
    time_sent: string;
}

export interface Conversation{
    user_id : string,
    owner_id : string,
    pet_id : string,
    conversation_id : string;
}

