const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Client = require('../models/client');
const router = express.Router();

// Get all
router.get('/clients', verifyToken, async (req, res) => {
  try {
    const clients = await Client.find().populate('vehicles', 'licensePlate');
    res.status(200).json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching clients: ${error.message}` });
  }
});

// Get by ID
router.get('/clients/:id', verifyToken, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).exec();
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching client: ${error.message}` });
  }
});

// Create
router.post('/clients', verifyToken, async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name reference is required' });
    }
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone reference is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email reference is required' });
    }
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating client: ${error.message}` });
  }
});

// Update
router.put('/clients/:id', verifyToken, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec();
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client updated successfully', client });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating client: ${error.message}` });
  }
});

// Delete
router.delete('/clients/:id', verifyToken, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id).exec();
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting client: ${error.message}` });
  }
});

module.exports = router;
