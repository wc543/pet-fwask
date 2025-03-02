import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import {socket} from '../../../main.tsx';
import { useUser } from "../../Users/UserContext.tsx";

interface Conversation {
    user_id: number;
    owner_id: number;
    conversation_id: number;
    pet_id: number | null;
    created_at: string;
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
        if (response.status !== 200) throw new Error(response.statusText);
        setConversation(response.data);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch forms");
      };
    }
  
    const handleJoinConversation = async (conversationId : number) => {
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
          {(conversations.length === 0)? <p>You have no conversations right now. Try starting one with a staff memeber</p>
          :
          (conversations.map((conversation) => (
            <Card key={conversation.conversation_id} onClick = {() => handleJoinConversation(conversation.conversation_id)} >
              <CardContent>
                <h2>{(conversation.user_id === user_id)? getUsername(conversation.owner_id) : getUsername(conversation.user_id) }</h2> 
              </CardContent>
            </Card>
          )))
          }
        </ul>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      
      </div>
    );
  };