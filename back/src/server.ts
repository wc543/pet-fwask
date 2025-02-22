import express, {  Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from 'socket.io';
import { createServer } from 'http';
import userRouter from './routes/userRoutes.js';
import petRouter from './routes/petRoutes.js';
import formRouter from './routes/formRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Pet Adoption Site API");
});

app.use('/api/users', userRouter);
app.use('/api/pets', petRouter);
app.use('/api/forms', formRouter);
app.use('/api/messages', messageRouter);
app.use('/api/conversations', conversationRoutes);

//Handle Socket.io Connection
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});
//TODO - Socket.io methods (Florence)

io.on('connection', (socket) =>{
  console.log('a user connected');

  socket.on('join conversation', async (roomId : string, callback: ({status}: any) => void ) =>{ //TODO any type
    await socket.join(roomId);
    callback({ status: 'room join acknowledged'});
  });

  socket.on('leave conversation',async (roomId : string, callback: ({status}: any) => void ) =>{ //TODO any type
    await socket.leave(roomId);
    callback({ status: 'room left acknowledged'});
  });

  socket.on('disconnect', () => console.log('user disconnected'));
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});