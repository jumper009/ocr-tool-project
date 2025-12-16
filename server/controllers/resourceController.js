const Resource = require('../models/Resource');

// 获取资源列表
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 创建资源
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 获取单个资源
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 更新资源
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 删除资源
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getResources,
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
};
