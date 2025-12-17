import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { aiService } from '../services/api';
import type { RecommendContentData, RecommendContentResponse, ApiResponse } from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ContentRecommendation: React.FC = () => {
  const [form] = Form.useForm<Omit<RecommendContentData, 'topics'> & { topics: string }>();
  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<ApiResponse<RecommendContentResponse> | null>(null);

  const handleSubmit = async (values: Omit<RecommendContentData, 'topics'> & { topics: string }) => {
    setLoading(true);
    try {
      // 将主题字符串转换为数组
      const requestData: RecommendContentData = {
        ...values,
        topics: values.topics.split(',').map(topic => topic.trim())
      };
      
      const result = await aiService.recommendContent(requestData);
      setRecommendationResult(result);
    } catch (error) {
      console.error('Failed to recommend content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>教学内容智能推荐</Title>
      <Divider />
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 表单部分 */}
        <Card style={{ flex: 1 }} title="填写课程信息">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="courseFrameworkId"
              label="课程框架ID"
              rules={[{ required: true, message: '请输入课程框架ID' }]}
            >
              <Input placeholder="例如：cf-123456" />
            </Form.Item>
            
            <Form.Item
              name="topics"
              label="主题列表"
              rules={[{ required: true, message: '请输入主题列表' }]}
            >
              <TextArea rows={6} placeholder="请输入主题，用逗号分隔" />
            </Form.Item>
            
            <Form.Item
              name="targetAudience"
              label="目标人群"
              rules={[{ required: true, message: '请输入目标人群' }]}
            >
              <Input placeholder="例如：初中生" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                推荐教学内容
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 结果展示部分 */}
        <Card style={{ flex: 1 }} title="教学内容推荐" loading={loading}>
          {recommendationResult && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>教学内容推荐：</Text>
                {(recommendationResult.data.contentRecommendations || []).map((content: RecommendContentResponse['contentRecommendations'][0], index: number) => (
                  <div key={index} style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>{content.title}</h4>
                    <p><strong>类型：</strong>{content.type}</p>
                    <p><strong>描述：</strong>{content.description}</p>
                    <p><strong>使用建议：</strong>{content.usageSuggestions}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>资源推荐：</Text>
                {(recommendationResult.data.resourceRecommendations || []).map((resource: RecommendContentResponse['resourceRecommendations'][0], index: number) => (
                  <div key={index} style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>{resource.title}</h4>
                    <p><strong>类型：</strong>{resource.type}</p>
                    <p><strong>URL：</strong><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.url}</a></p>
                    <p><strong>使用建议：</strong>{resource.usageSuggestions}</p>
                  </div>
                ))}
              </div>
              
              <div>
                <Text strong>互动活动建议：</Text>
                <ul>
                  {(recommendationResult.data.interactiveActivities || []).map((activity: string, index: number) => (
                    <li key={index}>{activity}</li>
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

export default ContentRecommendation;