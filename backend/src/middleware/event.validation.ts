import Joi from 'joi';

export const createEventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    date: Joi.date().required(),
    location: Joi.string().required(),
    capacity: Joi.number().min(1).default(100).optional()
});