import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { aiService } from '../services/api';
import type { BuildAssessmentResponse, ApiResponse } from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FormValues {
  courseFrameworkId: string;
  objectives: string;
  targetAudience: string;
}

const AssessmentSystem: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<ApiResponse<BuildAssessmentResponse> | null>(null);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await aiService.buildAssessment({
        ...values,
        objectives: values.objectives.split('\n').filter(Boolean)
      });
      setAssessmentResult(result);
    } catch (error) {
      console.error('Failed to build assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>评估体系构建</Title>
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
              <Input placeholder="请输入课程框架ID" />
            </Form.Item>
            
            <Form.Item
              name="objectives"
              label="课程目标"
              rules={[{ required: true, message: '请输入课程目标' }]}
            >
              <TextArea rows={4} placeholder="请输入或粘贴课程目标内容（每行一个目标）" />
            </Form.Item>
            
            <Form.Item
              name="targetAudience"
              label="目标人群"
              rules={[{ required: true, message: '请输入目标人群' }]}
            >
              <Input placeholder="例如：初中生" />
            </Form.Item>
            
            <Form.Item
              name="courseId"
              label="课程ID（可选）"
            >
              <Input placeholder="已创建课程的ID" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                构建评估体系
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 结果展示部分 */}
        <Card style={{ flex: 1 }} title="评估体系" loading={loading}>
          {assessmentResult && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>评估维度：</Text>
                {(assessmentResult.data.assessmentDimensions || []).map((dimension: BuildAssessmentResponse['assessmentDimensions'][0], index: number) => (
                  <div key={index} style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>{dimension.name}</h4>
                    <p><strong>描述：</strong>{dimension.description}</p>
                    <p><strong>权重：</strong>{dimension.weight}%</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>评估方法：</Text>
                {(assessmentResult.data.assessmentMethods || []).map((method: BuildAssessmentResponse['assessmentMethods'][0], index: number) => (
                  <div key={index} style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>{method.name}</h4>
                    <p><strong>适用维度：</strong>{method.applicableDimensions}</p>
                    <p><strong>实施建议：</strong>{method.implementationSuggestions}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>评估标准：</Text>
                {(assessmentResult.data.evaluationCriteria || []).map((criterion: BuildAssessmentResponse['evaluationCriteria'][0], index: number) => (
                  <div key={index} style={{ margin: '8px 0', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <p><strong>等级：</strong>{criterion.level}</p>
                    <p><strong>描述：</strong>{criterion.description}</p>
                    <p><strong>分数范围：</strong>{criterion.scoreRange}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>数据收集方法：</Text>
                <ul>
                  {(assessmentResult.data.dataCollectionMethods || []).map((method: string, index: number) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <Text strong>评估报告结构：</Text>
                <ul>
                  {(assessmentResult.data.reportingStructure || []).map((section: string, index: number) => (
                    <li key={index}>{section}</li>
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

export default AssessmentSystem;