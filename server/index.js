const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 尝试连接数据库，如果失败，只记录错误但不终止服务
connectDB().catch((error) => {
  console.error('Warning: Failed to connect to MongoDB. Database-related features will be unavailable.', error.message);
});

// 路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 测试路由
app.get('/', (req, res) => {
  res.send('研学旅行课程开发系统 API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
