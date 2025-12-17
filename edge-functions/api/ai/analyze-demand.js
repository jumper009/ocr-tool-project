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
      const { courseTitle, targetAudience, duration, objectives } = body;

      // 这里应该调用OpenAI API或其他AI服务
      // 为了演示，我们直接返回模拟数据
      const mockResult = {
        demandSummary: `基于需求分析，该课程针对${targetAudience}设计，时长${duration}天，主题为${courseTitle}，旨在${objectives}。`,
        targetAudienceAnalysis: `${targetAudience}具有较强的好奇心和探索欲，适合通过实践和互动的方式进行学习。`,
        coreObjectives: [
          `${objectives}`,
          `培养${targetAudience}的实践能力和团队协作精神`,
          `增强${targetAudience}对${courseTitle}主题的理解和兴趣`
        ],
        keyTopics: [
          `${courseTitle}的核心概念`,
          `${courseTitle}的实践应用`,
          `${courseTitle}的发展趋势`
        ],
        teachingMethods: [
          "实地考察法",
          "小组讨论法",
          "项目式学习法",
          "案例分析法"
        ],
        resourcesRequired: [
          "专业教师团队",
          "实地考察场地",
          "教学设备",
          "安全保障措施"
        ]
      };

      // 如果有OPENAI_API_KEY环境变量，调用真实的OpenAI API
      if (context.env.OPENAI_API_KEY) {
        return callOpenAI(courseTitle, targetAudience, duration, objectives, context.env.OPENAI_API_KEY);
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
async function callOpenAI(courseTitle, targetAudience, duration, objectives, apiKey) {
  const systemPrompt = `你是一位资深的研学旅行课程开发专家，请根据用户提供的课程信息，生成一份详细的课程需求分析报告。`;

  const userPrompt = `请分析以下研学旅行课程需求，并生成一份结构化的需求分析报告：
- 课程标题：${courseTitle}
- 目标人群：${targetAudience}
- 课程时长：${duration}天
- 课程目标：${objectives}

请以JSON格式返回，包含以下字段：
- "demandSummary": 需求摘要
- "targetAudienceAnalysis": 目标人群分析
- "coreObjectives": 核心目标列表
- "keyTopics": 关键主题列表
- "teachingMethods": 建议教学方法列表
- "resourcesRequired": 所需资源列表
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
