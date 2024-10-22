const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Client = require('../models/client');
const Vehicle = require('../models/vehicle');
const Repair = require('../models/repair');
const OrderedPart = require('../models/orderedPart');

// Create User
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

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Error fetching users: ${error.message}` });
  }
});

// Read User by ID
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

// Update User
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

// Delete User
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

// Get all clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching clients: ${error.message}` });
  }
});

// Create Client
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

// Read Client by ID
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

// Update Client
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

// Delete Client
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

// Get all vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching vehicles: ${error.message}` });
  }
});

// Create Vehicle
router.post('/vehicles', async (req, res) => {
  try {
    const { licensePlate, brand, model, year, mileage, clientId } = req.body;

    // Validate input fields
    if (!licensePlate || !brand || !model || !year || !mileage || !clientId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the client by ID
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

// Read Vehicle by ID
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

// Update Vehicle
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

// Delete Vehicle
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

// Create Repair
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

// Read Repair by ID
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

// Update Repair
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

// Delete Repair
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

// Create Ordered Part
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

// Read Ordered Part by ID
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

// Update Ordered Part
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

// Delete Ordered Part
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
