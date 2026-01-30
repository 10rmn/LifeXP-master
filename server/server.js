const express = require('express');
const cors = require("cors");
require('dotenv').config();
const cron = require('node-cron');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const todoRoutes = require('./routes/todos');
const journalRoutes = require('./routes/journal');
const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/journal', journalRoutes);

// Cron job - runs every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily reset...');
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Get all users
        const usersResult = await db.query('SELECT id FROM users');
        const users = usersResult.rows;

        for (const user of users) {
            const userId = user.id;

            // Check if yesterday's entry exists
            const yesterdayStatsResult = await db.query(
                'SELECT * FROM daily_stats WHERE user_id = $1 AND date = $2',
                [userId, yesterdayStr]
            );
            const yesterdayStats = yesterdayStatsResult.rows[0];

            let newStreak = 0;
            if (yesterdayStats && yesterdayStats.completed_all) {
                // Continue streak from yesterday
                newStreak = yesterdayStats.streak_count;
            }
            // If yesterday wasn't completed or doesn't exist, streak resets to 0

            // Create today's entry (upsert)
            await db.query(`
                INSERT INTO daily_stats (user_id, date, completed_all, streak_count)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id, date) DO UPDATE SET
                    completed_all = EXCLUDED.completed_all,
                    streak_count = EXCLUDED.streak_count
            `, [userId, today, false, newStreak]);
        }

        console.log('Daily reset completed successfully');
    } catch (error) {
        console.error('Error in daily reset:', error);
    }
});

// Basic route
app.get('/', async(req, res) => {
    try{
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Daily reset cron job scheduled for midnight');
});
