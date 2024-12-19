const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

class SaleService {
    async createSale(saleData, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Calculer le montant total et mettre à jour les stocks
            const populatedItems = await Promise.all(saleData.items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                // Mettre à jour le stock
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } },
                    { session }
                );

                return {
                    ...item,
                    unitPrice: product.price,
                    totalPrice: product.price * item.quantity
                };
            }));

            const totalAmount = populatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

            const sale = await Sale.create([{
                ...saleData,
                items: populatedItems,
                totalAmount,
                createdBy: userId
            }], { session });

            await session.commitTransaction();
            return sale[0];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllSales(query = {}) {
        return await Sale.find(query)
            .populate('items.productId', 'name price')
            .populate('createdBy', 'username')
            .sort({ saleDate: -1 });
    }

    async getSaleById(id) {
        return await Sale.findById(id)
            .populate('items.productId', 'name price')
            .populate('createdBy', 'username');
    }

    async updateSale(id, updateData) {
        return await Sale.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('items.productId', 'name price');
    }

    async deleteSale(id) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const sale = await Sale.findById(id);
            if (!sale) {
                throw new Error('Sale not found');
            }

            // Restaurer les stocks
            await Promise.all(sale.items.map(async (item) => {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }));

            await Sale.findByIdAndDelete(id, { session });
            await session.commitTransaction();
            return sale;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
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
        return await Sale.find({
            saleDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('items.productId', 'name price');
    }

    async getSalesByCustomer(customerPhone) {
        return await Sale.find({ customerPhone })
            .populate('items.productId', 'name price');
    }
}

module.exports = new SaleService();
