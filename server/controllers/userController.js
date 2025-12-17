const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 检查用户是否已存在
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // 创建新用户
    user = await User.create({
      username,
      email,
      password,
      role,
    });

    // 生成JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 测试账户验证（用于部署测试）
    const testEmail = process.env.TEST_EMAIL;
    const testPassword = process.env.TEST_PASSWORD;
    const testUsername = process.env.TEST_USERNAME;
    const testRole = process.env.TEST_ROLE;

    // 调试日志
    console.log('=== Test Account Debug ===');
    console.log('Environment Variables:', {
      TEST_EMAIL: process.env.TEST_EMAIL,
      TEST_PASSWORD: process.env.TEST_PASSWORD,
      TEST_USERNAME: process.env.TEST_USERNAME,
      TEST_ROLE: process.env.TEST_ROLE
    });
    console.log('Request Body:', { email, password });
    console.log('Test Account Match:', testEmail && testPassword && email === testEmail && password === testPassword);

    // 检查是否是测试账户登录
    if (testEmail && testPassword && email === testEmail && password === testPassword) {
      // 生成JWT token
      const token = jwt.sign(
        { id: 'test-user-id', role: testRole || 'user' },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        success: true,
        data: {
          _id: 'test-user-id',
          username: testUsername || 'testuser',
          email: testEmail,
          role: testRole || 'user',
          token,
        },
      });
    }

    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 获取用户列表
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 创建用户
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 获取单个用户
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
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
  register,
  login,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};