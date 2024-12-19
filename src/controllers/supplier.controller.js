const supplierService = require('../services/supplier.service');

class SupplierController {
    async createSupplier(req, res) {
        try {
            const { email } = req.body;
            const supplierExists = await supplierService.findSupplierByEmail(email);

            if (supplierExists) {
                return res.status(400).json({ message: 'Supplier with this email already exists' });
            }

            const supplier = await supplierService.createSupplier(req.body);
            res.status(201).json(supplier);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllSuppliers(req, res) {
        try {
            const suppliers = await supplierService.getAllSuppliers();
            res.json(suppliers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSupplierById(req, res) {
        try {
            const supplier = await supplierService.getSupplierById(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json(supplier);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateSupplier(req, res) {
        try {
            const supplier = await supplierService.updateSupplier(req.params.id, req.body);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json(supplier);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteSupplier(req, res) {
        try {
            const supplier = await supplierService.deleteSupplier(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json({ message: 'Supplier deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new SupplierController();
