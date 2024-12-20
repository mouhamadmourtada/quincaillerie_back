const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

class SaleItem extends Model {}

SaleItem.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    saleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'sales',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    sequelize,
    modelName: 'SaleItem',
    tableName: 'sale_items',
    timestamps: true
});

class Sale extends Model {}

Sale.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    saleDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    paymentType: {
        type: DataTypes.ENUM('CASH', 'CARD', 'TRANSFER'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
        defaultValue: 'PENDING'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Sale',
    tableName: 'sales',
    timestamps: true,
    indexes: [
        {
            fields: ['customerName', 'saleDate']
        },
        {
            fields: ['status']
        },
        {
            fields: ['userId']
        }
    ]
});

// Définir les associations
Sale.hasMany(SaleItem, {
    foreignKey: 'saleId',
    as: 'items'
});

SaleItem.belongsTo(Sale, {
    foreignKey: 'saleId'
});

module.exports = { Sale, SaleItem };
