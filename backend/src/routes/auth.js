// src/routes/auth.js
const express = require('express');
const router = express.Router();
const Engineer = require('../models/Engineer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const engineer = await Engineer.findOne({ email });
  if (!engineer) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, engineer.passwordHash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: engineer._id }, SECRET, { expiresIn: '7d' });

  res.json({
    token,
    engineer: {
      id: engineer._id,
      name: engineer.name,
      email: engineer.email,
      phone: engineer.phone,
      assignedSocieties: engineer.assignedSocieties
    }
  });
});

module.exports = router;
