const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();

// Mock warehouse items (in real app, use database)
let items = [
  { id: 1, name: 'Bandages', quantity: 100, description: 'Medical bandages' },
  { id: 2, name: 'Gloves', quantity: 50, description: 'Latex gloves' }
];

// Validation rules
const itemValidationRules = [
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];

// GET /warehouse - List all items
router.get('/', authMiddleware, (req, res) => {
  res.json(items);
});

// GET /warehouse/:id - Get item by ID
router.get('/:id', authMiddleware, (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

// POST /warehouse - Create new item (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), itemValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, quantity, description } = req.body;
  const newItem = {
    id: items.length + 1,
    name,
    quantity,
    description
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /warehouse/:id - Update item (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), itemValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const { name, quantity, description } = req.body;
  item.name = name;
  item.quantity = quantity;
  item.description = description;

  res.json(item);
});

// DELETE /warehouse/:id - Delete item (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(itemIndex, 1);
  res.json({ message: 'Item deleted successfully' });
});

module.exports = router;
