import { Router } from 'express';
import Client from '../models/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, city, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new Client({
      name,
      email,
      phone,
      city,
      password: hashedPassword,
    });

    await newClient.save();
    await sendEmail(email, 'Welcome to Misty EMS', `Hi ${name}, you signed up for Misty EMS as a client!`);
    res.status(201).json({ message: 'Client registered!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    const validPassword = await bcrypt.compare(password, client.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: client._id, role: 'client' }, 'secretkey', { expiresIn: '1d' });

    res.json({ token, client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/send-reset-code', async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    client.resetCode = resetCode;
    client.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    await client.save();

    await sendEmail(
      email,
      'Your MistyEMS Password Reset Code',
      `Your reset code is: ${resetCode}`
    );

    res.json({ message: 'Reset code sent to your email.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const client = await Client.findOne({ email });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    const isCodeValid = parseInt(code) === client.resetCode;
    const isCodeNotExpired = client.resetCodeExpires && client.resetCodeExpires > Date.now();

    if (!isCodeValid || !isCodeNotExpired) {
      return res.status(400).json({ message: 'Invalid or expired code.' });
    }

    res.json({ message: 'Code verified. You may reset your password.' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const client = await Client.findOne({ email });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    const isCodeValid = parseInt(code) === client.resetCode;
    const isCodeNotExpired = client.resetCodeExpires && client.resetCodeExpires > Date.now();

    if (!isCodeValid || !isCodeNotExpired) {
      return res.status(400).json({ message: 'Invalid or expired code.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashedPassword;
    client.resetCode = undefined;
    client.resetCodeExpires = undefined;

    await client.save();

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;