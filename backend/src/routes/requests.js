
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id/approve', requestController.approveRequest);
router.put('/:id/reject', requestController.rejectRequest);
router.put('/:id/close', requestController.closeRequest);

module.exports = router;
