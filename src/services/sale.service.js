const { Sale, SaleItem, Product, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { NotFoundError, ValidationError, AppError } = require('../utils/errors');

class SaleService {
    async createSale(saleData, userId) {
        const transaction = await sequelize.transaction();

        try {
            // Récupérer tous les produits concernés
            const productIds = saleData.items.map(item => item.productId);
            const products = await Product.findAll({
                where: { id: productIds }
            });

            // Vérifier que tous les produits existent et ont assez de stock
            const productsMap = new Map(products.map(p => [p.id, p]));
            for (const item of saleData.items) {
                const product = productsMap.get(item.productId);
                if (!product) {
                    throw new NotFoundError(`Product with id ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new ValidationError(`Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                }
            }

            // Calculer le montant total et préparer les items
            let totalAmount = 0;
            const saleItems = saleData.items.map(item => {
                const product = productsMap.get(item.productId);
                const totalPrice = product.price * item.quantity;
                totalAmount += totalPrice;

                return {
                    id: uuidv4(),
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice: totalPrice
                };
            });

            // Créer la vente
            const sale = await Sale.create({
                id: uuidv4(),
                totalAmount,
                customerName: saleData.customerName,
                customerPhone: saleData.customerPhone,
                saleDate: saleData.saleDate || new Date(),
                paymentDate: saleData.paymentType === 'PAID' ? new Date() : null,
                paymentType: saleData.paymentType,
                status: saleData.status || 'PENDING',
                userId
            }, { transaction });

            // Créer les items de la vente
            await SaleItem.bulkCreate(
                saleItems.map(item => ({
                    ...item,
                    saleId: sale.id
                })),
                { transaction }
            );

            // Mettre à jour le stock des produits
            for (const item of saleData.items) {
                const product = productsMap.get(item.productId);
                await product.decrement('stock', {
                    by: item.quantity,
                    transaction
                });
            }

            await transaction.commit();

            // Retourner la vente avec ses items
            return await this.getSaleById(sale.id);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            console.error('Create sale error:', error);
            throw new AppError('Failed to create sale');
        }
    }

    async getAllSales(query = {}) {
        try {
            const where = {};
            if (query.status) {
                where.status = query.status;
            }
            if (query.paymentType) {
                where.paymentType = query.paymentType;
            }
            if (query.startDate && query.endDate) {
                where.saleDate = {
                    [Op.between]: [new Date(query.startDate), new Date(query.endDate)]
                };
            }

            return await Sale.findAll({
                where,
                include: [{
                    model: SaleItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }],
                order: [['saleDate', 'DESC']]
            });
        } catch (error) {
            console.error('Get all sales error:', error);
            throw new AppError('Failed to retrieve sales');
        }
    }

    async getSaleById(id) {
        try {
            const sale = await Sale.findByPk(id, {
                include: [{
                    model: SaleItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }]
            });

            if (!sale) {
                throw new NotFoundError('Sale not found');
            }

            return sale;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Get sale error:', error);
            throw new AppError('Failed to retrieve sale');
        }
    }

    async updateSale(id, updateData) {
        try {
            const sale = await Sale.findByPk(id);
            if (!sale) {
                throw new NotFoundError('Sale not found');
            }

            // Si le statut passe à PAID, mettre à jour la date de paiement
            if (updateData.status === 'PAID' && sale.status !== 'PAID') {
                updateData.paymentDate = new Date();
            }

            return await sale.update(updateData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Update sale error:', error);
            throw new AppError('Failed to update sale');
        }
    }

    async deleteSale(id) {
        const transaction = await sequelize.transaction();

        try {
            const sale = await Sale.findByPk(id, {
                include: [{
                    model: SaleItem,
                    as: 'items'
                }]
            });

            if (!sale) {
                throw new NotFoundError('Sale not found');
            }

            // Restaurer le stock des produits
            for (const item of sale.items) {
                await Product.increment('stock', {
                    by: item.quantity,
                    where: { id: item.productId },
                    transaction
                });
            }

            await sale.destroy({ transaction });
            await transaction.commit();

            return sale;
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            console.error('Delete sale error:', error);
            throw new AppError('Failed to delete sale');
        }
    }

    async getSalesByDateRange(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                throw new ValidationError('Start date and end date are required');
            }

            return await Sale.findAll({
                where: {
                    saleDate: {
                        [Op.between]: [new Date(startDate), new Date(endDate)]
                    }
                },
                include: [{
                    model: SaleItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }],
                order: [['saleDate', 'DESC']]
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Get sales by date range error:', error);
            throw new AppError('Failed to retrieve sales by date range');
        }
    }

    async getSalesByCustomerPhone(customerPhone) {
        try {
            if (!customerPhone) {
                throw new ValidationError('Customer phone is required');
            }

            return await Sale.findAll({
                where: { customerPhone },
                include: [{
                    model: SaleItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }],
                order: [['saleDate', 'DESC']]
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Get sales by customer error:', error);
            throw new AppError('Failed to retrieve sales by customer');
        }
    }

    async getSalesByPaymentType(paymentType) {
        try {
            if (!paymentType) {
                throw new ValidationError('Payment type is required');
            }

            return await Sale.findAll({
                where: { paymentType },
                include: [{
                    model: SaleItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }],
                order: [['saleDate', 'DESC']]
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Get sales by payment type error:', error);
            throw new AppError('Failed to retrieve sales by payment type');
        }
    }

    async markSaleAsPaid(saleId, paymentType) {
        const transaction = await sequelize.transaction();
        try {
            const sale = await Sale.findByPk(saleId);
            if (!sale) {
                throw new NotFoundError('Sale not found');
            }

            if (sale.status === 'CANCELLED') {
                throw new ValidationError('Cannot mark a cancelled sale as paid');
            }

            if (sale.status === 'PAID') {
                throw new ValidationError('Sale is already paid');
            }

            await sale.update({
                status: 'PAID',
                paymentDate: new Date(),
                paymentType: paymentType || sale.paymentType
            }, { transaction });

            await transaction.commit();
            return await this.getSaleById(saleId);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to mark sale as paid');
        }
    }

    async cancelSale(saleId) {
        const transaction = await sequelize.transaction();
        try {
            const sale = await Sale.findByPk(saleId, {
                include: [{
                    model: SaleItem,
                    include: [Product]
                }]
            });

            if (!sale) {
                throw new NotFoundError('Sale not found');
            }

            if (sale.status === 'CANCELLED') {
                throw new ValidationError('Sale is already cancelled');
            }

            if (sale.status === 'PAID') {
                throw new ValidationError('Cannot cancel a paid sale');
            }

            // Restaurer le stock des produits
            for (const item of sale.SaleItems) {
                await item.Product.increment('stock', {
                    by: item.quantity,
                    transaction
                });
            }

            await sale.update({
                status: 'CANCELLED',
                cancellationDate: new Date()
            }, { transaction });

            await transaction.commit();
            return await this.getSaleById(saleId);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to cancel sale');
        }
    }
}

module.exports = new SaleService();
