const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Repair = require('../models/repair');
const router = express.Router();

// Get by ID
router.get('/repairs/:id', verifyToken, async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id)
      .populate('vehicle mechanic orderedParts')
      .exec();
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    res.status(200).json(repair);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching repair: ${error.message}` });
  }
});

// Create
router.post('/repairs', verifyToken, async (req, res) => {
  try {
    const { vehicle, startDate, description, cost, status, mechanic } =
      req.body;
    if (
      !vehicle ||
      !startDate ||
      !description ||
      !cost ||
      !status ||
      !mechanic
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const repair = new Repair(req.body);
    await repair.save();
    res.status(201).json({ message: 'Repair created successfully', repair });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating repair: ${error.message}` });
  }
});

// Update
router.put('/repairs/:id', verifyToken, async (req, res) => {
  try {
    const repair = await Repair.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec();
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    res.status(200).json({ message: 'Repair updated successfully', repair });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating repair: ${error.message}` });
  }
});

// Delete
router.delete('/repairs/:id', verifyToken, async (req, res) => {
  try {
    const repair = await Repair.findByIdAndDelete(req.params.id).exec();
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    res.status(200).json({ message: 'Repair deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting repair: ${error.message}` });
  }
});

module.exports = router;
