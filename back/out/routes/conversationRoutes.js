import express from 'express';
const router = express.Router();
import { conversationBodySchema } from "../types.js";
import db from '../db.js';
import authMiddleware from '../authMiddleware.js';
// Gets conversation based on it's id
router.get("/:conversation_id", async (req, res) => {
    const { conversation_id } = req.params;
    try {
        const conversation = await db.get(`SELECT * FROM Conversations
         WHERE conversation_id = ? `, [conversation_id]);
        res.status(200).json(conversation);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Gets conversation based on specifc user (will use to load all conversation for user's chat page)
router.get("/:user_id/user", async (req, res) => {
    const { user_id } = req.params;
    try {
        const conversation = await db.all(`SELECT * FROM Conversations
         WHERE owner_id = ? OR user_id = ?`, [user_id, user_id]);
        res.json(conversation);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//Starts a conversation between two users
router.post("/", async (req, res) => {
    const parseResults = conversationBodySchema.safeParse(req.body);
    if (!parseResults.success) {
        return res.status(400).json({ error: "Bad Request" });
    }
    let { user_id, owner_id, pet_id } = parseResults.data;
    try {
        const conversation = await db.get(`INSERT INTO Conversations (user_id, owner_id, pet_id) VALUES (?, ?, ?) RETURNING conversation_id`, [user_id, owner_id, pet_id || null]);
        if (!conversation) {
            return res.status(500).json({ error: "Failed to create a new conversation" });
        }
        res.status(200).json({ conversation_id: conversation.conversation_id });
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//Deletes a conversation based on its conversation_id
//TODO add user authorization to ensure only the logged in OWNER (not the other user) can delete their own conversation
router.delete("/:conversation_id", authMiddleware, async (req, res) => {
    const { conversation_id } = req.params;
    try {
        const conversation = await db.run(`DELETE FROM Conversations
       WHERE conversation_id = ? `, [conversation_id]);
        if (conversation.changes === 0) {
            return res.status(404).json({ error: "Conversation not found or Unauthorized action" });
        }
        res.status(200).send();
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
