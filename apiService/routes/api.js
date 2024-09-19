const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Client = require('../models/client');
const Car = require('../models/car');
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

// Create Client
router.post('/clients', async (req, res) => {
  try {
    const { user, phoneNumber } = req.body;
    if (!user) {
      return res.status(400).json({ message: 'User reference is required' });
    }
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone reference is required' });
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

// Create Car
router.post('/cars', async (req, res) => {
  try {
    const { licensePlate, brand, model, year, mileage, client } = req.body;
    if (!licensePlate || !brand || !model || !year || !mileage || !client) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (error) {
    res.status(500).json({ message: `Error creating car: ${error.message}` });
  }
});

// Read Car by ID
router.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).exec();
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: `Error fetching car: ${error.message}` });
  }
});

// Update Car
router.put('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).exec();
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    res.status(500).json({ message: `Error updating car: ${error.message}` });
  }
});

// Delete Car
router.delete('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id).exec();
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting car: ${error.message}` });
  }
});

// Create Repair
router.post('/repairs', async (req, res) => {
  try {
    const { car, startDate, description, cost, status, mechanic } = req.body;
    if (!car || !startDate || !description || !cost || !status || !mechanic) {
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
      .populate('car mechanic orderedParts')
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
