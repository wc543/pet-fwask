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
import { MessageHeader } from '../Messages/MessageHeader.tsx';

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
          console.log(res.data);
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

  const joinConversation = () =>{
    if (conversation_id){
      socket.emit('join conversation', conversation_id, (response: any) => (console.log(response.status)));
      console.log(`Joining conversation: ${conversation_id}`);
    }
  }

  const leaveConversation = () =>{
    if (conversation_id){
      socket.emit('leave conversation', conversation_id, (response: any) => (console.log(response.status)));
      console.log(`Leaving conversation: ${conversation_id}`);
    }
  }

  const handleBackClick = () =>{
    leaveConversation();
    navigate('/conversation-history');
  }
  
  const handleNewMessage = (newMessage : Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect( () => {
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('disconnect', () => console.log('Disconnected from server'));

    if(conversation_id) {
      getConversation();
      joinConversation();
    }
    getConversation();
    getAllMessages();

    socket.on('chat message', handleNewMessage);

    return () =>{
      socket.off('connect', () => console.log('Connected to server'));
      socket.off('disconnect', () => console.log('Disconnected from server'));
      socket.off('chat message', handleNewMessage);
    };
    }
  , []);
  
  if(conversation=== null){
    navigate("*");
  }
  else{
    return(
      <>      
      <button onClick={() => {handleBackClick();}}>Back</button>
      <MessageHeader conversation={conversation}></MessageHeader>
      <div className='chatFrame'>
      <div className='chatMessagesContainer'>
        <ul>
          {messages.map((msg) => (
            <li key={msg.message_id}>{msg.message} - {getUsername(msg.sender_id)}</li>
            //TODO <MessageBox key={msg.id} message={msg} />
          ))}
        </ul>
      </div>
      <MessageForm></MessageForm>
      </div>
    </>
    
    )
  }

}