const { Category, Product } = require('../models');
const { Op } = require('sequelize');

class CategoryService {
    async createCategory(categoryData) {
        // Vérifier si la catégorie existe déjà
        const existingCategory = await this.findCategoryByName(categoryData.name);
        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }
        return await Category.create(categoryData);
    }

    async getAllCategories(query = {}) {
        const where = {};
        if (query.name) {
            where.name = { [Op.like]: `%${query.name}%` };
        }

        return await Category.findAll({
            where,
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'name']
            }],
            order: [['name', 'ASC']]
        });
    }

    async getCategoryById(id) {
        return await Category.findByPk(id, {
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'name', 'price', 'stock']
            }]
        });
    }

    async updateCategory(id, updateData) {
        const category = await Category.findByPk(id);
        if (!category) return null;

        // Si le nom est modifié, vérifier qu'il n'existe pas déjà
        if (updateData.name && updateData.name !== category.name) {
            const existingCategory = await this.findCategoryByName(updateData.name);
            if (existingCategory) {
                throw new Error('Category with this name already exists');
            }
        }

        return await category.update(updateData);
    }

    async deleteCategory(id) {
        const category = await Category.findByPk(id);
        if (!category) return null;

        await category.destroy();
        return category;
    }

    async findCategoryByName(name) {
        return await Category.findOne({
            where: {
                name: name
            }
        });
    }

    async searchCategories(searchTerm) {
        return await Category.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchTerm}%` } },
                    { description: { [Op.like]: `%${searchTerm}%` } }
                ]
            },
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'name']
            }]
        });
    }

    async getCategoryWithProducts(id) {
        return await Category.findByPk(id, {
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'name', 'price', 'stock']
            }]
        });
    }
}

module.exports = new CategoryService();
