const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Category description is required'],
        trim: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
