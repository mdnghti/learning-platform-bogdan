const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

router.get('/profile/:id', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/password', authenticate, userController.updatePassword);
router.post('/enroll', authenticate, userController.enrollCourse);

module.exports = router;
