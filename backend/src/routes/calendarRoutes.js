const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, calendarController.getEvents);
router.get('/:id', authenticate, calendarController.getEventById);
router.post('/', authenticate, calendarController.createEvent);
router.put('/:id', authenticate, calendarController.updateEvent);
router.delete('/:id', authenticate, calendarController.deleteEvent);

module.exports = router;
