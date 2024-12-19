const productService = require('../services/product.service');
const categoryService = require('../services/category.service');

class ProductController {
    async createProduct(req, res) {
        try {
            // Vérifier si la catégorie existe
            const category = await categoryService.getCategoryById(req.body.category);
            if (!category) {
                return res.status(400).json({ message: 'Category not found' });
            }

            const { name } = req.body;
            const productExists = await productService.findProductByName(name);
            if (productExists) {
                return res.status(400).json({ message: 'Product with this name already exists' });
            }

            const product = await productService.createProduct(req.body);
            res.status(201).json(await productService.getProductById(product._id));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (error) {
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
            res.status(500).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            if (req.body.category) {
                const category = await categoryService.getCategoryById(req.body.category);
                if (!category) {
                    return res.status(400).json({ message: 'Category not found' });
                }
            }

            const product = await productService.updateProduct(req.params.id, req.body);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
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
            res.status(500).json({ message: error.message });
        }
    }

    async getProductsByCategory(req, res) {
        try {
            const products = await productService.getProductsByCategory(req.params.categoryId);
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateStock(req, res) {
        try {
            const { quantity } = req.body;
            if (typeof quantity !== 'number') {
                return res.status(400).json({ message: 'Quantity must be a number' });
            }

            const product = await productService.updateStock(req.params.id, quantity);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ProductController();
