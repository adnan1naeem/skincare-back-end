const Description = require('../../models/Description');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const router = require('express').Router()
router.get('/', async (req, res) => {
    try {
        const descriptions = await Description.find();
        res.json(descriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving skin analysis descriptions', error });
    }
});
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { oilness, elasticity, hydration, description } = req.body;

    try {
        const updatedDescription = await Description.findByIdAndUpdate(
            id,
            { oilness, elasticity, hydration, description },
            { new: true, runValidators: true }
        );

        if (!updatedDescription) {
            return res.status(404).json({ message: 'Skin analysis description not found' });
        }

        res.json(updatedDescription);
    } catch (error) {
        res.status(500).json({ message: 'Error updating skin analysis description', error });
    }
});
module.exports = router