const User = require('../models/user.model');

class UserService {
    async createUser(userData) {
        return await User.create(userData);
    }

    async getAllUsers() {
        return await User.find({}).select('-password');
    }

    async getUserById(id) {
        return await User.findById(id).select('-password');
    }

    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }

    async findUserByEmail(email) {
        return await User.findOne({ email });
    }
}

module.exports = new UserService();
