import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { aiService } from '../services/api';
import type { OptimizeItineraryData, OptimizeItineraryResponse, ApiResponse } from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ItineraryOptimization: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [itineraryResult, setItineraryResult] = useState<ApiResponse<OptimizeItineraryResponse> | null>(null);

  const handleSubmit = async (values: OptimizeItineraryData) => {
    setLoading(true);
    try {
      const result = await aiService.optimizeItinerary(values);
      setItineraryResult(result);
    } catch (error) {
      console.error('Failed to optimize itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>行程规划优化</Title>
      <Divider />
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 表单部分 */}
        <Card style={{ flex: 1 }} title="填写行程信息">
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
              name="duration"
              label="课程时长（天）"
              rules={[{ required: true, message: '请输入课程时长' }]}
            >
              <Input type="number" placeholder="例如：5" />
            </Form.Item>
            
            <Form.Item
              name="courseStructure"
              label="课程结构"
              rules={[{ required: true, message: '请输入课程结构' }]}
            >
              <TextArea rows={6} placeholder="请输入或粘贴课程结构内容" />
            </Form.Item>
            
            <Form.Item
              name="location"
              label="研学地点"
              rules={[{ required: true, message: '请输入研学地点' }]}
            >
              <Input placeholder="例如：北京" />
            </Form.Item>
            
            <Form.Item
              name="courseId"
              label="课程ID（可选）"
            >
              <Input placeholder="已创建课程的ID" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                优化行程规划
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 结果展示部分 */}
        <Card style={{ flex: 1 }} title="行程规划" loading={loading}>
          {itineraryResult && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>每日行程：</Text>
                {(itineraryResult.data.dailyItineraries || []).map((day: OptimizeItineraryResponse['dailyItineraries'][0], index: number) => (
                  <div key={index} style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>第{index + 1}天</h4>
                    <p><strong>日期：</strong>{day.date}</p>
                    <p><strong>时间安排：</strong>{day.timeSchedule}</p>
                    <p><strong>活动内容：</strong>{day.activities}</p>
                    <p><strong>地点：</strong>{day.location}</p>
                    <p><strong>交通方式：</strong>{day.transportation}</p>
                    <p><strong>注意事项：</strong>{day.notes}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>后勤安排：</Text>
                <p><strong>交通：</strong>{itineraryResult.data.logistics?.transportation || '-'}</p>
                <p><strong>住宿：</strong>{itineraryResult.data.logistics?.accommodation || '-'}</p>
                <p><strong>餐饮：</strong>{itineraryResult.data.logistics?.catering || '-'}</p>
                <p><strong>安全措施：</strong>{itineraryResult.data.logistics?.safetyMeasures || '-'}</p>
              </div>
              
              <div>
                <Text strong>应急预案：</Text>
                <p>{itineraryResult.data.contingencyPlan || '-'}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ItineraryOptimization;