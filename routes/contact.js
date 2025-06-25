const express = require('express');
const { validate } = require('../middlewares/schema.js');
const router = express.Router();
const constactSchema = require('../schemas/contact.js');
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const { requireRole } = require('../middlewares/auth.js');
const { addContactQuery, getAllContactQueries } = require('../controllers/contact.js');

router.post('/add', jwtAuthMiddleware, validate(constactSchema), requireRole('faculty'), addContactQuery);
router.get('/get-all-queries', jwtAuthMiddleware, requireRole('admin'), getAllContactQueries);

module.exports = router;
