export function onRequest(context) {
  // 只处理POST请求
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Method not allowed' 
    }), { 
      status: 405,
      headers: { 'content-type': 'application/json' } 
    });
  }

  return context.request.json().then(async (body) => {
    try {
      const { courseTitle, demandAnalysis } = body;

      // 生成模拟数据
      const mockResult = {
        courseObjectives: [
          `深入了解${courseTitle}的核心概念和实践应用`,
          `培养学生的创新思维和解决问题的能力`,
          `增强学生对${courseTitle}领域的兴趣和探索欲`
        ],
        courseStructure: [
          {
            name: "模块一：${courseTitle}基础",
            objective: "掌握${courseTitle}的基本概念和理论框架",
            content: "${courseTitle}的定义、发展历程、核心原理",
            duration: "半天",
            teachingMethod: "理论讲解+案例分析"
          },
          {
            name: "模块二：${courseTitle}实践",
            objective: "通过实践活动加深对${courseTitle}的理解",
            content: "实地考察、实验操作、小组讨论",
            duration: "一天",
            teachingMethod: "实地考察法+项目式学习法"
          },
          {
            name: "模块三：${courseTitle}创新应用",
            objective: "培养学生的创新思维和实践能力",
            content: "设计创新方案、展示成果、反思总结",
            duration: "一天半",
            teachingMethod: "小组协作法+成果展示法"
          }
        ],
        teachingStrategies: [
          "以学生为中心的教学策略",
          "问题导向的学习策略",
          "情境教学策略",
          "多元评价策略"
        ],
        assessmentMethods: [
          "课堂参与度评估",
          "实践操作能力评估",
          "项目成果评估",
          "反思报告评估"
        ]
      };

      // 如果有OPENAI_API_KEY环境变量，调用真实的OpenAI API
      if (context.env.OPENAI_API_KEY) {
        return callOpenAI(courseTitle, demandAnalysis, context.env.OPENAI_API_KEY);
      }

      // 返回模拟数据
      return new Response(JSON.stringify({ 
        success: true, 
        data: mockResult 
      }), { 
        headers: { 'content-type': 'application/json' } 
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), { 
        status: 500,
        headers: { 'content-type': 'application/json' } 
      });
    }
  });
}

// 调用OpenAI API的函数
async function callOpenAI(courseTitle, demandAnalysis, apiKey) {
  const systemPrompt = `你是一位资深的研学旅行课程开发专家，请根据课程需求分析，生成一份完整的课程框架。`;

  const userPrompt = `请根据以下课程信息和需求分析，生成一份结构化的课程框架：
- 课程标题：${courseTitle}
- 需求分析：${JSON.stringify(demandAnalysis)}

请以JSON格式返回，包含以下字段：
- "courseObjectives": 课程目标列表
- "courseStructure": 课程结构，包含每个模块的名称、目标、内容、时长和教学方法
- "teachingStrategies": 教学策略列表
- "assessmentMethods": 评估方法列表
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    })
  });

  const result = await response.json();
  const output = JSON.parse(result.choices[0].message.content);

  return new Response(JSON.stringify({ 
    success: true, 
    data: output 
  }), { 
    headers: { 'content-type': 'application/json' } 
  });
}