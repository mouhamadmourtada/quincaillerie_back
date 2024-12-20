const { User } = require('../models');
const { Op } = require('sequelize');

class UserService {
    async createUser(userData) {
        return await User.create(userData);
    }

    async getAllUsers() {
        return await User.findAll({
            attributes: { exclude: ['password'] }
        });
    }

    async getUserById(id) {
        return await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    }

    async findUserByEmail(email) {
        return await User.findOne({
            where: { email }
        });
    }

    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) return null;

        return await user.update(updateData);
    }

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) return null;

        await user.destroy();
        return user;
    }

    async searchUsers(searchTerm) {
        return await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${searchTerm}%` } },
                    { email: { [Op.like]: `%${searchTerm}%` } }
                ]
            },
            attributes: { exclude: ['password'] }
        });
    }
}

module.exports = new UserService();
