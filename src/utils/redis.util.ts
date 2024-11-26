import { createClient } from 'redis';

export const connectRedis = async (redisUrl: string) => {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    console.log('Redis connected');
    return { pubClient, subClient };
};
