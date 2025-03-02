import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import {socket} from '../../../main.tsx';
import { useUser } from "../../Users/UserContext.tsx";
import {Message} from '../types'

interface Conversation {
    user_id: number;
    owner_id: number;
    conversation_id: string;
    pet_id: string;
    latestMessage?: string;
  }

export const ConversationHistory: React.FC = () => {
    const [conversations, setConversation] = useState<Conversation[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user_id = 7; //TODO Change- this is hank
    const{ getUsername } = useUser();

    const getAllConversations = async () => {
      try {
        setError('');
        
        const response = await axios.get<Conversation[]>(`/api/conversations/${user_id}/user`);
        console.log(response.data);
        if (response.status !== 200) throw new Error(response.statusText);
        
        // const convoWithLatestMessage = await Promise.all(response.data.map(async (conversation: Conversation) => {
        //   try {
        //     const messageResponse = await axios.get<Message>(`/api/messages/${conversation.conversation_id}/latest`);
        //     return { ...conversation, lastMessage: messageResponse.data.message || 'No messages yet' };
        //   } catch {
        //     return { ...conversation, lastMessage: 'Error fetching message' };
        //   }
        // }));

        setConversation(response.data);
        console.log(conversations);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch forms");
      };
    }
  
    const handleJoinConversation = async (conversationId : string) => {
      socket.emit('join conversation', conversationId);
      navigate(`conversation/${conversationId}`);
    }

    useEffect(() => {
      socket.on('connect', () => {
        console.log('WebSocket connected');
      });
      getAllConversations();

      return () => {
        socket.disconnect();
      };
    }, []);
  
  
    return (
      <div>
        <h2>Your Conversations</h2>
        <ul>
          {conversations.length === 0? <p>You have no conversations right now. Try starting one with a staff memeber</p>:
          
          conversations.map((conversation) => (
            <Card key={conversation.conversation_id} onClick = {() => handleJoinConversation(conversation.conversation_id)} >
              <CardContent>
                <h2>{conversation.user_id === user_id? getUsername(conversation.owner_id.toString()) : getUsername(conversation.user_id.toString()) }</h2> 
                <small>{conversation.latestMessage}</small>
                </CardContent>
            </Card>
          ))
          }

        </ul>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      
      </div>
    );
  };