const { Supplier } = require('../models');
const { Op } = require('sequelize');

class SupplierService {
    async createSupplier(supplierData) {
        return await Supplier.create(supplierData);
    }

    async getAllSuppliers(query = {}) {
        const where = {};
        if (query.name) {
            where.name = { [Op.like]: `%${query.name}%` };
        }
        if (query.email) {
            where.email = query.email;
        }

        return await Supplier.findAll({
            where,
            order: [['name', 'ASC']]
        });
    }

    async getSupplierById(id) {
        return await Supplier.findByPk(id);
    }

    async updateSupplier(id, updateData) {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) return null;

        return await supplier.update(updateData);
    }

    async deleteSupplier(id) {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) return null;

        await supplier.destroy();
        return supplier;
    }

    async searchSuppliers(searchTerm) {
        return await Supplier.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchTerm}%` } },
                    { email: { [Op.like]: `%${searchTerm}%` } },
                    { phone: { [Op.like]: `%${searchTerm}%` } },
                    { address: { [Op.like]: `%${searchTerm}%` } }
                ]
            }
        });
    }
}

module.exports = new SupplierService();
