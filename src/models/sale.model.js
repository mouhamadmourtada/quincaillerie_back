const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
        type: Number,
        required: true,
        min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    }
});

const saleSchema = new mongoose.Schema({
    items: {
        type: [saleItemSchema],
        required: true,
        validate: {
            validator: function(items) {
                return items && items.length > 0;
            },
            message: 'Sale must have at least one item'
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerPhone: {
        type: String,
        required: true,
        trim: true
    },
    saleDate: {
        type: Date,
        default: Date.now
    },
    paymentDate: {
        type: Date,
        default: null
    },
    paymentType: {
        type: String,
        enum: ['CASH', 'CARD', 'TRANSFER'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED'],
        default: 'PENDING'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances des recherches
saleSchema.index({ customerName: 1, saleDate: -1 });
saleSchema.index({ status: 1 });
saleSchema.index({ createdBy: 1 });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
