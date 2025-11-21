// src/models/Engineer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EngineerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  assignedSocieties: [{ type: Schema.Types.ObjectId, ref: 'Society' }]
}, { timestamps: true });

module.exports = mongoose.model('Engineer', EngineerSchema);
