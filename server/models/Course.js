const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  targetAudience: {
    type: String,
    required: [true, 'Please add a target audience'],
  },
  duration: {
    type: Number,
    required: [true, 'Please add a course duration in days'],
    min: 1,
  },
  framework: {
    type: Object,
    default: {},
  },
  content: {
    type: Array,
    default: [],
  },
  itinerary: {
    type: Object,
    default: {},
  },
  assessment: {
    type: Object,
    default: {},
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // 当前接口未做用户体系集成，这里不强制要求
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 每次更新前更新updatedAt字段
CourseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
