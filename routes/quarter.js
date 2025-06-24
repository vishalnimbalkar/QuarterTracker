const express = require('express');
const { validate } = require('../middlewares/schema.js');
const router = express.Router();
const quarterSchema = require('../schemas/quarter.js');
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const { requireRole } = require('../middlewares/auth.js');
const { addQuarter, getAllQuarters, getQuarterByCampusAndFlatType, deleteQuarter } = require('../controllers/quarter.js');

router.post('/add', jwtAuthMiddleware, validate(quarterSchema), requireRole('admin'), addQuarter);
router.get('/get-all-quarters', jwtAuthMiddleware, requireRole('admin'), getAllQuarters);
router.get('/get-by-campus', jwtAuthMiddleware, requireRole('admin'), getQuarterByCampusAndFlatType);
router.delete('/:quarterId', jwtAuthMiddleware, requireRole('admin'), deleteQuarter);
module.exports = router;
