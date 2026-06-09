const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/course/:courseId', authenticate, testController.getTestsByCourse);
router.get('/:id', authenticate, testController.getTestById);
router.post('/', authenticate, authorize('teacher', 'admin'), testController.createTest);
router.put('/:id', authenticate, authorize('teacher', 'admin'), testController.updateTest);
router.delete('/:id', authenticate, authorize('teacher', 'admin'), testController.deleteTest);

router.post('/:testId/questions', authenticate, authorize('teacher', 'admin'), testController.addQuestion);
router.put('/:testId/questions/:questionId', authenticate, authorize('teacher', 'admin'), testController.updateQuestion);
router.delete('/questions/:questionId', authenticate, authorize('teacher', 'admin'), testController.deleteQuestion);

router.post('/:testId/submit', authenticate, testController.submitTest);

module.exports = router;
