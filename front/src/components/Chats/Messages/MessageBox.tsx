import { useUser } from '../../Users/UserContext.tsx';
import Avatar from '@mui/material/Avatar';
import {Message} from '../types';
import './MessageBox.css';
import { AuthContext } from '../../AuthContext.tsx';
import { useContext } from 'react';

export const MessageBox = ( {message: message} : {message : Message}) => {
    const {getFullname} = useUser();
    const auth = useContext(AuthContext);
    const user_id = auth?.user.user_id; 

    const isMine = user_id === message.sender_id? 'true' : 'false' //TODO change static current user
    
    if(isMine){
        return (
            <>
                <div className={`messageContainer }`}>
                <Avatar></Avatar>
                <p className='styledMessage'>{message.message}</p>
                <small>{message.time_sent}</small>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={`messageContainer ${isMine? 'myMessage' : 'otherMessage'}`}>
            <Avatar></Avatar>
            <p className='styledMessage'>{message.message}</p>
            <small>{message.time_sent}</small>
            </div>
        </>
    )
}
