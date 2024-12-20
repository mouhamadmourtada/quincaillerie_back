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

    async resetPasswordByAdmin(req, res) {
        try {
            const { userId, newPassword } = req.body;
            
            // Vérifier si l'utilisateur existe
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Mettre à jour le mot de passe
            await userService.updateUserPassword(userId, newPassword);
            
            res.json({ message: 'Mot de passe réinitialisé avec succès' });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.id; // Obtenu à partir du middleware d'authentification
            const { currentPassword, newPassword } = req.body;
            
            // Vérifier si l'utilisateur existe (inclure le mot de passe pour la comparaison)
            const user = await userService.getUserById(userId, true);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Vérifier l'ancien mot de passe
            if (!(await user.comparePassword(currentPassword))) {
                return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
            }

            // Mettre à jour le mot de passe
            await userService.updateUserPassword(userId, newPassword);
            
            res.json({ message: 'Mot de passe changé avec succès' });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async getMe(req, res) {
        try {
            // L'utilisateur est déjà disponible dans req.user grâce au middleware protect
            const user = await userService.getUserById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            console.error('Get user error:', error);
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
