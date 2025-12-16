const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['document', 'image', 'video', 'audio', 'link'],
    required: [true, 'Please add a resource type'],
  },
  url: {
    type: String,
    required: [true, 'Please add a resource URL'],
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
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
ResourceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resource', ResourceSchema);
