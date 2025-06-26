const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const { requireRole } = require('../middlewares/auth.js');
const { getAllResident, deleteResident } = require('../controllers/resident.js');

router.get('/get-all-residents', jwtAuthMiddleware, requireRole('admin'), getAllResident);
router.delete('/:requestId', jwtAuthMiddleware, requireRole('admin'), deleteResident);

module.exports = router;
