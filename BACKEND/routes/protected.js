const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();


router.get('/user', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the protected area!', user: req.user });
});

// admin only
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Admin area', user: req.user });
});

// users
router.get('/volontario', authMiddleware, roleMiddleware(['volontario', 'admin']), (req, res) => {
  res.json({ message: 'Volontario area', user: req.user });
});

module.exports = router;
