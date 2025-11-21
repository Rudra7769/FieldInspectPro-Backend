// src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const engineerRoutes = require('./routes/engineer');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '8mb' })); // accept large base64
app.use(bodyParser.urlencoded({ extended: true }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/auth', authRoutes);
app.use('/engineer', engineerRoutes);

// admin export route (inside engineer route but accessible to admin)
const PORT = process.env.PORT || 4000;

// connect to mongo
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/field_inspector';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
