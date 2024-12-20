const sequelize = require('../config/database.config');
const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const Supplier = require('./supplier.model');
const { Sale, SaleItem } = require('./sale.model');

// Associations
Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products'
});

Sale.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(Sale, {
    foreignKey: 'userId',
    as: 'sales'
});

SaleItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

Product.hasMany(SaleItem, {
    foreignKey: 'productId',
    as: 'saleItems'
});

// Synchronisation de la base de données (uniquement les modifications de structure)
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Synchronise uniquement les changements de structure
        console.log('Database structure synchronized');
    } catch (error) {
        console.error('Error synchronizing database structure:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    syncDatabase,
    User,
    Category,
    Product,
    Supplier,
    Sale,
    SaleItem
};
