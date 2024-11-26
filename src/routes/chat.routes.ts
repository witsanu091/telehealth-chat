import express from 'express';
import { saveMessage, getMessages } from '../controllers/chat.controller';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - room
 *         - sender
 *         - message
 *       properties:
 *         room:
 *           type: string
 *           description: Chat room ID
 *         sender:
 *           type: string
 *           description: Sender ID
 *         message:
 *           type: string
 *           description: The message content
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the message
 */

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     summary: Save a message
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chat'
 *     responses:
 *       201:
 *         description: The message was successfully saved
 *       500:
 *         description: Server error
 */
router.post('/message', saveMessage);

/**
 * @swagger
 * /api/chat/messages/{room}:
 *   get:
 *     summary: Get messages from a room
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: The chat room ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       500:
 *         description: Server error
 */
router.get('/messages/:room', getMessages);

export default router;
