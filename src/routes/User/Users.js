const User = require("../../models/User");

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
router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this account' });
        }
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while deleting the account', error: error.message });
    }
});

module.exports = router