import express from 'express';
const router = express.Router();
import { conversationBodySchema } from "../types.js";
import db from '../db.js';
router.get("/:conversation_id", async (req, res) => {
    const { conversation_id } = req.params;
    try {
        const conversation = await db.get(`SELECT * FROM Conversations
         WHERE conversation_id = ? `, [conversation_id]);
        console.log("conversations: " + conversation);
        res.status(200).json(conversation);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Gets conversation based on specifc user (use to load each user's chat page)
router.get("/:user_id", async (req, res) => {
    const { employee_id } = req.params;
    try {
        const conversation = await db.get(`SELECT * FROM Conversations
         WHERE employee_id = ? `, [employee_id]);
        console.log("conversations: " + conversation);
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
    let { conversation_id, user_id, employee_id, pet_id } = parseResults.data;
    try {
        await db.run(`INSERT INTO Conversations (user_id, employee_id, pet_id, conversation_id) VALUES (?, ?, ?, ?)`, [user_id, employee_id, pet_id, conversation_id]);
        const conversation = await db.get(`SELECT * FROM Conversations
         WHERE employee_id = ? `, [employee_id]);
        res.status(200).json(conversation);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
