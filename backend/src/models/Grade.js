const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
    },
    type: {
      type: String,
      enum: ['assignment', 'test', 'final'],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
    },
    letterGrade: {
      type: String,
    },
    comment: {
      type: String,
      default: '',
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

gradeSchema.pre('save', function (next) {
  this.percentage = Math.round((this.score / this.maxScore) * 100);
  if (this.percentage >= 90) this.letterGrade = 'A';
  else if (this.percentage >= 80) this.letterGrade = 'B';
  else if (this.percentage >= 70) this.letterGrade = 'C';
  else if (this.percentage >= 60) this.letterGrade = 'D';
  else this.letterGrade = 'F';
  next();
});

gradeSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Grade', gradeSchema);
