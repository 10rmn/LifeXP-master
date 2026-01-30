const db = require('../config/database');
const { levelThresholds, calculateLevel } = require('../utils/xpSystem');

// Get user stats (XP, level, streak)
exports.getUserStats = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Get user info
        const userResult = await db.query(
            'SELECT id, username, email FROM users WHERE id = $1',
            [user_id]
        );
        const userData = userResult.rows[0];

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayStatsResult = await db.query(
            'SELECT * FROM daily_stats WHERE user_id = $1 AND date = $2',
            [user_id, today]
        );
        const todayStats = todayStatsResult.rows[0];

        // Get user's habits count
        const habitsResult = await db.query(
            'SELECT COUNT(*) as count FROM habits WHERE user_id = $1 AND active = true',
            [user_id]
        );
        const totalHabits = parseInt(habitsResult.rows[0].count);

        // Get completed habits today (this would need habit_logs table)
        const completedToday = 0; // Placeholder - would need habit tracking

        // Calculate stats
        const allCompletedToday = totalHabits > 0 && completedToday === totalHabits;
        const streak = todayStats ? todayStats.streak_count : 0;

        // Default XP and level system
        const xp = 0; // Would need to implement XP tracking
        const level = calculateLevel(xp);
        const nextLevelXp = levelThresholds[level + 1] || 1000;

        res.status(200).json({
            user: userData,
            xp,
            level,
            nextLevelXp,
            streak,
            totalHabits,
            completedToday,
            allCompletedToday
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get monthly stats for a user
exports.getMonthlyStats = async (req, res) => {
    const { user_id, year, month } = req.params;

    try {
        const startDate = `${year}-${month.padStart(2, '0')}-01`;
        const endDate = `${year}-${month.padStart(2, '0')}-31`;

        const result = await db.query(
            'SELECT date, completed_all, streak_count FROM daily_stats WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date',
            [user_id, startDate, endDate]
        );

        const monthlyStats = result.rows.map(day => ({
            date: day.date,
            completed: day.completed_all,
            streak: day.streak_count
        }));

        res.status(200).json({
            monthlyStats,
            totalDays: monthlyStats.length,
            completedDays: monthlyStats.filter(day => day.completed).length
        });
    } catch (error) {
        console.error('Error getting monthly stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
