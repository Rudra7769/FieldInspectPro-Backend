// src/routes/engineer.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Society = require('../models/Society');
const Job = require('../models/Job');
const { saveJobsToExcel } = require('../utils/excel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// set up multer for multipart uploads (optional)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,7)}${ext}`);
  }
});
const upload = multer({ storage });

// GET /engineer/assignments
router.get('/assignments', auth, async (req, res) => {
  // return societies assigned to this engineer
  // For simplicity, we return all societies and let app filter by assigned list
  const societies = await Society.find().select('name numberOfFlats');
  res.json(societies);
});

// POST /engineer/job
// Accept either multipart (signature file) or JSON with base64 signature
router.post('/job', auth, upload.single('signature'), async (req, res) => {
  try {
    const payload = req.body || {};
    // If multipart, multer has saved file and req.file exists
    let signaturePath = null;

    if (req.file) {
      signaturePath = `/uploads/${req.file.filename}`;
    } else if (payload.signatureBase64) {
      // save base64 to file
      const matches = payload.signatureBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      const b64 = matches ? matches[2] : payload.signatureBase64;
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2,7)}.png`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, Buffer.from(b64, 'base64'));
      signaturePath = `/uploads/${filename}`;
    }

    // parse numbers if sent as strings
    const jobObj = {
      engineer: req.engineer._id,
      society: payload.societyId || payload.society, // expect societyId
      flatNumber: Number(payload.flatNumber),
      status: payload.status, // 'completed' or 'not_completed'
      ownerName: payload.ownerName || null,
      ownerNumber: payload.ownerNumber || null,
      serviceType: payload.serviceType || null,
      reason: payload.reason || null,
      signaturePath,
      gps: payload.gps ? JSON.parse(payload.gps) : undefined,
      submittedAt: new Date()
    };

    const job = new Job(jobObj);
    await job.save();

    res.json({ success: true, job });
  } catch (err) {
    console.error('job error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /engineer/jobs  (list jobs for this engineer)
router.get('/jobs', auth, async (req, res) => {
  const jobs = await Job.find({ engineer: req.engineer._id }).populate('society');
  res.json(jobs);
});

// GET /engineer/export (admin) -> creates excel in runtime and returns file
router.get('/export', auth, async (req, res) => {
  // NOTE: in production restrict to admin users. For now any auth user can export.
  const allJobs = await Job.find().populate('society').populate('engineer');
  const filePath = await saveJobsToExcel(allJobs);
  res.download(filePath, 'field_jobs_export.xlsx', (err) => {
    if (err) console.error('download error', err);
    // optional: delete after sending
    // fs.unlinkSync(filePath);
  });
});

module.exports = router;
