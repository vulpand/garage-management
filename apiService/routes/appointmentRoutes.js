const express = require('express');
const { verifyToken } = require('../middleware/auth');
const Appointment = require('../models/appointment');
const router = express.Router();

// Get all
router.get('/appointments', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('client vehicle');
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving appointments: ${error.message}` });
  }
});

// Get by ID
router.get('/appointments/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      'client vehicle'
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving appointment: ${error.message}` });
  }
});

// Create
router.post('/appointments', verifyToken, async (req, res) => {
  try {
    const { client, vehicle, dateTime, serviceType, status } = req.body;

    if (!client || !vehicle || !dateTime || !serviceType || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const appointment = new Appointment({
      client,
      vehicle,
      dateTime,
      serviceType,
      status
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating appointment: ${error.message}` });
  }
});

// Update
router.put('/appointments/:id', verifyToken, async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment updated successfully',
      updatedAppointment
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating appointment: ${error.message}` });
  }
});

// Delete
router.delete('/appointments/:id', verifyToken, async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting appointment: ${error.message}` });
  }
});

module.exports = router;
