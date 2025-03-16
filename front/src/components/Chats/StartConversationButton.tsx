import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import MessageIcon from '@mui/icons-material/Message';
import Button from "@mui/material/Button";
import ProtectedLink from '../ProtectedLink';

export const StartConversationButton = ({ pet_id, employee_id }: {pet_id : number, employee_id : number}) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const current_user = auth?.user;


    const handleStartClick = async () => {
        
        if(!current_user){
            navigate('/login');
        }

        const user_id = current_user.user_id;
        console.log(pet_id, employee_id, user_id);
        try{
            const body = { user_id: user_id, owner_id: employee_id, pet_id: pet_id };
            const response = await axios.post('/api/conversations/', body);
        
            if (response.status === 200) {
              navigate(`/conversation-history/conversation/${response.data.conversation_id}`);
            }
        
            if (response.status !== 200) throw new Error(response.statusText);
         } catch (err) {
            console.error('Error sending message:', err);
        }
    }

    if (!current_user) {
        // If the user isn't logged in, wrap the button in ProtectedLink.
        return (
            <Button
                component={ProtectedLink}
                to="/login"
                message="In order to ask about this pet, you must login."
                variant='contained'
                className='actionButton'
                style={{ marginLeft: '5%', gap: '2px'}}>
                <MessageIcon sx={{color:"white"}} fontSize="medium"></MessageIcon>
                <b>Ask About Me!</b>
            </Button>
        );
    } else {
        return (
            <>
                <Button variant='contained' className='actionButton' style={{ marginLeft: '5%', gap: '2px'}} onClick={handleStartClick}> <MessageIcon sx={{color:"white"}} fontSize="medium"></MessageIcon>
                    <b>Ask About Me!</b>
                </Button>
            </>
        )
    }
}