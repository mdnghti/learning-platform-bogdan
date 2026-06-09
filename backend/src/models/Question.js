const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'single_choice', 'true_false', 'short_answer'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    options: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 1,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

questionSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Question', questionSchema);
