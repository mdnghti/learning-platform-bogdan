const Test = require('../models/Test');
const Question = require('../models/Question');

exports.createTest = async (req, res, next) => {
  try {
    const test = await Test.create({
      ...req.body,
      teacher: req.user._id,
    });
    res.status(201).json({ message: 'Test created', test });
  } catch (error) {
    next(error);
  }
};

exports.getTestsByCourse = async (req, res, next) => {
  try {
    const tests = await Test.find({
      course: req.params.courseId,
      isPublished: true,
    });
    res.json({ tests });
  } catch (error) {
    next(error);
  }
};

exports.getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const response = { test: test.toJSON() };

    if (req.user.role === 'student') {
      response.test.questions = response.test.questions.map((q) => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.updateTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json({ message: 'Test updated', test });
  } catch (error) {
    next(error);
  }
};

exports.deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    await Question.deleteMany({ test: test._id });
    await Test.findByIdAndDelete(req.params.id);

    res.json({ message: 'Test deleted' });
  } catch (error) {
    next(error);
  }
};

exports.addQuestion = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const questionCount = await Question.countDocuments({ test: test._id });

    const question = await Question.create({
      ...req.body,
      test: test._id,
      order: questionCount + 1,
    });

    test.questions.push(question._id);
    await test.save();

    res.status(201).json({ message: 'Question added', question });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.questionId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question updated', question });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await Test.findByIdAndUpdate(question.test, {
      $pull: { questions: question._id },
    });

    await Question.findByIdAndDelete(req.params.questionId);

    res.json({ message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};

exports.submitTest = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const test = await Test.findById(req.params.testId).populate('questions');

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    const results = [];

    for (const question of test.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question._id];
      let isCorrect = false;

      if (question.type === 'multiple_choice') {
        const correct = Array.isArray(question.correctAnswer)
          ? question.correctAnswer.sort().join(',')
          : question.correctAnswer;
        const answer = Array.isArray(userAnswer)
          ? userAnswer.sort().join(',')
          : userAnswer;
        isCorrect = correct === answer;
      } else {
        isCorrect = String(question.correctAnswer).toLowerCase() === String(userAnswer).toLowerCase();
      }

      if (isCorrect) {
        earnedPoints += question.points;
      }

      results.push({
        questionId: question._id,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
      });
    }

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= test.passingScore;

    res.json({
      message: passed ? 'Test passed' : 'Test failed',
      result: {
        earnedPoints,
        totalPoints,
        percentage,
        passed,
      },
      passingScore: test.passingScore,
      results,
    });
  } catch (error) {
    next(error);
  }
};
