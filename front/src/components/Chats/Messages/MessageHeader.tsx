import { useUser } from "../../Users/UserContext";
import {usePet} from "../../Pets/PetContext";
import { Button } from "@mui/material";
import { Conversation } from "../types";

export const MessageHeader = ( {conversation } : {conversation : Conversation}) => {
    const {getFullname} = useUser();
    const {getImageUrl, getFosterable, getName} = usePet();

    console.log(conversation);
    if (conversation.pet_id){
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3d58b', padding: '5px', width: '656px', height: '164px'}}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <img src={ (getImageUrl(conversation.pet_id)) ? (`/${getImageUrl(conversation.pet_id)}`) : ('/no_image.png')} alt={getName(conversation.pet_id)} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
              <h2 style={{ margin: '5px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>Getting to Know {getName(conversation.pet_id)}!</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="contained" style={{ backgroundColor: '#f38c52', color: 'black', fontWeight: 'bold' }}>Adopt Me Today!</Button>
            </div>
          </div>
        )
    }
    else {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f3d58b', padding: '20px', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              {/* <img src={getImageUrl(conversation.pet_id)} alt="Fluffy" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} /> */}
              <h2 style={{ margin: '10px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>Getting to Know Fluffy!</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="contained" style={{ backgroundColor: '#f38c52', color: 'black', fontWeight: 'bold' }}>Adopt Me Today!</Button>
            </div>
          </div>
        )
    }
}