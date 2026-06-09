const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/my', authenticate, gradeController.getMyGrades);
router.get('/statistics', authenticate, gradeController.getStudentStatistics);
router.get('/student/:studentId', authenticate, authorize('teacher', 'admin'), gradeController.getGradesByStudent);
router.get('/course/:courseId', authenticate, authorize('teacher', 'admin'), gradeController.getGradesByCourse);
router.post('/', authenticate, authorize('teacher', 'admin'), gradeController.createGrade);
router.put('/:id', authenticate, authorize('teacher', 'admin'), gradeController.updateGrade);

module.exports = router;
