import { Request, Response } from 'express';
import { Event } from '../models/Event.js';

// GET /events — public
export const getAllEvents = async (req: Request, res: Response) => {
    try {
        console.log('Fetching all events...')
        const events = await Event.find().sort({ date: 1 })
        console.log(`Found ${events.length} events`)
        res.json(events)
    } catch (error) {
        console.error('🔴 Error fetching events:', error)
        res.status(500).json({
            message: 'Error fetching events',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// GET /events/:id — public
export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json(event)
    } catch (error) {
        console.error('🔴 Error fetching event:', error)
        res.status(500).json({
            message: 'Error fetching event',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// POST /events — protected
export const createEvent = async (req: any, res: Response) => {
    try {
        // ✅ FIX: destructure from req.body (was missing before)
        const { title, description, date, location, capacity } = req.body

        const newEvent = new Event({
            title,
            description: description || '',
            date: new Date(date),
            location,
            capacity: capacity || 100,
            attendees: 0,
            createdBy: req.userId, // set by authMiddleware
        })

        await newEvent.save()
        res.status(201).json(newEvent)
    } catch (error) {
        console.error('🔴 Error creating event:', error)
        res.status(500).json({
            message: 'Error creating event',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// DELETE /events/:id — protected
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json({ message: 'Event deleted successfully' })
    } catch (error) {
        console.error('🔴 Error deleting event:', error)
        res.status(500).json({
            message: 'Error deleting event',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

// PUT /events/:id — protected
export const updateEvent = async (req: Request, res: Response) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json(event)
    } catch (error) {
        console.error('🔴 Error updating event:', error)
        res.status(500).json({
            message: 'Error updating event',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}