const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['studentAssessment', 'teacherAssessment', 'courseEffectAssessment'],
    required: [true, 'Please add an assessment type'],
  },
  score: {
    type: Number,
    required: [true, 'Please add a score'],
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
