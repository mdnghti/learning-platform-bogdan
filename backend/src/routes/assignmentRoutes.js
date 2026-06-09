const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/course/:courseId', authenticate, assignmentController.getAssignmentsByCourse);
router.get('/submissions/my', authenticate, assignmentController.getMySubmissions);
router.get('/:id', authenticate, assignmentController.getAssignmentById);
router.get('/:assignmentId/submissions', authenticate, authorize('teacher', 'admin'), assignmentController.getSubmissions);
router.post('/', authenticate, authorize('teacher', 'admin'), assignmentController.createAssignment);
router.post('/submit', authenticate, upload.single('file'), assignmentController.submitAssignment);
router.put('/:id', authenticate, authorize('teacher', 'admin'), assignmentController.updateAssignment);
router.put('/:id/grade', authenticate, authorize('teacher', 'admin'), assignmentController.gradeSubmission);
router.delete('/:id', authenticate, authorize('teacher', 'admin'), assignmentController.deleteAssignment);

module.exports = router;
