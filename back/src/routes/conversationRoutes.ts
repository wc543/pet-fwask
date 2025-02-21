import express, { Request, Response } from 'express';
const router = express.Router();
import {ConversationRow, conversationBodySchema} from "../types.js";
import db from '../db.js';

// Gets conversation based on it's id
router.get("/:conversation_id", async (req : Request, res : Response) => {
    const {conversation_id} = req.params;
    try {
      const conversation = await db.get(
        `SELECT * FROM Conversations
         WHERE conversation_id = ? `,
        [conversation_id]
      );
      console.log("conversations: " + conversation);
      res.status(200).json(conversation);
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

// Gets conversation based on specifc user (will use to load all conversation for user's chat page)
router.get("/:user_id/user", async (req : Request, res : Response) => {
    const {user_id} = req.params;
    try {
      const conversation = await db.all<ConversationRow[]>(
        `SELECT * FROM Conversations
         WHERE owner_id = ? OR user_id = ?`,
        [user_id, user_id]
      );
      console.log("conversations: " + conversation);
      res.json(conversation);
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

//Starts a conversation between two users
router.post("/", async (req : Request, res : Response) => {
    const parseResults = conversationBodySchema.safeParse(req.body);
    if(!parseResults.success){
      return res.status(400).json({ error: "Bad Request" });
    }
    let {conversation_id, user_id, owner_id, pet_id} = parseResults.data;
    try {
      await db.run(
        `INSERT INTO Conversations (user_id, owner_id, pet_id, conversation_id) VALUES (?, ?, ?, ?)`, [user_id, owner_id, pet_id, conversation_id]
      );
  
      res.status(200).json();
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
});
  
//Deletes a conversation based on its conversation_id
//TODO add user authorization to ensure only the logged in OWNER (not the other user) can delete their own conversation
router.delete("/:conversation_id", async (req : Request, res : Response) => {
  const {conversation_id} = req.params;
  try {
    const conversation = await db.run(
      `DELETE FROM Conversations
       WHERE conversation_id = ? `,
      [conversation_id]
    );
    if (conversation.changes === 0 ){
      return res.status(404).json({ error: "Conversation not found or Unauthorized action" });
    }
    res.status(200).send();
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

