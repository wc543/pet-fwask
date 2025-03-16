import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import Button from "@mui/material/Button";

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

    return (
        <>
            <Button variant='contained' className='actionButton' style={{ marginLeft: '5%' }} onClick={handleStartClick}><ModeCommentIcon htmlColor='white' style={{ padding: '5px' }}/> Ask About Me!</Button>
        </>
    )
}