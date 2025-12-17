const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// 加载环境变量
dotenv.config();

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ocrtool02');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// 创建测试账户
const createTestUser = async () => {
  await connectDB();

  // 从环境变量获取测试账户信息
  const testUser = {
    username: process.env.TEST_USERNAME || 'testuser',
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'testpassword123',
    role: process.env.TEST_ROLE || 'admin',
  };

  try {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('测试账户已存在，正在更新密码...');
      // 更新现有用户的密码
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(testUser.password, salt);
      await existingUser.save();
      console.log('测试账户密码已更新！');
    } else {
      // 创建新用户
      await User.create(testUser);
      console.log('测试账户创建成功！');
    }
    
    console.log('\n测试账户信息：');
    console.log('用户名：', testUser.username);
    console.log('邮箱：', testUser.email);
    console.log('密码：', testUser.password);
    console.log('角色：', testUser.role);
    
  } catch (err) {
    console.error('创建测试账户失败:', err.message);
  } finally {
    // 断开数据库连接
    mongoose.disconnect();
  }
};

createTestUser();
