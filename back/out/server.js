import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from 'socket.io';
import { createServer } from 'http';
import userRouter from './routes/userRoutes.js';
import petRouter from './routes/petRoutes.js';
import formRouter from './routes/formRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reactAssetsPath = path.join(__dirname, "../../front/dist");
app.use(express.static(reactAssetsPath));
app.get("/", (_req, res) => {
    res.send("Pet Adoption Site API");
});
app.use('/api/users', userRouter);
app.use('/api/pets', petRouter);
app.use('/api/forms', formRouter);
app.use('/api/messages', messageRouter);
app.use('/api/conversations', conversationRoutes);
app.get("*", (req, res) => {
    return res.sendFile("index.html", { root: reactAssetsPath });
});
//Handle Socket.io Connection
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join conversation', async (conversation_id, callback) => {
        await socket.join(conversation_id);
        callback({ status: 'conversation join acknowledged' });
    });
    socket.on('leave conversation', async (conversation_id, callback) => {
        await socket.leave(conversation_id);
        callback({ status: 'conversation left acknowledged' });
    });
    socket.on('disconnect', () => console.log('user disconnected'));
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
