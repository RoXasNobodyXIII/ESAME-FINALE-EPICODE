const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();

const users = [
  { id: 1, username: 'admin', role: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'volontario', role: 'volontario', email: 'volontario@example.com' }
];

const items = [
  { id: 1, name: 'Bandages', quantity: 100, description: 'Medical bandages' },
  { id: 2, name: 'Gloves', quantity: 50, description: 'Latex gloves' }
];

router.get('/users', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const report = {
    totalUsers: users.length,
    adminCount: users.filter(u => u.role === 'admin').length,
    volontarioCount: users.filter(u => u.role === 'volontario').length,
    users: users.map(u => ({ id: u.id, username: u.username, role: u.role }))
  };
  res.json(report);
});

router.get('/warehouse', authMiddleware, (req, res) => {
  const report = {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: items.filter(item => item.quantity < 20),
    items: items
  };
  res.json(report);
});

module.exports = router;
