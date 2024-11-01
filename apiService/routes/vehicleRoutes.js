const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');
const router = express.Router();

// Get all
router.get('/vehicles', verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('client', 'name');
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching vehicles: ${error.message}` });
  }
});

// Get by ID
router.get('/vehicles/:id', verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).exec();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching vehicle: ${error.message}` });
  }
});

// Create
router.post('/vehicles', verifyToken, async (req, res) => {
  try {
    const { licensePlate, brand, model, year, mileage, clientId } = req.body;

    if (!licensePlate || !brand || !model || !year || !mileage || !clientId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const vehicle = new Vehicle({
      licensePlate,
      brand,
      model,
      year,
      mileage,
      client: client._id
    });

    const savedVehicle = await vehicle.save();

    client.vehicles.push(savedVehicle._id);
    await client.save();

    res
      .status(201)
      .json({ message: 'Vehicle created successfully', vehicle: savedVehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating vehicle: ${error.message}` });
  }
});

// Update
router.put('/vehicles/:id', verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating vehicle: ${error.message}` });
  }
});

// Delete
router.delete('/vehicles/:id', verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id).exec();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting vehicle: ${error.message}` });
  }
});

module.exports = router;
