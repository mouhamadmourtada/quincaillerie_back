const saleService = require('../services/sale.service');
const { createSaleSchema, updateSaleSchema } = require('../dtos/sale.dto');
const validate = require('../middlewares/validation.middleware');
const { AppError } = require('../utils/errors');

class SaleController {
    async createSale(req, res, next) {
        try {
            const userId = req.user.id;
            const sale = await saleService.createSale(req.body, userId);
            res.status(201).json(sale);
        } catch (error) {
            next(error);
        }
    }

    async getAllSales(req, res, next) {
        try {
            const sales = await saleService.getAllSales(req.query);
            res.json(sales);
        } catch (error) {
            next(error);
        }
    }

    async getSaleById(req, res, next) {
        try {
            const sale = await saleService.getSaleById(req.params.id);
            if (!sale) {
                throw new AppError('Sale not found', 404);
            }
            res.json(sale);
        } catch (error) {
            next(error);
        }
    }

    async updateSale(req, res, next) {
        try {
            const sale = await saleService.updateSale(req.params.id, req.body);
            res.json(sale);
        } catch (error) {
            next(error);
        }
    }

    async deleteSale(req, res, next) {
        try {
            await saleService.deleteSale(req.params.id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    async getSalesByDateRange(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const sales = await saleService.getSalesByDateRange(startDate, endDate);
            res.json(sales);
        } catch (error) {
            next(error);
        }
    }

    async getSalesByCustomerPhone(req, res, next) {
        try {
            const { customerPhone } = req.params;
            const sales = await saleService.getSalesByCustomerPhone(customerPhone);
            res.json(sales);
        } catch (error) {
            next(error);
        }
    }

    async getSalesByPaymentType(req, res, next) {
        try {
            const { paymentType } = req.params;
            const sales = await saleService.getSalesByPaymentType(paymentType);
            res.json(sales);
        } catch (error) {
            next(error);
        }
    }

    async markSaleAsPaid(req, res, next) {
        try {
            const sale = await saleService.markSaleAsPaid(req.params.id, req.body.paymentType);
            res.json(sale);
        } catch (error) {
            next(error);
        }
    }

    async cancelSale(req, res, next) {
        try {
            const sale = await saleService.cancelSale(req.params.id);
            res.json(sale);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SaleController();
