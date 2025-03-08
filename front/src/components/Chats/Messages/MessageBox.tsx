import { useUser } from '../../Users/UserContext.tsx';
import Avatar from '@mui/material/Avatar';
import {Message} from '../types';
import './MessageBox.css';
import { AuthContext } from '../../AuthContext.tsx';
import { useContext } from 'react';

export const MessageBox = ( {message: message} : {message : Message}) => {
    const {getFullname, getRole} = useUser();
    const auth = useContext(AuthContext);
    const user_id = auth?.user.user_id; 
    const time = new Date(message.time_sent).toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',hour12: true});;
    const isMine = user_id === message.sender_id? true : false ;
    
    return (
        <>
            <div className={`messageContainer`}>
                {isMine? <></> : <Avatar ></Avatar>}
                <div className={isMine? 'myMessage' : 'otherMessage'}>
                    
                    <p><b>{getFullname(message.sender_id)}</b>, {getRole(message.sender_id)}</p>
                    <div className={isMine?  'messageOrange': 'messageBlue'}>
                        <p className='styledMessage'>{message.message}</p>
                    </div>

                    <small>{time}</small>
                </div>
            </div>
        </>
    )
}
