const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middlewares/jwt.js');
const { requireRole } = require('../middlewares/auth.js');
const { getAllRequests, approvedRequest, rejectRequest, getAllRequestsByFacultyId } = require('../controllers/request.js');

router.get('/get-all-requests', jwtAuthMiddleware, requireRole('admin'), getAllRequests);
router.patch('/approve/:requestId', jwtAuthMiddleware, requireRole('admin'), approvedRequest);
router.patch('/reject/:requestId', jwtAuthMiddleware, requireRole('admin'), rejectRequest);
router.get('/get-all-requests/:facultyId', jwtAuthMiddleware, requireRole('faculty'), getAllRequestsByFacultyId);
module.exports = router;
