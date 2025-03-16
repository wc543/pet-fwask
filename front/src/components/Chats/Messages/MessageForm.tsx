import axios from 'axios';
import { FormEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {socket} from '../../../main.tsx';
import { TextField, Button } from '@mui/material';
import './MessageForm.css'
import { AuthContext } from '../../AuthContext.tsx';
import { Callback } from '../types.ts';

export const MessageForm = () => {
  const { conversation_id } = useParams();
  const [message, setMessage] = useState('');
  const auth = useContext(AuthContext);
  const sender_id = auth?.user.user_id; 

  const conversationIdAsNumber = conversation_id ? parseInt(conversation_id, 10) : NaN;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    try {
      const body = { message: message, sender_id: sender_id, conversation_id: conversationIdAsNumber };
      const response = await axios.post('/api/messages/', body);
      const responseMessage =  { ...body, time_sent: response.data.time_sent };

      if (response.status === 200) {
        console.log(response);
        socket.emit('chat message', responseMessage, (response: Callback) => (console.log(response.status)));
      }
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="wrapForm">
        <TextField
          size='small'
          id="message"
          name="message"
          label="Write a message..."
          value={message}
          autoComplete="off"
          onChange={(e) => setMessage(e.target.value)}
          className="wrapText"
        />
        <Button type="submit" variant="contained" color="primary" className="button">
          Send
        </Button>
      </form>
    </div>
  );
};