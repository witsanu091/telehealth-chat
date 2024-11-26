import mongoose, { Schema, Document } from 'mongoose';

export interface Chat extends Document {
    room: string;
    sender: string;
    message: string;
    timestamp: Date;
}

const ChatSchema: Schema = new Schema({
    room: { type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<Chat>('Chat', ChatSchema);
