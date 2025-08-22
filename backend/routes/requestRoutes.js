const express = require('express');
const {
  createRequest,
  updateRequestStatus,
  getMyRequests,
  getReceivedRequests,
} = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create request
router.route('/').post(protect, createRequest);

// Get requests I made
router.route('/mine').get(protect, getMyRequests);

// Get requests made to me
router.route('/received').get(protect, getReceivedRequests);

// Update request status
router.route('/:id').put(protect, updateRequestStatus);

module.exports = router;
