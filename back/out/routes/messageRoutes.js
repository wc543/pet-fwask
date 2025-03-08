import express from 'express';
const router = express.Router();
import { messageBodySchema, parseError } from "../types.js";
import db from '../db.js';
//Gets messages based on specifc conversation_id (will use to obtain all messages in the chat view)
router.get("/:conversation_id", async (req, res) => {
    const { conversation_id } = req.params;
    try {
        const messages = await db.all(`SELECT * FROM Messages
         WHERE conversation_id = ? 
         ORDER BY time_sent ASC`, [conversation_id]);
        res.json(messages);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//Gets latest messages based on specifc conversation_id 
router.get("/:conversation_id/latest/", async (req, res) => {
    const { conversation_id } = req.params;
    try {
        const messages = await db.all(`SELECT * FROM Messages
       WHERE conversation_id = ? 
         ORDER BY time_sent DESC
         LIMIT 1`, [conversation_id]);
        res.json(messages);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//Post a message to the database
router.post("/", async (req, res) => {
    const parseResults = messageBodySchema.safeParse(req.body);
    if (!parseResults.success) {
        return res.status(400).json({ error: parseError(parseResults.error) });
    }
    let { sender_id, message, conversation_id } = parseResults.data;
    try {
        await db.run(`INSERT INTO Messages (sender_id, message, conversation_id, read) VALUES (?, ?, ?, FALSE)`, [sender_id, message, conversation_id]);
        const row = await db.get(`SELECT time_sent FROM Messages WHERE conversation_id = ? ORDER BY time_sent DESC LIMIT 1`, [conversation_id]);
        if (!row || !row.time_sent) {
            console.error("Database error: No timestamp returned.");
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json({ time_sent: row.time_sent });
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//Updates message as read when joining a conversation
router.put("/:conversation_id/read", async (req, res) => {
    const { conversation_id } = req.params;
    try {
        await db.run(`UPDATE Messages SET read = TRUE
       WHERE conversation_id = ? 
       AND sender_id != ?`, [conversation_id, req.params.user]);
        res.status(200);
    }
    catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
