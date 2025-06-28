const express = require('express');
const { validate } = require('../middlewares/schema.js');
const facultySchema = require('../schemas/faculty.js');
const updateFacultySchema = require('../schemas/updateFaculty.js');
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const { requireRole } = require('../middlewares/auth.js');
const { addFaculty, updateFaculty, getFacultyById } = require('../controllers/faculty.js');
const router = express.Router();

router.post('/add', jwtAuthMiddleware, validate(facultySchema), requireRole('admin'), addFaculty);
router.patch('/:facultyId', jwtAuthMiddleware, validate(updateFacultySchema), requireRole('faculty'), updateFaculty);
router.get('/:requestId', jwtAuthMiddleware, requireRole('admin'), getFacultyById);

module.exports = router;
