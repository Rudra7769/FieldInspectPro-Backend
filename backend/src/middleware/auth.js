// src/middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Engineer = require('../models/Engineer');

const SECRET = process.env.JWT_SECRET || 'dev_secret_key';

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const engineer = await Engineer.findById(payload.id).select('-passwordHash');
    if (!engineer) return res.status(401).json({ message: 'Engineer not found' });
    req.engineer = engineer;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
