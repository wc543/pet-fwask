import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import { useUser } from "../../Users/UserContext.tsx";
import { AuthContext } from "../../AuthContext.tsx";
import { Conversation } from "../types.ts";

export const ConversationHistory: React.FC = () => {
    const [conversations, setConversation] = useState<Conversation[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user_id = auth?.user.user_id; 
    const{  getFullname } = useUser();
  
    const getAllConversations = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get<Conversation[]>(`/api/conversations/${user_id}/user`);
        if (response.status !== 200) throw new Error(response.statusText);
        setConversation(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch forms");
      } finally{
        setLoading(false);
      };

    }
  
    const handleJoinConversation = async (conversationId : number) => {
      navigate(`conversation/${conversationId}`);
    }

    useEffect(() => {
      getAllConversations();
    }, []);
  
    return (
      <>
        { !loading? 
        (
          <div>
            <h2>Your Conversations</h2>
            <ul>
              {(conversations.length === 0)?     
              <div>
                <p><strong>No messages yet! 🐾</strong></p>
                <p>It looks like you haven't started a conversation yet. If you're ready to learn more about one of our amazing pets or have any questions about the adoption process, just click on the pet you're interested in and start a conversation! We're here to help you find your new furry friend. 🐶🐱</p>
              </div>  
            :
              (conversations.map((conversation) => (
                <Card key={conversation.conversation_id} onClick = {() => handleJoinConversation(conversation.conversation_id)} >
                  <CardContent>
                    <h2>{(conversation.user_id === user_id)? getFullname(conversation.owner_id) : getFullname(conversation.user_id) }</h2> 
                  </CardContent>
                </Card>
              )))
              }
            </ul>
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </div>
        )
        :
        (
          <div>Loading...</div>
        )
        }
      </>
    );
  };