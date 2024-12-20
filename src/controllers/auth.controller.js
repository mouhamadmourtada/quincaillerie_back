const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

class AuthController {
    async register(req, res) {
        try {
            const { email } = req.body;
            const userExists = await userService.findUserByEmail(email);

            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = await userService.createUser(req.body);
            const token = this.generateToken(user.id);

            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.findUserByEmail(email);

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = this.generateToken(user.id);

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    }
}

module.exports = new AuthController();
