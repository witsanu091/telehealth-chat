import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, room: string): string => {
    return jwt.sign({ userId, room }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
};
