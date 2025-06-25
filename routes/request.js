const express = require('express');
const { validate } = require('../middlewares/schema.js');
const router = express.Router();
const requestSchema = require('../schemas/request.js');
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const { requireRole } = require('../middlewares/auth.js');
const { assignQuarter } = require('../controllers/request.js');

router.post('/assign-quarter', jwtAuthMiddleware, validate(requestSchema), requireRole('admin'), assignQuarter);

module.exports = router;
