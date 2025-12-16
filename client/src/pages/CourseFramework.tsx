import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { aiService } from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CourseFramework: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [frameworkResult, setFrameworkResult] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const result = await aiService.generateFramework(values);
      setFrameworkResult(result.data);
    } catch (error) {
      console.error('Failed to generate framework:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>课程框架生成</Title>
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
              name="courseTitle"
              label="课程标题"
              rules={[{ required: true, message: '请输入课程标题' }]}
            >
              <Input placeholder="例如：北京历史文化研学之旅" />
            </Form.Item>
            
            <Form.Item
              name="demandAnalysis"
              label="课程需求分析"
              rules={[{ required: true, message: '请输入课程需求分析' }]}
            >
              <TextArea rows={6} placeholder="请输入或粘贴课程需求分析内容" />
            </Form.Item>
            
            <Form.Item
              name="courseId"
              label="课程ID（可选）"
            >
              <Input placeholder="已创建课程的ID" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                生成课程框架
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 结果展示部分 */}
        <Card style={{ flex: 1 }} title="课程框架" loading={loading}>
          {frameworkResult && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>课程目标：</Text>
                <ul>
                  {frameworkResult.courseObjectives.map((obj: string, index: number) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>课程结构：</Text>
                {frameworkResult.courseStructure.map((module: any, index: number) => (
                  <div key={index} style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>{module.name}</h4>
                    <p><strong>目标：</strong>{module.target}</p>
                    <p><strong>内容：</strong>{module.content}</p>
                    <p><strong>时长：</strong>{module.duration}分钟</p>
                    <p><strong>教学方法：</strong>{module.teachingMethods}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>教学策略：</Text>
                <ul>
                  {frameworkResult.teachingStrategies.map((strategy: string, index: number) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <Text strong>评估方法：</Text>
                <ul>
                  {frameworkResult.assessmentMethods.map((method: string, index: number) => (
                    <li key={index}>{method}</li>
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

export default CourseFramework;