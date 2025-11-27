const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// GET all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new location
router.post('/', async (req, res) => {
    const location = new Location({
        name: req.body.name,
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng
    });

    try {
        const newLocation = await location.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a location
router.delete('/:id', async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;