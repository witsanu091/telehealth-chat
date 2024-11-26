import { Request, Response } from 'express';
import Chat from '../models/chat.model';

export const saveMessage = async (req: Request, res: Response) => {
    try {
        const { room, sender, message } = req.body;
        const chat = new Chat({ room, sender, message });
        await chat.save();
        res.status(201).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { room } = req.params;
        const messages = await Chat.find({ room }).sort({ timestamp: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};
