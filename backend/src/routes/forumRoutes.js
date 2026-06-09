const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/course/:courseId', authenticate, forumController.getTopicsByCourse);
router.get('/:id', authenticate, forumController.getTopicById);
router.post('/topics', authenticate, forumController.createTopic);
router.put('/topics/:id', authenticate, authorize('teacher', 'admin'), forumController.updateTopic);
router.delete('/topics/:id', authenticate, authorize('teacher', 'admin'), forumController.deleteTopic);

router.post('/posts', authenticate, forumController.createPost);
router.put('/posts/:postId', authenticate, forumController.updatePost);
router.delete('/posts/:postId', authenticate, authorize('teacher', 'admin'), forumController.deletePost);

module.exports = router;
