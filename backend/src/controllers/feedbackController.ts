import { Request, Response } from 'express';
import { Feedback } from '../models/Feedback.js';

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { eventId, rating, comment, categories, email } = req.body;

        const feedback = new Feedback({
            eventId,
            rating,
            comment,
            categories,
            email,
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: 'Error creating feedback', error });
    }
};

export const getAllFeedback = async (req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find().populate('eventId').sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all feedback', error });
    }
};

export const getFeedbackByEvent = async (req: Request, res: Response) => {
    try {
        const feedback = await Feedback.find({
            eventId: req.params.eventId,
        }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error });
    }
};

export const getEventAnalytics = async (req: Request, res: Response) => {
    try {
        const eventId = req.params.eventId;
        const feedback = await Feedback.find({ eventId });

        if (feedback.length === 0) {
            res.json({
                totalFeedback: 0,
                averageRating: 0,
                categoryAverages: {},
            });
            return;
        }

        const averageRating =
            feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

        const categoryAverages = {
            organization:
                feedback.reduce((sum, f) => sum + (f.categories?.organization || 0), 0) /
                feedback.filter((f) => f.categories?.organization).length,
            content:
                feedback.reduce((sum, f) => sum + (f.categories?.content || 0), 0) /
                feedback.filter((f) => f.categories?.content).length,
            venue:
                feedback.reduce((sum, f) => sum + (f.categories?.venue || 0), 0) /
                feedback.filter((f) => f.categories?.venue).length,
            overall:
                feedback.reduce((sum, f) => sum + (f.categories?.overall || 0), 0) /
                feedback.filter((f) => f.categories?.overall).length,
        };

        res.json({
            totalFeedback: feedback.length,
            averageRating: parseFloat(averageRating.toFixed(2)),
            categoryAverages: {
                organization: parseFloat(categoryAverages.organization.toFixed(2)) || 0,
                content: parseFloat(categoryAverages.content.toFixed(2)) || 0,
                venue: parseFloat(categoryAverages.venue.toFixed(2)) || 0,
                overall: parseFloat(categoryAverages.overall.toFixed(2)) || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
};
