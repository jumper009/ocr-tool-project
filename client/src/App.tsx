import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  BookOutlined, 
  FileTextOutlined, 
  FundOutlined, 
  ScheduleOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import './App.css';

// 导入页面组件
import DemandAnalysis from './pages/DemandAnalysis';
import CourseFramework from './pages/CourseFramework';
import ContentRecommendation from './pages/ContentRecommendation';
import ItineraryOptimization from './pages/ItineraryOptimization';
import AssessmentSystem from './pages/AssessmentSystem';
import AuthPage from './pages/AuthPage';

const { Header, Content, Sider } = Layout;

// 路由守卫组件
const ProtectedRoute: React.FC = () => {
  // 直接从localStorage初始化状态，避免在effect中设置状态
  const [isAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [loading] = useState<boolean>(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

// 侧边栏组件
const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  interface MenuClickEvent {
    key: string;
  }

  const handleMenuClick = (e: MenuClickEvent) => {
    const pathMap: Record<string, string> = {
      '1': '/demand-analysis',
      '2': '/course-framework',
      '3': '/content-recommendation',
      '4': '/itinerary-optimization',
      '5': '/assessment-system',
    };
    navigate(pathMap[e.key] || '/demand-analysis');
  };

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
        onClick={handleMenuClick}
      >
        <Menu.Item key="1" icon={<FileTextOutlined />}>
          课程需求分析
        </Menu.Item>
        <Menu.Item key="2" icon={<BookOutlined />}>
          课程框架生成
        </Menu.Item>
        <Menu.Item key="3" icon={<FundOutlined />}>
          教学内容推荐
        </Menu.Item>
        <Menu.Item key="4" icon={<ScheduleOutlined />}>
          行程规划优化
        </Menu.Item>
        <Menu.Item key="5" icon={<BarChartOutlined />}>
          评估体系构建
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

// 内容区域组件
const ContentArea: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/demand-analysis" replace />} />
      <Route path="/demand-analysis" element={<DemandAnalysis />} />
      <Route path="/course-framework" element={<CourseFramework />} />
      <Route path="/content-recommendation" element={<ContentRecommendation />} />
      <Route path="/itinerary-optimization" element={<ItineraryOptimization />} />
      <Route path="/assessment-system" element={<AssessmentSystem />} />
    </Routes>
  );
};

// 主应用布局组件
const AppLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          研学旅行课程开发系统
        </div>
      </Header>
      <Layout>
        <Sidebar />
        <Layout style={{ padding: '24px' }}>
          <Content
            className="site-layout-background"
            style={{ padding: 24, margin: 0, minHeight: 280 }}
          >
            <ContentArea />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 认证页面，无需登录 */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* 受保护路由，需要登录 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
        
        {/* 所有未匹配的路由重定向到认证页面 */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
