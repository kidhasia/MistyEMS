import { Router } from 'express';
import Employee from '../models/employee.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await newEmployee.save();

    await sendEmail(email, 'Welcome to Misty EMS', `Hi ${name}, you signed up for Misty EMS as an employee!`);

    res.status(201).json({ message: 'Employee registered!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

    res.json({
      token,
      employee,
      redirectTo: employee.role === 'project_manager' ? 'http://localhost:3001' : '/employee/dashboard',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all-pms', async (req, res) => {
  try {
    const pms = await Employee.find({ role: 'project_manager' });
    res.json(pms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;