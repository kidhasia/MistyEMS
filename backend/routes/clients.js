import { Router } from 'express';
import Client from '../models/client.js';

const router = Router();

// Add a new client
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, city } = req.body;

    const newClient = new Client({
      name,
      email,
      phone,
      city,
    });

    await newClient.save();
    res.json({ message: 'Client added!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a client
router.put('/update/:id', async (req, res) => {
  try {
    const { name, email, phone, city } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.name = name;
    client.email = email;
    client.phone = phone;
    client.city = city;

    await client.save();
    res.json({ message: 'Client updated!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a client
router.delete('/delete/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single client by ID
router.get('/get/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client fetched!', client });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;