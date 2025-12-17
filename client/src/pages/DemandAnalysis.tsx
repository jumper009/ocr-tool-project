import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { aiService } from '../services/api';
import type { AnalyzeDemandData, AnalyzeDemandResponse, ApiResponse } from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DemandAnalysis: React.FC = () => {
  const [form] = Form.useForm<AnalyzeDemandData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ApiResponse<AnalyzeDemandResponse> | null>(null);

  const handleSubmit = async (values: AnalyzeDemandData) => {
    setLoading(true);
    try {
      const result = await aiService.analyzeDemand(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze demand:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>课程需求分析</Title>
      <Divider />
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 表单部分 */}
        <Card style={{ flex: 1 }} title="填写课程需求">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="courseTitle"
              label="课程标题"
              rules={[{ required: true, message: '请输入课程标题' }]}
            >
              <Input placeholder="例如：北京历史文化研学之旅" />
            </Form.Item>
            
            <Form.Item
              name="targetAudience"
              label="目标人群"
              rules={[{ required: true, message: '请输入目标人群' }]}
            >
              <Input placeholder="例如：初中生" />
            </Form.Item>
            
            <Form.Item
              name="duration"
              label="课程时长（天）"
              rules={[{ required: true, message: '请输入课程时长' }]}
            >
              <Input type="number" placeholder="例如：5" />
            </Form.Item>
            
            <Form.Item
              name="objectives"
              label="课程目标"
              rules={[{ required: true, message: '请输入课程目标' }]}
            >
              <TextArea rows={4} placeholder="请描述课程的主要目标和预期效果" />
            </Form.Item>
            
            <Form.Item
              name="courseId"
              label="课程ID（可选）"
            >
              <Input placeholder="已创建课程的ID" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                生成需求分析报告
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 结果展示部分 */}
        <Card style={{ flex: 1 }} title="需求分析报告" loading={loading}>
          {analysisResult && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>需求摘要：</Text>
                <p>{analysisResult.data.demandSummary || '-'}</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>目标人群分析：</Text>
                <p>{analysisResult.data.targetAudienceAnalysis || '-'}</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>核心目标：</Text>
                <ul>
                  {(analysisResult.data.coreObjectives || []).map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>关键主题：</Text>
                <ul>
                  {(analysisResult.data.keyTopics || []).map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>建议教学方法：</Text>
                <ul>
                  {(analysisResult.data.teachingMethods || []).map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <Text strong>所需资源：</Text>
                <ul>
                  {(analysisResult.data.resourcesRequired || []).map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DemandAnalysis;