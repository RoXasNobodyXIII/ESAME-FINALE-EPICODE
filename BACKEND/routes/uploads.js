const express = require('express');
const multer = require('multer');
const { initCloudinary, uploadBuffer } = require('../services/cloudinary');

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });
initCloudinary();


router.post('/image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Use form-data key "file".' });
    }
    const filename = req.file.originalname || 'upload';
    const result = await uploadBuffer(req.file.buffer, filename);
    return res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    return res.status(500).json({ error: 'Upload failed', details: err.message || err });
  }
});

module.exports = router;
