const Product = require('../models/product.model');

class ProductService {
    async createProduct(productData) {
        return await Product.create(productData);
    }

    async getAllProducts(query = {}) {
        return await Product.find(query)
            .populate('category', 'name description')
            .sort({ createdAt: -1 });
    }

    async getProductById(id) {
        return await Product.findById(id)
            .populate('category', 'name description');
    }

    async updateProduct(id, updateData) {
        return await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('category', 'name description');
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }

    async getProductsByCategory(categoryId) {
        return await Product.find({ category: categoryId })
            .populate('category', 'name description');
    }

    async updateStock(id, quantity) {
        return await Product.findByIdAndUpdate(
            id,
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        );
    }

    async findProductByName(name) {
        return await Product.findOne({ name })
            .populate('category', 'name description');
    }
}

module.exports = new ProductService();
