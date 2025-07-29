/* eslint-disable no-console */
import { createClient } from 'redis';
import { envVars } from './env.config';

export const redisClient = createClient({
    username: 'default',
    password: envVars.REDIS.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS.REDIS_HOST,
        port: Number(envVars.REDIS.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const redisConnected = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis connected successfully!');
    };
};