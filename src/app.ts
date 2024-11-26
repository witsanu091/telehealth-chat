import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { connectRedis } from './utils/redis.util';
import chatRoutes from './routes/chat.routes';
import setupSwagger from './utils/swagger.util';
import Chat from './models/chat.model';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow these HTTP methods
    },
});

(async () => {
    try {
        // Redis Adapter
        const { pubClient, subClient } = await connectRedis(process.env.REDIS_URL || '');
        io.adapter(createAdapter(pubClient, subClient));
        console.log('Redis connected');

        // MongoDB Connection
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('MongoDB connected');

        // Middleware
        app.use(cors());
        app.use(express.json());

        // app.use((req, res, next) => {
        //     if (req.headers.upgrade && req.headers.upgrade === 'websocket') {
        //         return next();
        //     }
        //     console.log("🚀  test the web socket:")

        //     // Add your other middleware logic here if necessary
        //     next();
        // });


        // Socket.IO Events
        io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);

            // Event: join
            socket.on('join', async (room) => {
                try {
                    socket.join(room);
                    console.log(`User joined room: ${room}`);

                    // บันทึก Event ลงฐานข้อมูล
                    await Chat.create({
                        room,
                        sender: 'system',
                        message: `User joined room: ${room}`,
                    });
                } catch (error) {
                    console.error('Error handling join event:', error);
                }
            });

            // Event: leave
            socket.on('leave', async (room) => {
                try {
                    socket.leave(room);
                    console.log(`User left room: ${room}`);

                    // บันทึก Event ลงฐานข้อมูล
                    await Chat.create({
                        room,
                        sender: 'system',
                        message: `User left room: ${room}`,
                    });
                } catch (error) {
                    console.error('Error handling leave event:', error);
                }
            });

            // Event: message
            socket.on('message', async (data) => {
                try {
                    console.log('Message received:', data);

                    // บันทึกข้อความลงฐานข้อมูล
                    const chatMessage = await Chat.create({
                        room: data.room,
                        sender: data.sender,
                        message: data.message,
                    });

                    // ส่งข้อความไปยังทุกคนในห้อง
                    io.to(data.room).emit('message', chatMessage);
                } catch (error) {
                    console.error('Error handling message event:', error);
                }
            });

            // Event: disconnect
            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
        // API Routes
        app.use('/api/chat', chatRoutes);

        // Swagger Documentation
        setupSwagger(app);

        // Start the server
        const PORT = process.env.PORT || 3000;
        httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error starting server:', error);
    }
})();
