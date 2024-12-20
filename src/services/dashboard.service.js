const { Sale, Product, Category, SaleItem } = require('../models');
const { Op, Sequelize } = require('sequelize');

class DashboardService {
    async getStats() {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        try {
            const [
                totalRevenue,
                totalSales,
                averageOrderValue,
                topProducts,
                recentSales,
                monthlySales,
                lowStockProducts,
                categoryDistribution,
                paymentMethodDistribution
            ] = await Promise.all([
                // Total des revenus
                Sale.sum('totalAmount', {
                    where: { status: 'PAID' }
                }),

                // Nombre total de ventes
                Sale.count({
                    where: { status: 'PAID' }
                }),

                // Valeur moyenne des commandes
                Sale.findOne({
                    attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('totalAmount')), 'averageAmount']
                    ],
                    where: { status: 'PAID' }
                }),

                // Produits les plus vendus
                SaleItem.findAll({
                    attributes: [
                        'productId',
                        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']
                    ],
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['name', 'price']
                    }],
                    group: ['productId', 'product.id', 'product.name', 'product.price'],
                    order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']],
                    limit: 5
                }),

                // Ventes récentes
                Sale.findAll({
                    include: [{
                        model: SaleItem,
                        as: 'items',
                        include: [{
                            model: Product,
                            as: 'product'
                        }]
                    }],
                    order: [['createdAt', 'DESC']],
                    limit: 5
                }),

                // Ventes par mois
                Sale.findAll({
                    attributes: [
                        [Sequelize.fn('DATE_FORMAT', Sequelize.col('saleDate'), '%Y-%m'), 'month'],
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'total']
                    ],
                    where: {
                        saleDate: {
                            [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
                        },
                        status: 'PAID'
                    },
                    group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('saleDate'), '%Y-%m')],
                    order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('saleDate'), '%Y-%m'), 'ASC']]
                }),

                // Produits en stock faible
                Product.findAll({
                    where: {
                        stock: { [Op.lte]: 10 }
                    },
                    include: [{
                        model: Category,
                        as: 'category'
                    }],
                    order: [['stock', 'ASC']],
                    limit: 10
                }),

                // Distribution par catégorie
                SaleItem.findAll({
                    attributes: [
                        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
                        [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalAmount']
                    ],
                    include: [{
                        model: Product,
                        as: 'product',
                        include: [{
                            model: Category,
                            as: 'category',
                            attributes: ['name']
                        }]
                    }],
                    group: ['product.categoryId', 'product.category.id', 'product.category.name']
                }),

                // Distribution des méthodes de paiement
                Sale.findAll({
                    attributes: [
                        'paymentType',
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'total']
                    ],
                    where: { status: 'PAID' },
                    group: ['paymentType']
                })
            ]);

            return {
                totalRevenue: totalRevenue || 0,
                totalSales: totalSales || 0,
                averageOrderValue: averageOrderValue?.getDataValue('averageAmount') || 0,
                topProducts: topProducts.map(item => ({
                    productId: item.productId,
                    name: item.product.name,
                    totalQuantity: parseInt(item.getDataValue('totalQuantity')),
                    price: item.product.price
                })),
                recentSales,
                monthlySales: monthlySales.map(item => ({
                    month: item.getDataValue('month'),
                    count: parseInt(item.getDataValue('count')),
                    total: parseFloat(item.getDataValue('total'))
                })),
                lowStockProducts,
                categoryDistribution: categoryDistribution.map(item => ({
                    category: item.product.category.name,
                    quantity: parseInt(item.getDataValue('totalQuantity')),
                    amount: parseFloat(item.getDataValue('totalAmount'))
                })),
                paymentMethodDistribution: paymentMethodDistribution.map(item => ({
                    method: item.paymentType,
                    count: parseInt(item.getDataValue('count')),
                    total: parseFloat(item.getDataValue('total'))
                }))
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    }
}

module.exports = new DashboardService();
