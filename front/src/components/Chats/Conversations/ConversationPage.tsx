import {Message, Conversation, Callback} from '../types.ts'
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import {MessageForm} from '../Messages/MessageForm.tsx';
import {socket} from '../../../main.tsx';
import { useNavigate } from 'react-router-dom';
import {MessageBox} from '../Messages/MessageBox.tsx';
import './ConversationPage.css';
import { MessageHeader } from '../Messages/MessageHeader.tsx';
import { GreetingMessage } from '../Messages/GreetingMessage.tsx';
import BackButton from '../../BackButton.tsx';

export const ConversationPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { conversation_id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  
  const getConversation = async () => {
        try {
          setLoading(true);
          const res =  await axios.get<Conversation>(`/api/conversations/${conversation_id}`); 
          if (res.status !== 200) throw new Error(res.statusText);
          console.log(res.data);
          setConversation(res.data);
        } catch (err) {
          console.error(err);
        } finally{
          setLoading(false);
        }      
  };
  
  const getAllMessages = async () => {
    try {
        const res = await axios.get<Message[]>(`/api/messages/${conversation_id}`);
        if (res.status !== 200) throw new Error(res.statusText);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
  };

  const joinConversation = () =>{
    if (conversation_id){
      socket.emit('join conversation', conversation_id, (response: Callback) => (console.log(response.status)));
      console.log(`Joining conversation: ${conversation_id}`);
    }
  }
  
  const setChatRefToBottom = () => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = (newMessage : Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);fdsf
  };

  useEffect(() => {
    setChatRefToBottom();
  }, [messages]);

  useEffect( () => {
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('disconnect', () => console.log('Disconnected from server'));

    if(!conversation_id) {
      navigate('/error');
    }
    
    getConversation();
    joinConversation();
    getAllMessages();
    socket.on('chat message', handleNewMessage);
    setChatRefToBottom();

    return () =>{
      socket.off('connect', () => console.log('Connected to server'));
      socket.off('disconnect', () => console.log('Disconnected from server'));
      socket.off('chat message', handleNewMessage);
    };
    }
  , []);
  
    return(
      <>
      { !loading && conversation ? 
        (
          <>      
          <div className='chatFrame' >
            <BackButton/>
            <MessageHeader conversation={conversation}></MessageHeader>
            <GreetingMessage conversation={conversation}></GreetingMessage>
            <div className='allMessagesContainer' >
                {messages.map((msg) => (
                  <MessageBox message={msg}/>
                ))}
                <div ref={scrollAnchorRef}></div>
            </div>

            <MessageForm></MessageForm>
          </div>
        </>
        )
        :
        (
          <div>Loading...</div>
      )}
    </>
    )
} 