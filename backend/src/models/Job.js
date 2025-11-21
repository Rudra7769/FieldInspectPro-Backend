// src/models/Job.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  engineer: { type: Schema.Types.ObjectId, ref: 'Engineer', required: true },
  society: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
  flatNumber: { type: Number, required: true },
  status: { type: String, enum: ['completed','not_completed'], required: true },
  ownerName: { type: String },
  ownerNumber: { type: String },
  serviceType: { type: String }, // WiFi / Fiber / Landline / CCTV / Intercom / Other
  reason: { type: String }, // if not_completed
  signaturePath: { type: String }, // path to saved signature file
  gps: {
    lat: Number,
    lng: Number
  },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
