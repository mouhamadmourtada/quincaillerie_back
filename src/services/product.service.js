const { Product, Category } = require('../models');
const { Op } = require('sequelize');

class ProductService {
    async createProduct(productData) {
        return await Product.create(productData);
    }

    async getAllProducts(query = {}) {
        const where = {};
        if (query.name) {
            where.name = { [Op.like]: `%${query.name}%` };
        }
        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }
        if (query.minPrice) {
            where.price = { ...where.price, [Op.gte]: query.minPrice };
        }
        if (query.maxPrice) {
            where.price = { ...where.price, [Op.lte]: query.maxPrice };
        }

        return await Product.findAll({
            where,
            include: [{
                model: Category,
                as: 'category'
            }],
            order: [['name', 'ASC']]
        });
    }

    async getProductById(id) {
        return await Product.findByPk(id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });
    }

    async updateProduct(id, updateData) {
        const product = await Product.findByPk(id);
        if (!product) return null;

        return await product.update(updateData);
    }

    async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (!product) return null;

        await product.destroy();
        return product;
    }

    async getProductsByCategory(categoryId) {
        return await Product.findAll({
            where: { categoryId },
            include: [{
                model: Category,
                as: 'category'
            }]
        });
    }

    async getLowStockProducts(threshold = 10) {
        return await Product.findAll({
            where: {
                stock: {
                    [Op.lte]: threshold
                }
            },
            include: [{
                model: Category,
                as: 'category'
            }]
        });
    }

    async searchProducts(searchTerm) {
        return await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchTerm}%` } },
                    { '$category.name$': { [Op.like]: `%${searchTerm}%` } }
                ]
            },
            include: [{
                model: Category,
                as: 'category'
            }]
        });
    }

    async updateStock(id, quantity) {
        const product = await Product.findByPk(id);
        if (!product) return null;

        return await product.update({
            stock: product.stock + quantity
        });
    }
}

module.exports = new ProductService();
