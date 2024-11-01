const express = require('express');
const { verifyToken } = require('../middleware/auth');
const OrderedPart = require('../models/orderedPart');
const router = express.Router();

// Get by ID
router.get('/ordered-parts/:id', verifyToken, async (req, res) => {
  try {
    const orderedPart = await OrderedPart.findById(req.params.id).exec();
    if (!orderedPart) {
      return res.status(404).json({ message: 'Ordered part not found' });
    }
    res.status(200).json(orderedPart);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching ordered part: ${error.message}` });
  }
});

// Create
router.post('/ordered-parts', verifyToken, async (req, res) => {
  try {
    const { partName, repair, quantity, unitPrice, totalCost } = req.body;
    if (!partName || !repair || !quantity || !unitPrice || !totalCost) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const orderedPart = new OrderedPart(req.body);
    await orderedPart.save();
    res
      .status(201)
      .json({ message: 'Ordered part created successfully', orderedPart });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating ordered part: ${error.message}` });
  }
});

// Update
router.put('/ordered-parts/:id', verifyToken, async (req, res) => {
  try {
    const orderedPart = await OrderedPart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();
    if (!orderedPart) {
      return res.status(404).json({ message: 'Ordered part not found' });
    }
    res
      .status(200)
      .json({ message: 'Ordered part updated successfully', orderedPart });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating ordered part: ${error.message}` });
  }
});

// Delete
router.delete('/ordered-parts/:id', verifyToken, async (req, res) => {
  try {
    const orderedPart = await OrderedPart.findByIdAndDelete(
      req.params.id
    ).exec();
    if (!orderedPart) {
      return res.status(404).json({ message: 'Ordered part not found' });
    }
    res.status(200).json({ message: 'Ordered part deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting ordered part: ${error.message}` });
  }
});

module.exports = router;
