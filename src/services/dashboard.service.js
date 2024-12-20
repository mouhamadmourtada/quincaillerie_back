const { Sale, Product, Category, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { AppError } = require('../utils/errors');

class DashboardService {
    async getDashboardStats() {
        try {
            // Obtenir la date d'aujourd'hui et le début du mois
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            let stats = {
                currentMonthStats: {
                    totalSales: 0,
                    totalRevenue: 0
                },
                todayStats: {
                    totalSales: 0,
                    totalRevenue: 0
                },
                inventory: {
                    totalProducts: 0,
                    totalCategories: 0,
                    lowStockProducts: []
                },
                paymentStats: [],
                topProducts: []
            };

            try {
                // Statistiques des ventes du mois
                const salesStats = await Sale.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales'],
                        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue']
                    ],
                    where: {
                        saleDate: {
                            [Op.gte]: startOfMonth
                        }
                    }
                });

                stats.currentMonthStats = {
                    totalSales: salesStats[0]?.get('totalSales') || 0,
                    totalRevenue: salesStats[0]?.get('totalRevenue') || 0
                };
            } catch (error) {
                console.error('Error getting monthly sales stats:', error);
                // Ne pas propager l'erreur, continuer avec les valeurs par défaut
            }

            try {
                // Ventes d'aujourd'hui
                const todaySales = await Sale.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
                    ],
                    where: {
                        saleDate: {
                            [Op.gte]: startOfDay
                        }
                    }
                });

                stats.todayStats = {
                    totalSales: todaySales[0]?.get('count') || 0,
                    totalRevenue: todaySales[0]?.get('total') || 0
                };
            } catch (error) {
                console.error('Error getting today sales stats:', error);
                // Ne pas propager l'erreur, continuer avec les valeurs par défaut
            }

            try {
                // Statistiques d'inventaire
                const [products, categories, lowStockProducts] = await Promise.all([
                    Product.count(),
                    Category.count(),
                    Product.findAll({
                        where: { stock: { [Op.lt]: 10 } },
                        include: [{ model: Category, as: 'category' }]
                    })
                ]);

                stats.inventory = {
                    totalProducts: products,
                    totalCategories: categories,
                    lowStockProducts: lowStockProducts.map(p => ({
                        id: p.id,
                        name: p.name,
                        stock: p.stock,
                        category: p.category?.name || 'Non catégorisé'
                    }))
                };
            } catch (error) {
                console.error('Error getting inventory stats:', error);
                // Ne pas propager l'erreur, continuer avec les valeurs par défaut
            }

            try {
                // Statistiques de paiement
                const paymentStats = await Sale.findAll({
                    attributes: [
                        'paymentType',
                        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
                    ],
                    where: {
                        saleDate: {
                            [Op.gte]: startOfMonth
                        }
                    },
                    group: ['paymentType']
                });

                stats.paymentStats = paymentStats.map(stat => ({
                    type: stat.paymentType || 'Non spécifié',
                    count: stat.get('count') || 0,
                    total: stat.get('total') || 0
                }));
            } catch (error) {
                console.error('Error getting payment stats:', error);
                // Ne pas propager l'erreur, continuer avec les valeurs par défaut
            }

            return stats;

        } catch (error) {
            console.error('Dashboard stats error:', error);
            throw new AppError('Une erreur est survenue lors de la récupération des statistiques', 500);
        }
    }

    async getSalesStats(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                throw new AppError('Les dates de début et de fin sont requises', 400);
            }

            const sales = await Sale.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('saleDate')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales'],
                    [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue']
                ],
                where: {
                    saleDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('saleDate'))],
                order: [[sequelize.fn('DATE', sequelize.col('saleDate')), 'ASC']]
            });

            return sales.map(sale => ({
                date: sale.get('date'),
                totalSales: sale.get('totalSales') || 0,
                totalRevenue: sale.get('totalRevenue') || 0
            }));
        } catch (error) {
            console.error('Sales stats error:', error);
            if (error instanceof AppError) throw error;
            throw new AppError('Une erreur est survenue lors de la récupération des statistiques de vente', 500);
        }
    }

    async getInventoryStats() {
        try {
            const categories = await Category.findAll({
                include: [{
                    model: Product,
                    attributes: ['id', 'stock']
                }]
            });

            return categories.map(category => ({
                categoryName: category.name || 'Non catégorisé',
                totalProducts: category.Products?.length || 0,
                totalStock: category.Products?.reduce((sum, product) => sum + (product.stock || 0), 0) || 0,
                lowStockProducts: category.Products?.filter(product => product.stock < 10).length || 0
            }));
        } catch (error) {
            console.error('Inventory stats error:', error);
            throw new AppError('Une erreur est survenue lors de la récupération des statistiques d\'inventaire', 500);
        }
    }
}

module.exports = new DashboardService();
