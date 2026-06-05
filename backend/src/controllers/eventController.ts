import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

export const createEvent = async (req: Request, res: Response) => {
    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: (req as any).userId // Assumes auth middleware ran before
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};