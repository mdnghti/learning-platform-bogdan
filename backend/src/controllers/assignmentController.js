const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

exports.createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      teacher: req.user._id,
    });

    const course = await Course.findById(req.body.course);
    if (course) {
      for (const studentId of course.students) {
        await Notification.create({
          recipient: studentId,
          type: 'new_assignment',
          title: 'New Assignment',
          message: `New assignment "${assignment.title}" has been created`,
          link: `/assignments.html?id=${assignment._id}`,
        });
      }
    }

    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentsByCourse = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
      isPublished: true,
    }).sort({ dueDate: 1 });

    res.json({ assignments });
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ assignment });
  } catch (error) {
    next(error);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment updated', assignment });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await Submission.deleteMany({ assignment: assignment._id });
    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.body.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submissionData = {
      assignment: assignment._id,
      student: req.user._id,
      content: req.body.content || '',
    };

    if (req.file) {
      submissionData.fileUrl = '/uploads/' + req.file.filename;
    }

    const submission = await Submission.findOneAndUpdate(
      { assignment: assignment._id, student: req.user._id },
      submissionData,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: 'Assignment submitted', submission });
  } catch (error) {
    next(error);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId,
    })
      .populate('student', 'firstName lastName email')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('assignment')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.score = score;
    submission.feedback = feedback || '';
    submission.status = 'graded';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();
    await submission.save();

    await Notification.create({
      recipient: submission.student,
      type: 'grade_updated',
      title: 'Grade Updated',
      message: `Your submission has been graded with score: ${score}`,
      link: `/grades.html`,
    });

    res.json({ message: 'Submission graded', submission });
  } catch (error) {
    next(error);
  }
};
