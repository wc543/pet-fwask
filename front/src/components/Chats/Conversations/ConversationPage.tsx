import {Message, Conversation} from '../types'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import {MessageForm} from '../Messages/MessageForm';
import { useUser } from '../../Users/UserContext.tsx';
import {socket} from '../../../main.tsx';
import { useNavigate } from 'react-router-dom';
import {MessageBox} from '../Messages/MessageBox.tsx';
import './ConversationPage.css';

export const ConversationPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { conversation_id } = useParams();
  const { getUsername } = useUser();
  const navigate = useNavigate();

  const getConversation = async () => {
        try {
          const res =  await axios.get<Conversation>(`/api/conversations/${conversation_id}`); 
          if (res.status !== 200) throw new Error(res.statusText);
          setConversation(res.data);
        } catch (err) {
          console.error(err);
        }
  };
  
  const getAllMessages = async () => {
    try {
        const res = await axios.get<Message[]>(`/api/messages/${conversation_id}`);
        if (res.status !== 200) throw new Error(res.statusText);
        console.log(res.data);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
};

useEffect( () => {
  console.log(conversation_id);
  if(conversation_id) getConversation();
    getAllMessages();
    const handleNewMessage = () => {
      getAllMessages();
    };

    socket.on('chat message', handleNewMessage);

    return () => {
      socket.off('chat message', handleNewMessage);
    };
  }
, []);
  
  return(
    <>      
    <button onClick={() => {navigate('/conversation-history');}}>Back</button>
    <div className='ChatContainer'>
      <ul>
        {messages.map((msg) => (
          <li key={msg.message_id}>{msg.message} - {getUsername(msg.sender_id)}</li>
          //TODO <MessageBox key={msg.id} message={msg} />
        ))}
      </ul>
    </div>
  <MessageForm></MessageForm>
  </>
  
  )
}