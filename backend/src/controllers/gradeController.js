const Grade = require('../models/Grade');

exports.createGrade = async (req, res, next) => {
  try {
    const grade = await Grade.create({
      ...req.body,
      gradedBy: req.user._id,
    });
    res.status(201).json({ message: 'Grade created', grade });
  } catch (error) {
    next(error);
  }
};

exports.getGradesByStudent = async (req, res, next) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('course', 'title')
      .populate('assignment', 'title')
      .populate('test', 'title')
      .sort({ createdAt: -1 });

    res.json({ grades });
  } catch (error) {
    next(error);
  }
};

exports.getMyGrades = async (req, res, next) => {
  try {
    const grades = await Grade.find({ student: req.user._id })
      .populate('course', 'title')
      .populate('assignment', 'title')
      .populate('test', 'title')
      .sort({ createdAt: -1 });

    res.json({ grades });
  } catch (error) {
    next(error);
  }
};

exports.getGradesByCourse = async (req, res, next) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })
      .populate('student', 'firstName lastName email')
      .populate('assignment', 'title')
      .populate('test', 'title')
      .sort({ createdAt: -1 });

    res.json({ grades });
  } catch (error) {
    next(error);
  }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.json({ message: 'Grade updated', grade });
  } catch (error) {
    next(error);
  }
};

exports.getStudentStatistics = async (req, res, next) => {
  try {
    const grades = await Grade.find({ student: req.user._id });

    const stats = {
      totalGrades: grades.length,
      averagePercentage: 0,
      highestScore: 0,
      lowestScore: 100,
      byCourse: {},
    };

    if (grades.length > 0) {
      const total = grades.reduce((sum, g) => sum + g.percentage, 0);
      stats.averagePercentage = Math.round(total / grades.length);
      stats.highestScore = Math.max(...grades.map((g) => g.percentage));
      stats.lowestScore = Math.min(...grades.map((g) => g.percentage));

      for (const grade of grades) {
        const courseId = grade.course.toString();
        if (!stats.byCourse[courseId]) {
          stats.byCourse[courseId] = { total: 0, count: 0, course: grade.course };
        }
        stats.byCourse[courseId].total += grade.percentage;
        stats.byCourse[courseId].count += 1;
      }

      for (const key of Object.keys(stats.byCourse)) {
        stats.byCourse[key].average = Math.round(
          stats.byCourse[key].total / stats.byCourse[key].count
        );
      }
    }

    res.json({ statistics: stats });
  } catch (error) {
    next(error);
  }
};
