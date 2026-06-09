const Course = require('../models/Course');
const Module = require('../models/Module');
const User = require('../models/User');

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({
      ...req.body,
      teacher: req.user._id,
    });
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const courses = await Course.find(query)
      .populate('teacher', 'firstName lastName avatar')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName avatar')
      .populate({
        path: 'modules',
        populate: { path: 'materials' },
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json({ message: 'Course updated', course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Module.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

exports.createModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const moduleCount = await Module.countDocuments({ course: course._id });

    const module = await Module.create({
      ...req.body,
      course: course._id,
      order: moduleCount + 1,
    });

    course.modules.push(module._id);
    await course.save();

    res.status(201).json({ message: 'Module created', module });
  } catch (error) {
    next(error);
  }
};

exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .populate('students', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    next(error);
  }
};
