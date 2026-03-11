import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Create ioredis client
const redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || null,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'airport_drp:',
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000', 10),
    lazyConnect: true, // App does not crash before startup completes
    retryStrategy(times) {
        const maxRetries = parseInt(process.env.REDIS_MAX_RETRIES || '3', 10);
        if (times >= maxRetries) {
            console.error(`Redis connection failed after ${times} retries.`);
            return null; // Stop retrying
        }
        return 500; // Retry after 500 ms
    }
};

const redis = new Redis(redisOptions);

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    // Log error securely without exposing credentials
    console.error('Redis connection error:', err.message);
});

redis.on('close', () => {
    console.log('Redis connection closed');
});

export default redis;
