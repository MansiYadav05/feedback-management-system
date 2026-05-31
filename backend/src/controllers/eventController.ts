import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        console.log('Fetching all events...');
        const events = await Event.find().sort({ date: 1 });
        console.log(`Found ${events.length} events`);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
            message: 'Error fetching events',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching event',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, description, date, location, capacity } = req.body;

        const event = new Event({
            title,
            description,
            date,
            location,
            capacity,
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({
            message: 'Error creating event',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({
            message: 'Error updating event',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting event',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
