import express from 'express';
const router = express.Router();
import { messageBodySchema } from "../types.js";
import db from '../db.js';
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
router.post("/", async (req, res) => {
    const parseResults = messageBodySchema.safeParse(req.body);
    if (!parseResults.success) {
        return res.status(400).json({ error: "Bad Request" });
    }
    let { sender_id, message, conversation_id } = parseResults.data;
    try {
        await db.run(`INSERT INTO Messages (sender_id, message, conversation_id) VALUES (?, ?, ?)`, [sender_id, message, conversation_id]);
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
export default router;
