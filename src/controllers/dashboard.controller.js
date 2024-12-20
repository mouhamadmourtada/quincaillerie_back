const dashboardService = require('../services/dashboard.service');

class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const stats = await dashboardService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DashboardController();
