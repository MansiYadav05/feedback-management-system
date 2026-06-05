import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL || 'admin@eventhub.com';

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const isRegisteringAsAdmin = role === 'admin';
        const isMainAdmin = email.toLowerCase() === MAIN_ADMIN_EMAIL;

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            role: role || 'attendee',
            // Attendees are approved by default. Admins need approval unless it's the main admin.
            isApproved: !isRegisteringAsAdmin || isMainAdmin,
        });

        await newUser.save();

        // If it's a new admin registration (not the main one), notify and exit without token
        if (isRegisteringAsAdmin && !isMainAdmin) {
            console.log(`[ACTION REQUIRED] New admin registration request from ${email}. Please approve this at the database level or via an admin panel.`);
            // NOTE: Here is where you would integrate Nodemailer to send an actual email to MAIN_ADMIN_EMAIL
            
            return res.status(201).json({
                message: 'Admin registration request submitted. Please wait for approval from the main admin before logging in.',
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if admin is approved
        if (user.role === 'admin' && (user as any).isApproved === false) {
            return res.status(403).json({ message: 'Your admin account is pending approval by the main admin.' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Verify token
router.post('/verify', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

export default router;
