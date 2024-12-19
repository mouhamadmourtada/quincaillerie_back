const Supplier = require('../models/supplier.model');

class SupplierService {
    async createSupplier(supplierData) {
        return await Supplier.create(supplierData);
    }

    async getAllSuppliers(query = {}) {
        return await Supplier.find(query);
    }

    async getSupplierById(id) {
        return await Supplier.findById(id);
    }

    async updateSupplier(id, updateData) {
        return await Supplier.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    async deleteSupplier(id) {
        return await Supplier.findByIdAndDelete(id);
    }

    async findSupplierByEmail(email) {
        return await Supplier.findOne({ email });
    }
}

module.exports = new SupplierService();
