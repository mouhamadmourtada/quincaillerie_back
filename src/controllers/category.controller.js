const categoryService = require('../services/category.service');

class CategoryController {
    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            console.error('Create category error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories(req.query);
            res.json(categories);
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            console.error('Get category error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            console.error('Update category error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const category = await categoryService.deleteCategory(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async searchCategories(req, res) {
        try {
            const { query } = req.query;
            const categories = await categoryService.searchCategories(query);
            res.json(categories);
        } catch (error) {
            console.error('Search categories error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getCategoryWithProducts(req, res) {
        try {
            const category = await categoryService.getCategoryWithProducts(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            console.error('Get category with products error:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
