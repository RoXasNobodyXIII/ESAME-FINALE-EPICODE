const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

function getPeopleCol(req) {
  return req.app.locals.db.collection('people');
}


router.get('/', authMiddleware, async (req, res) => {
  try {
    const people = await getPeopleCol(req).find({}, { projection: { _id: 0 } }).toArray();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch people' });
  }
});

module.exports = router;
