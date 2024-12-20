const { Supplier } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError, ValidationError, AppError } = require('../utils/errors');

class SupplierService {
    async createSupplier(supplierData) {
        try {
            // Vérifier si le fournisseur existe déjà
            const existingSupplier = await Supplier.findOne({
                where: { email: supplierData.email }
            });

            // Si le fournisseur existe, le retourner
            if (existingSupplier) {
                return existingSupplier;
            }

            // Sinon, créer un nouveau fournisseur
            return await Supplier.create(supplierData);
        } catch (error) {
            console.error('Create supplier error:', error);
            throw new AppError('Failed to create supplier');
        }
    }

    async getAllSuppliers(query = {}) {
        try {
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
        } catch (error) {
            console.error('Get all suppliers error:', error);
            throw new AppError('Failed to retrieve suppliers');
        }
    }

    async getSupplierById(id) {
        try {
            const supplier = await Supplier.findByPk(id);
            if (!supplier) {
                throw new NotFoundError('Supplier not found');
            }
            return supplier;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Get supplier error:', error);
            throw new AppError('Failed to retrieve supplier');
        }
    }

    async findSupplierByEmail(email) {
        try {
            if (!email) {
                throw new ValidationError('Email is required');
            }
            
            // Rechercher le fournisseur
            const supplier = await Supplier.findOne({ where: { email } });
            
            // Si le fournisseur n'existe pas, on le crée
            if (!supplier) {
                return await this.createSupplier({ email });
            }
            
            return supplier;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Find supplier by email error:', error);
            throw new AppError('Failed to find supplier');
        }
    }

    async updateSupplier(id, updateData) {
        try {
            const supplier = await this.getSupplierById(id);
            return await supplier.update(updateData);
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Update supplier error:', error);
            throw new AppError('Failed to update supplier');
        }
    }

    async deleteSupplier(id) {
        try {
            const supplier = await this.getSupplierById(id);
            await supplier.destroy();
            return supplier;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Delete supplier error:', error);
            throw new AppError('Failed to delete supplier');
        }
    }

    async searchSuppliers(searchTerm) {
        try {
            if (!searchTerm) {
                throw new ValidationError('Search term is required');
            }
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
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Search suppliers error:', error);
            throw new AppError('Failed to search suppliers');
        }
    }
}

module.exports = new SupplierService();
