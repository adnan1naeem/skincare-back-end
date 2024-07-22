const router = require("express").Router();

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, dob, gender, country } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    firstName,
                    lastName,
                    dob,
                    gender,
                    country
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router