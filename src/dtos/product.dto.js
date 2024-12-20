const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(500).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0).required(),
    categoryId: Joi.string().uuid().required(),
    supplierId: Joi.string().uuid().required()
});

const updateProductSchema = Joi.object({
    name: Joi.string().max(100),
    description: Joi.string().max(500),
    price: Joi.number().min(0),
    stock: Joi.number().integer().min(0),
    categoryId: Joi.string().uuid(),
    supplierId: Joi.string().uuid()
}).min(1);

module.exports = {
    createProductSchema,
    updateProductSchema
};
