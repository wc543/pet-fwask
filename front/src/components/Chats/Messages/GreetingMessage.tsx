import { Typography } from "@mui/material";
import { usePet } from "../../Pets/PetContext";
import { useUser } from "../../Users/UserContext";
import { Conversation } from "../types"

export const GreetingMessage = ({conversation} : {conversation : Conversation}) => {
    const {getName} = usePet();
    const {getFullname} = useUser();
    
    return (
        <div>
        { (conversation.pet_id)? 
            <Typography>Hi there! 👋 Welcome to the adoption chat. We're so excited you're interested in giving a loving home to one of our amazing pets! 🐾 <b>{getFullname(conversation.owner_id)}</b> is assigned to answer any questions you have about <b>{getName(conversation.pet_id)}</b> or the adoption process. Feel free to share any questions in the meantime!</Typography>
            :
            <Typography>Hi there! 👋 Welcome to our chat feature. We're so excited you're interested in giving a loving home to one of our amazing pets or becoming a foster parent! 🐾 <b>{getFullname(conversation.owner_id)}</b> is assigned to answer any questions you have about fostering or the adoption process. Feel free to share any questions in the meantime!</Typography>
        }
        </div>
    )
}