import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            default: 100,
        },
        attendees: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            default: 'upcoming',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export const Event = mongoose.model('Event', eventSchema);
