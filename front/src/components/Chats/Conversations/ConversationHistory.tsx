import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useUser } from "../../Users/UserContext.tsx";
import { AuthContext } from "../../AuthContext.tsx";
import { Conversation } from "../types.ts";
import MessageIcon from '@mui/icons-material/Message';
import { usePet } from "../../Pets/PetContext.tsx";

export const ConversationHistory: React.FC = () => {
    const [conversations, setConversation] = useState<Conversation[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user_id = auth?.user.user_id; 
    const{ getFullname, getRole} = useUser();
    const { getName, getImageUrl} = usePet();
  
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
          <div id='content'>
            <Typography variant="h4">Messages <MessageIcon sx={{color:"#ED8844"}} fontSize="medium"></MessageIcon></Typography>

              {(conversations.length === 0)?     
              <div>
                <Typography variant="body2"><strong>No messages yet! 🐾</strong></Typography>
                <Typography variant="subtitle1">It looks like you haven't started a conversation yet. If you're ready to learn more about one of our amazing pets or have any questions about the adoption process, just click on the pet you're interested in and start a conversation! We're here to help you find your new furry friend. 🐶🐱</Typography>
              </div>  
            :
              <div className={'convoHistory'} style={{ gap: '2px'}}>
                {(conversations.map((conversation) => (
                  <Card key={conversation.conversation_id} onClick = {() => handleJoinConversation(conversation.conversation_id)} style={{margin: '3%', backgroundColor: '#cfd6dc'}}>
                    <CardContent>
                      <Grid container spacing={2} alignItems={'center'}>
                        <Grid item xs={8}>
                          <Typography variant="h6"><b>{(conversation.user_id === user_id)? getFullname(conversation.owner_id) : getFullname(conversation.user_id) }</b>,  {(conversation.user_id === user_id)? getRole(conversation.owner_id) : getFullname(conversation.user_id) }</Typography> 
                          <Typography variant="body1">{(conversation.pet_id? "Pet Inquiry for: " + getName(conversation.pet_id) : "General Question about Adopting/Fostering")}</Typography>
                        </Grid>
                        {conversation.pet_id?                         
                          <Grid item xs={4} container justifyContent={'flex-end'}>
                            <img src={ conversation.pet_id ? (`/${getImageUrl(conversation.pet_id)}`) : ''} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                          </Grid>
                        : <></>}
                      </Grid>
                    </CardContent>
                  </Card>
                )))}
              </div>
              }

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