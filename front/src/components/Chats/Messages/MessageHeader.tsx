import { useUser } from "../../Users/UserContext";
import {usePet} from "../../Pets/PetContext";
import { Button, IconButton } from "@mui/material";
import { Callback, Conversation } from "../types";
import Typography from '@mui/material/Typography';
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../main";
import CloseIcon from '@mui/icons-material/Close';

export const MessageHeader = ( {conversation } : {conversation : Conversation}) => {
    const {getFullname} = useUser();
    const {getImageUrl, getFosterable, getName} = usePet();
    const auth = useContext(AuthContext);
    const current_user = auth?.user.user_id;
    const isOwner = (current_user === conversation.owner_id)
    const navigate = useNavigate();

      const leaveConversation = () =>{
        socket.emit('leave conversation', conversation.conversation_id, (response: Callback) => (console.log(response.status)));
        console.log(`Leaving conversation: ${conversation.conversation_id}`);
      }
    
      const handleBackClick = () =>{
        leaveConversation();
        navigate('/conversation-history');
      }

    if (conversation.pet_id){
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3d58b', padding: '5px' }}>
              <IconButton
                style={{
                  left: '2px',
                  top: '2px'
                }}
                onClick={() => handleBackClick()}
                >
                <CloseIcon style={{ color: 'black' }} />
              </IconButton>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <img src={ (getImageUrl(conversation.pet_id)) ? (`/${getImageUrl(conversation.pet_id)}`) : ('/no_image.png')} alt={getName(conversation.pet_id)} style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover' }} />
                <Typography  variant="h6" style={{ margin: '5px 0', fontSize: '1.5rem' }}>Getting to Know {getName(conversation.pet_id)}!</Typography>
              </div>
              <div style={{ display: 'block', alignItems: 'center', columnGap: '10px' }}>
                <Button variant="contained" style={{ backgroundColor: '#f38c52', color: 'black', fontWeight: 'bold' }}>Adopt Me Today!</Button>
                { getFosterable(conversation.pet_id)? <Button variant="contained" style={{ backgroundColor: '#f38c52', color: 'black', fontWeight: 'bold' }}>Foster Me Today!</Button> :<></>}
              </div>
          </div>
        )
    }
    else {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3d58b', padding: '20px', borderRadius: '12px' }}>
            <IconButton
              style={{
                left: '10px',
                top: '10px'
              }}
              onClick={() => handleBackClick()}
              >
              <CloseIcon style={{ color: 'black' }} />
            </IconButton>
            <div style={{ textAlign: 'center' }}>
              <Typography  variant="h6" style={{ margin: '5px 0', fontSize: '1.5rem' }}>
                {isOwner? 
                  `Chat with customer: ${getFullname(conversation.user_id)}`
                :
                `Chat with a staff member: ${getFullname(conversation.owner_id)}!` }
              </Typography>
            </div>
          </div>
        )
    }
}