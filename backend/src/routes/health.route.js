import express from 'express';
import pool from '../config/db.js';
import redis from '../config/redis.js';

const router = express.Router();

router.get('/health', async (req, res) => {
    let postgresStatus = 'connected';
    let redisStatus = 'connected';
    let isHealthy = true;

    try {
        const client = await pool.connect();
        client.release();
    } catch (e) {
        postgresStatus = 'disconnected';
        isHealthy = false;
    }

    try {
        await redis.ping();
    } catch (e) {
        redisStatus = 'disconnected';
        isHealthy = false;
    }

    if (isHealthy) {
        res.status(200).json({
            status: 'ok',
            postgres: postgresStatus,
            redis: redisStatus
        });
    } else {
        res.status(503).json({
            status: 'degraded',
            postgres: postgresStatus,
            redis: redisStatus
        });
    }
});

export default router;
