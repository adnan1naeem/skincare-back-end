const express = require('express');
const router = express.Router();
const SkincareRoutine = require('../../models/DailyRoutine');

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

        const currentTime = new Date();
        const lastUpdatedTime = new Date(routine.updatedAt);

        const resetTime = new Date(lastUpdatedTime);
        resetTime.setHours(0, 0, 0, 0); 
        resetTime.setDate(resetTime.getDate() + 1); 

        if (currentTime >= resetTime) {
            routine.cleanse = false;
            routine.tone = false;
            routine.hydrate = false;
            routine.moisturize = false;
            routine.protection = false;
            routine.updatedAt = currentTime; 
            await routine.save();
        }

        return res.status(200).json(routine);
    } catch (error) {
        console.error('Error fetching routine:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
