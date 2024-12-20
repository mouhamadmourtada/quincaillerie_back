const productService = require('../services/product.service');

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            console.error('Create product error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts(req.query);
            res.json(products);
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            console.error('Update product error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const product = await productService.deleteProduct(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductsByCategory(req, res) {
        try {
            const products = await productService.getProductsByCategory(req.params.categoryId);
            res.json(products);
        } catch (error) {
            console.error('Get products by category error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async getLowStockProducts(req, res) {
        try {
            const threshold = parseInt(req.query.threshold) || 10;
            const products = await productService.getLowStockProducts(threshold);
            res.json(products);
        } catch (error) {
            console.error('Get low stock products error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async searchProducts(req, res) {
        try {
            const { query } = req.query;
            const products = await productService.searchProducts(query);
            res.json(products);
        } catch (error) {
            console.error('Search products error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateStock(req, res) {
        try {
            const { quantity } = req.body;
            const product = await productService.updateStock(req.params.id, quantity);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            console.error('Update stock error:', error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ProductController();
