const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database.config');

class User extends Model {
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    date_naissance: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true,
            customValidator(value) {
                if (value) {
                    const date = new Date(value);
                    if (date > new Date()) {
                        throw new Error('La date de naissance doit être dans le passé');
                    }
                }
            }
        }
    },
    lieu_naissance: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

module.exports = User;
