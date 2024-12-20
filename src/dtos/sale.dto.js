const Joi = require('joi');

const saleItemSchema = Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required()
});

const createSaleSchema = Joi.object({
    customerName: Joi.string().max(100).required(),
    customerPhone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required(),
    paymentType: Joi.string().valid('CARD', 'CASH', 'TRANSFER').required(),
    items: Joi.array().items(saleItemSchema).min(1).required(),
    status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED').default('PENDING'),
    saleDate: Joi.date().default(Date.now),
    paymentDate: Joi.date().when('status', {
        is: 'PAID',
        then: Joi.date().default(Date.now),
        otherwise: Joi.date().allow(null)
    })
});

const updateSaleSchema = Joi.object({
    customerName: Joi.string().max(100),
    customerPhone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/),
    paymentType: Joi.string().valid('CARD', 'CASH', 'TRANSFER'),
    paymentDate: Joi.date().when('status', {
        is: 'PAID',
        then: Joi.date(),
        otherwise: Joi.date().allow(null)
    }),
    status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED')
});

module.exports = {
    createSaleSchema,
    updateSaleSchema,
    saleItemSchema
};
