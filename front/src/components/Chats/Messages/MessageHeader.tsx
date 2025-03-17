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
    const {getFullname, getRole} = useUser();
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
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3d58b', padding: '10px', boxShadow: "0px 5px 5px #cfd6dc", position: 'relative', flexGrow: '1'}}>
              <IconButton
                style={{
                  position: 'absolute'
                }}
                onClick={() => handleBackClick()}
                >
                <CloseIcon style={{ color: 'black'}} />
              </IconButton>
              <div style={{ flex: '1', textAlign: 'center', width: '100%', flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
                <img src={ (getImageUrl(conversation.pet_id)) ? (`/${getImageUrl(conversation.pet_id)}`) : ('/no_image.png')} alt={getName(conversation.pet_id)} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                <Typography  variant="h6" style={{ margin: '5px 0', fontSize: '1.5rem' }}>Getting to Know <b>{getName(conversation.pet_id)}</b>!</Typography>
              </div>
              { (getRole(current_user) !== "STAFF") ?
              <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: '10px', marginRight: '2%', position: 'absolute', right: '10px'}}>
                <Button onClick={() => navigate(`/forms/submitAdoptionForm/${conversation.pet_id}`)} variant="contained" style={{ backgroundColor: '#ED8844', color: 'white', fontWeight: 'bold', width:'180px' }}>Adopt Me Today!</Button>
                { getFosterable(conversation.pet_id) && (getRole(conversation.user_id) === "FOSTER")? <Button onClick={() => navigate(`/forms/submitFosterPetForm/${conversation.pet_id}`)} variant="contained" style={{ backgroundColor: '#ED8844', color: 'white', fontWeight: 'bold', width:'180px' }}>Foster Me Today!</Button> :<></>}
              </div>
              :<></>}
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
                `Chat with a staff member: ${getFullname(conversation.owner_id)}` }
              </Typography>
            </div>
          </div>
        )
    }
}