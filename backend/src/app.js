import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoute from './routes/health.route.js';
import { errorHandler } from './middleware/errorHandler.js';
import pool from './config/db.js';

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/', healthRoute);

// Test DB Connection on Startup
const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    client.release(); // Release client back to the pool

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed', error.message);
    process.exit(1);
  }
};

// 404 Handler for undefined routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.statusCode = 404;
    next(error);
});

// Global Error Handler
app.use(errorHandler);

// Start the server
startServer();
