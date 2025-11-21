// src/seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Engineer = require('../models/Engineer');
const Society = require('../models/Society');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/field_inspector';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  // Clear existing (optional)
  await Engineer.deleteMany({});
  await Society.deleteMany({});

  // create societies
  const s1 = await Society.create({ name: 'Green Heights', numberOfFlats: 40 });
  const s2 = await Society.create({ name: 'Sai Residency', numberOfFlats: 60 });
  const s3 = await Society.create({ name: 'Park View', numberOfFlats: 24 });

  // create demo engineer with password 'demo123'
  const passwordHash = await bcrypt.hash('demo123', 10);
  const eng = await Engineer.create({
    name: 'Demo Engineer',
    email: 'demo@engineer.com',
    passwordHash,
    phone: '9876543210',
    assignedSocieties: [s1._id, s2._id]
  });

  console.log('Seed complete: Demo engineer -> demo@engineer.com / demo123');
  console.log('Societies created:', s1.name, s2.name, s3.name);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
