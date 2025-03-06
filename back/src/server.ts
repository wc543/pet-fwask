import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from 'socket.io';
import { createServer } from 'http';
import userRouter from './routes/userRoutes.js';
import petRouter from './routes/petRoutes.js';
import formRouter from './routes/formRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js'
import path from "path";
import { fileURLToPath } from "url";
import multer from 'multer';
import { Message } from "./types.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

let reactAssetsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../front/dist");
app.use(express.static(reactAssetsPath));

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/pets', petRouter);
app.use('/api/forms', formRouter);
app.use('/api/messages', messageRouter);
app.use('/api/conversations', conversationRoutes);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("*", (req, res) => {
  return res.sendFile("index.html", { root: reactAssetsPath });
});

//Handle Socket.io Connection
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join conversation', async (conversation_id: string, callback: ({ status }: any) => void) => { 
    await socket.join(conversation_id);
    callback({ status: `conversation ${conversation_id} join acknowledged` });
  });

  socket.on('leave conversation', async (conversation_id: string, callback: ({ status }: any) => void) => { 
    await socket.leave(conversation_id);
    callback({ status: 'conversation left acknowledged' });
  });

  socket.on('chat message', async (message: Message, callback: ({ status }: any) => void) => { 
    io.to(message.conversation_id.toString()).emit('chat message', message);
    callback({ status: 'message sent' });
  });
  socket.on('disconnect', () => console.log('user disconnected'));
});

// File handling for uploading pet pictures -----

// Set up storage destination and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '../../front/public/'); // Save files to frontend public folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp to avoid conflicts
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filePath: `${req.file.filename}` });
});

// -----

app.get("*", (req, res) => {
  return res.sendFile("index.html", { root: reactAssetsPath })
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;