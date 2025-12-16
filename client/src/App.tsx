import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  BookOutlined, 
  FileTextOutlined, 
  FundOutlined, 
  ScheduleOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// 导入页面组件
import DemandAnalysis from './pages/DemandAnalysis';
import CourseFramework from './pages/CourseFramework';
import ContentRecommendation from './pages/ContentRecommendation';
import ItineraryOptimization from './pages/ItineraryOptimization';
import AssessmentSystem from './pages/AssessmentSystem';

const { Header, Content, Sider } = Layout;

// 侧边栏组件
const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = (e: any) => {
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
      <Route path="/" element={<DemandAnalysis />} />
      <Route path="/demand-analysis" element={<DemandAnalysis />} />
      <Route path="/course-framework" element={<CourseFramework />} />
      <Route path="/content-recommendation" element={<ContentRecommendation />} />
      <Route path="/itinerary-optimization" element={<ItineraryOptimization />} />
      <Route path="/assessment-system" element={<AssessmentSystem />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;;
