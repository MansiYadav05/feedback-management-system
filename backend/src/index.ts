import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/event-feedback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Backend API is working', mongoDBConnected: mongoose.connection.readyState === 1 });
});

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// MongoDB connection
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Make sure MongoDB is running and the connection string is correct.');
        console.error('Connection string:', MONGODB_URI);
    });

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📱 Frontend URL configured: ${FRONTEND_URL}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
