const mongoose = require('mongoose');

const AIContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['demandAnalysis', 'courseFramework', 'teachingContent', 'itinerary', 'assessment'],
    required: [true, 'Please add a content type'],
  },
  input: {
    type: Object,
    required: [true, 'Please add input parameters'],
  },
  output: {
    type: Object,
    required: [true, 'Please add AI generated output'],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    // 课程ID在前端是可选字段，因此这里不强制要求
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AIContent', AIContentSchema);
