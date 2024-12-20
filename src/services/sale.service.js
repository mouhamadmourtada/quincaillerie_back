const { Sale, SaleItem, Product, User } = require('../models');
const sequelize = require('../config/database.config');
const { Op } = require('sequelize');

class SaleService {
    async createSale(saleData, userId) {
        const t = await sequelize.transaction();

        try {
            // Créer la vente
            const sale = await Sale.create({
                ...saleData,
                userId,
                totalAmount: 0 // Sera mis à jour après le calcul des items
            }, { transaction: t });

            // Traiter les items et calculer le montant total
            let totalAmount = 0;
            const saleItems = [];

            for (const item of saleData.items) {
                const product = await Product.findByPk(item.productId, { transaction: t });
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                // Mettre à jour le stock
                await product.update({
                    stock: product.stock - item.quantity
                }, { transaction: t });

                // Créer l'item de vente
                const saleItem = await SaleItem.create({
                    saleId: sale.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice: product.price * item.quantity
                }, { transaction: t });

                totalAmount += saleItem.totalPrice;
                saleItems.push(saleItem);
            }

            // Mettre à jour le montant total de la vente
            await sale.update({ totalAmount }, { transaction: t });

            await t.commit();

            return await Sale.findByPk(sale.id, {
                include: [{
                    model: SaleItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                }]
            });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAllSales(query = {}) {
        return await Sale.findAll({
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }, {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    async getSaleById(id) {
        return await Sale.findByPk(id, {
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }, {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
            }]
        });
    }

    async updateSale(id, updateData) {
        const sale = await Sale.findByPk(id);
        if (!sale) return null;

        return await sale.update(updateData);
    }

    async deleteSale(id) {
        const t = await sequelize.transaction();

        try {
            const sale = await Sale.findByPk(id, {
                include: [{
                    model: SaleItem,
                    as: 'items'
                }],
                transaction: t
            });

            if (!sale) {
                throw new Error('Sale not found');
            }

            // Restaurer les stocks
            for (const item of sale.items) {
                await Product.increment(
                    { stock: item.quantity },
                    { 
                        where: { id: item.productId },
                        transaction: t
                    }
                );
            }

            await sale.destroy({ transaction: t });
            await t.commit();
            return sale;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateSaleStatus(id, status, paymentType = null) {
        const updateData = { status };
        if (status === 'PAID') {
            updateData.paymentDate = new Date();
            if (paymentType) {
                updateData.paymentType = paymentType;
            }
        }
        return await this.updateSale(id, updateData);
    }

    async getSalesByDateRange(startDate, endDate) {
        return await Sale.findAll({
            where: {
                saleDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });
    }

    async getSalesByCustomer(customerPhone) {
        return await Sale.findAll({
            where: { customerPhone },
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });
    }
}

module.exports = new SaleService();
