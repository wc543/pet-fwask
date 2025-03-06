import { useUser } from '../../Users/UserContext.tsx';
import Avatar from '@mui/material/Avatar';
import {Message} from '../types';
import './MessageBox.css';

export const MessageBox = ( {message: message} : {message : Message}) => {
    const {getFullname} = useUser();
    const isMine = "7" === message.sender_id? 'true' : 'false' //TODO change static current user
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
