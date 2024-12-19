const saleService = require('../services/sale.service');

class SaleController {
    async createSale(req, res) {
        try {
            const sale = await saleService.createSale(req.body, req.user._id);
            res.status(201).json(sale);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllSales(req, res) {
        try {
            const sales = await saleService.getAllSales();
            res.json(sales);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSaleById(req, res) {
        try {
            const sale = await saleService.getSaleById(req.params.id);
            if (!sale) {
                return res.status(404).json({ message: 'Sale not found' });
            }
            res.json(sale);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateSale(req, res) {
        try {
            const sale = await saleService.updateSale(req.params.id, req.body);
            if (!sale) {
                return res.status(404).json({ message: 'Sale not found' });
            }
            res.json(sale);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteSale(req, res) {
        try {
            const sale = await saleService.deleteSale(req.params.id);
            if (!sale) {
                return res.status(404).json({ message: 'Sale not found' });
            }
            res.json({ message: 'Sale deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateSaleStatus(req, res) {
        try {
            const { status, paymentType } = req.body;
            if (!['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const sale = await saleService.updateSaleStatus(req.params.id, status, paymentType);
            if (!sale) {
                return res.status(404).json({ message: 'Sale not found' });
            }
            res.json(sale);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSalesByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required' });
            }

            const sales = await saleService.getSalesByDateRange(new Date(startDate), new Date(endDate));
            res.json(sales);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSalesByCustomer(req, res) {
        try {
            const { customerPhone } = req.params;
            const sales = await saleService.getSalesByCustomer(customerPhone);
            res.json(sales);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new SaleController();
