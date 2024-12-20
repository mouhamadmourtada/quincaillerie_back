const supplierService = require('../services/supplier.service');

class SupplierController {
    async createSupplier(req, res, next) {
        try {
            const supplier = await supplierService.createSupplier(req.body);
            res.status(201).json(supplier);
        } catch (error) {
            next(error);
        }
    }

    async getAllSuppliers(req, res, next) {
        try {
            const suppliers = await supplierService.getAllSuppliers(req.query);
            res.json(suppliers);
        } catch (error) {
            next(error);
        }
    }

    async getSupplierById(req, res, next) {
        try {
            const supplier = await supplierService.getSupplierById(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json(supplier);
        } catch (error) {
            next(error);
        }
    }

    async updateSupplier(req, res, next) {
        try {
            const supplier = await supplierService.updateSupplier(req.params.id, req.body);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json(supplier);
        } catch (error) {
            next(error);
        }
    }

    async deleteSupplier(req, res, next) {
        try {
            const supplier = await supplierService.deleteSupplier(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    async searchSuppliers(req, res, next) {
        try {
            const suppliers = await supplierService.searchSuppliers(req.query.q);
            res.json(suppliers);
        } catch (error) {
            next(error);
        }
    }

    async getSupplierByEmail(req, res, next) {
        try {
            const supplier = await supplierService.findSupplierByEmail(req.params.email);
            res.json(supplier);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SupplierController();
