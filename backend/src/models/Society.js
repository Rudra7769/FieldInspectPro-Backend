// src/models/Society.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocietySchema = new Schema({
  name: { type: String, required: true },
  numberOfFlats: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Society', SocietySchema);
