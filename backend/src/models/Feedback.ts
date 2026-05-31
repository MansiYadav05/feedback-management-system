import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            default: '',
        },
        categories: {
            organization: { type: Number, min: 1, max: 5 },
            content: { type: Number, min: 1, max: 5 },
            venue: { type: Number, min: 1, max: 5 },
            overall: { type: Number, min: 1, max: 5 },
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
