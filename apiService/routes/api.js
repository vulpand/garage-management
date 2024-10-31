const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Client = require('../models/client');
const Appointment = require('../models/appointment');
const Vehicle = require('../models/vehicle');
const Repair = require('../models/repair');
const OrderedPart = require('../models/orderedPart');

// ---------------------------   User   ----------------------

// Create
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: `Error creating user: ${error.message}` });
  }
});

// Get all
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Error fetching users: ${error.message}` });
  }
});

// Get by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `Error fetching user: ${error.message}` });
  }
});

// Update
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
});

// Delete
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting user: ${error.message}` });
  }
});

// ---------------------------   Client   ----------------------

// Get all
router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find().populate('vehicles', 'licensePlate');
    res.status(200).json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching clients: ${error.message}` });
  }
});

// Create
router.post('/clients', async (req, res) => {
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

// Get by ID
router.get('/clients/:id', async (req, res) => {
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

// Update
router.put('/clients/:id', async (req, res) => {
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
router.delete('/clients/:id', async (req, res) => {
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

// ---------------------------   Appointment   ----------------------

// Get all
router.get('/appointments', async (req, res) => {
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
router.get('/appointments/:id', async (req, res) => {
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
router.post('/appointments', async (req, res) => {
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
router.put('/appointments/:id', async (req, res) => {
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
router.delete('/appointments/:id', async (req, res) => {
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

// ---------------------------   Vehicle   ----------------------

// Get all
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('client', 'name');
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching vehicles: ${error.message}` });
  }
});

// Create
router.post('/vehicles', async (req, res) => {
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

// Get by ID
router.get('/vehicles/:id', async (req, res) => {
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

// Update
router.put('/vehicles/:id', async (req, res) => {
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
router.delete('/vehicles/:id', async (req, res) => {
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

// ---------------------------   Repair   ----------------------

// Create
router.post('/repairs', async (req, res) => {
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

// Get by ID
router.get('/repairs/:id', async (req, res) => {
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

// Update
router.put('/repairs/:id', async (req, res) => {
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
router.delete('/repairs/:id', async (req, res) => {
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

// ---------------------------   Ordered Part   ----------------------

// Create
router.post('/ordered-parts', async (req, res) => {
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

// Get by ID
router.get('/ordered-parts/:id', async (req, res) => {
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

// Update
router.put('/ordered-parts/:id', async (req, res) => {
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
router.delete('/ordered-parts/:id', async (req, res) => {
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
