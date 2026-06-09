const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', courseController.getCourses);
router.get('/my', authenticate, authorize('teacher'), courseController.getMyCourses);
router.get('/:id', authenticate, courseController.getCourseById);
router.post('/', authenticate, authorize('teacher', 'admin'), courseController.createCourse);
router.put('/:id', authenticate, authorize('teacher', 'admin'), courseController.updateCourse);
router.delete('/:id', authenticate, authorize('teacher', 'admin'), courseController.deleteCourse);
router.post('/:courseId/modules', authenticate, authorize('teacher', 'admin'), courseController.createModule);

module.exports = router;
