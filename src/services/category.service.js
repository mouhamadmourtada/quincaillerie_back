const Category = require('../models/category.model');

class CategoryService {
    async createCategory(categoryData) {
        return await Category.create(categoryData);
    }

    async getAllCategories(query = {}) {
        return await Category.find(query);
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async updateCategory(id, updateData) {
        return await Category.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);
    }

    async findCategoryByName(name) {
        return await Category.findOne({ name });
    }
}

module.exports = new CategoryService();
