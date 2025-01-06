const express = require('express');
const router = express.Router();
const SkincareRoutine = require('../../models/DailyRoutine');
const moment = require('moment-timezone');



const isNewDayForUser = (lastUpdated, userTimezone) => {
    const now = moment.tz(userTimezone).startOf('day'); // Current time in user's timezone, at the start of the day
    const lastUpdatedLocal = moment.tz(lastUpdated, userTimezone).startOf('day'); // Convert lastUpdated to user's timezone and set to start of the day
    // Compare the two days (ignoring time)
    return !now.isSame(lastUpdatedLocal, 'day');  // returns true if it's a new day, false if it's not
};

router.put('/update', async (req, res) => {
    const user = req.user
    const updates = req.body; // Assuming the request body contains all fields to update

    try {
        console.log('Request body:', req.body);

        const currentTime = new Date();
        const start = currentTime.setHours(0, 0, 0, 0);
        const end = currentTime.setHours(23, 59, 59);

        let routine = await SkincareRoutine.findOne({
            userId: user._id, createdAt: {
                $gte: start, $lte: end
            }
        });
        if (!routine) {
            routine = new SkincareRoutine({ userId :user._id});
            console.log('New routine created');
        }

        for (const key in updates) {
            if (key !== 'userId' && routine[key] !== undefined) {
                console.log(`Updating field ${key} to ${updates[key]}`);
                routine[key] = updates[key];
            }
        }

        await routine.save();

        return res.status(200).json({ message: 'Routine updated successfully', routine });
    } catch (error) {
        console.error('Error updating routine:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getRoutine/:userId', async (req, res) => {
    const { userId } = req.params;
    const userTimezone = req.query.timezone || 'UTC';
    
    try {

        let routine = await SkincareRoutine.findOne({ userId });

        if (!routine) {

            return res.status(200).json({
                userId,
                cleanse: false,
                tone: false,
                hydrate: false,
                moisturize: false,
                protection: false,
                lastUpdated: Date.now(),
                history: []
            });
        }

        const lastUpdatedLocal = moment.tz(routine.updatedAt, userTimezone); 

        if (isNewDayForUser(routine.updatedAt, userTimezone)) {
            console.log('Resetting routine for a new day');
            routine.cleanse = false;
            routine.tone = false;
            routine.hydrate = false;
            routine.moisturize = false;
            routine.protection = false;
            await routine.save();
        }

        return res.status(200).json(routine);
    } catch (error) {
        console.error('Error fetching routine:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
