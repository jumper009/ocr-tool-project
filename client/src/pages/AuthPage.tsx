import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { LoginData, RegisterData } from '../services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 处理表单提交
  const handleSubmit = async (values: LoginData | RegisterData) => {
    setLoading(true);
    try {
      const response = isLogin 
        ? await authService.login(values as LoginData)
        : await authService.register(values as RegisterData);
      
      // 保存token到localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      message.success(isLogin ? '登录成功' : '注册成功');
      
      // 跳转到首页
      navigate('/');
    } catch {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <div style={{ display: 'flex', maxWidth: 1200, width: '100%', gap: 48, alignItems: 'center' }}>
          {/* 广告区域 */}
          <div style={{ flex: 1, maxWidth: 500 }}>
            <Title level={1} style={{ color: '#1890ff', marginBottom: 24 }}>
              研学旅行课程开发系统
            </Title>
            <Text style={{ fontSize: 18, lineHeight: 1.6, color: '#666' }}>
              专业的研学旅行课程开发平台，助力教育机构打造优质研学课程。
              从需求分析到课程框架搭建，从内容推荐到行程优化，全方位支持研学课程开发。
            </Text>
            <div style={{ marginTop: 48 }}>
              <img 
                src="https://img.alicdn.com/imgextra/i4/O1CN01nF1F9M1v1zV6r5z5X_!!6000000006247-2-tps-1200-675.jpg" 
                alt="研学旅行" 
                style={{ width: '100%', borderRadius: 8 }}
              />
            </div>
          </div>

          {/* 登录/注册表单 */}
          <Card 
            style={{ 
              width: 400, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: 8
            }} 
            bordered={false}
          >
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
              {isLogin ? '登录' : '注册'}
            </Title>
            
            <Form
              name={isLogin ? 'login' : 'register'}
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
              layout="vertical"
            >
              {!isLogin && (
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                </Form.Item>
              )}
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码长度不能少于6位' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
              </Form.Item>
              
              {!isLogin && (
                <Form.Item
                  name="role"
                  label="角色"
                  initialValue="teacher"
                >
                  <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                    <option value="admin">管理员</option>
                    <option value="teacher">教师</option>
                    <option value="student">学生</option>
                  </select>
                </Form.Item>
              )}
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={{ width: '100%', height: 40, fontSize: 16 }}
                >
                  {isLogin ? '登录' : '注册'}
                </Button>
              </Form.Item>
            </Form>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Text style={{ marginRight: 8 }}>
                {isLogin ? '还没有账号？' : '已有账号？'}
              </Text>
              <Button 
                type="link" 
                onClick={() => setIsLogin(!isLogin)}
                style={{ padding: 0 }}
              >
                {isLogin ? '立即注册' : '立即登录'}
              </Button>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthPage;