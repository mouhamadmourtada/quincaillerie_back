const dashboardService = require('../services/dashboard.service');

class DashboardController {
    async getDashboardStats(req, res, next) {
        try {
            const stats = await dashboardService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getSalesStats(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw new Error('Start date and end date are required');
            }
            const stats = await dashboardService.getSalesStats(new Date(startDate), new Date(endDate));
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getInventoryStats(req, res, next) {
        try {
            const stats = await dashboardService.getInventoryStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DashboardController();
