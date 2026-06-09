const Event = require('../models/Event');
const Assignment = require('../models/Assignment');

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    next(error);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const { startDate, endDate, courseId } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (courseId) {
      query.course = courseId;
    }

    const events = await Event.find(query)
      .populate('course', 'title')
      .populate('createdBy', 'firstName lastName')
      .sort({ startDate: 1 });

    const assignmentEvents = [];
    if (!courseId) {
      const courseIds = req.user.enrolledCourses || [];
      if (courseIds.length > 0) {
        const assignments = await Assignment.find({
          course: { $in: courseIds },
          dueDate: { $exists: true },
        }).populate('course', 'title');

        for (const assignment of assignments) {
          assignmentEvents.push({
            _id: `assignment_${assignment._id}`,
            title: `Due: ${assignment.title}`,
            description: assignment.description,
            course: assignment.course,
            type: 'assignment_due',
            startDate: assignment.dueDate,
            endDate: assignment.dueDate,
            isAllDay: true,
            createdBy: assignment.teacher,
          });
        }
      }
    }

    res.json({ events: [...events, ...assignmentEvents] });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('course', 'title')
      .populate('createdBy', 'firstName lastName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated', event });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};
