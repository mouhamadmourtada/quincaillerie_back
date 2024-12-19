const categoryService = require('../services/category.service');

class CategoryController {
    async createCategory(req, res) {
        try {
            const { name } = req.body;
            const categoryExists = await categoryService.findCategoryByName(name);

            if (categoryExists) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            }

            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
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
            res.status(500).json({ message: error.message });
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
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
