const express = require('express');
const { addFaculty } = require('../controllers/faculty.js');
const { validate } = require('../middlewares/schema.js');
const facultySchema = require('../schemas/faculty.js');
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const router = express.Router();

router.post('/add', jwtAuthMiddleware, validate(facultySchema), addFaculty);

module.exports = router;
