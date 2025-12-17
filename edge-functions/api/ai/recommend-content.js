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
      const { courseTitle, courseFramework, targetAudience } = body;

      // 生成模拟数据
      const mockResult = {
        contentRecommendations: [
          {
            title: `${courseTitle}核心概念解析`,
            type: "理论讲解",
            description: "深入解析${courseTitle}的核心概念和理论框架",
            suggestion: "作为课程的开篇内容，帮助学生建立基本认知"
          },
          {
            title: `${courseTitle}实践案例分析`,
            type: "案例分析",
            description: "分析${courseTitle}领域的经典实践案例",
            suggestion: "结合实际案例，加深学生对理论知识的理解"
          },
          {
            title: `${courseTitle}实地考察`,
            type: "实践活动",
            description: "前往${courseTitle}相关场所进行实地考察",
            suggestion: "通过亲身体验，增强学生的实践感知能力"
          }
        ],
        resourceRecommendations: [
          {
            title: "${courseTitle}教学指南",
            type: "教学资料",
            url: "#",
            suggestion: "教师备课和学生学习的重要参考资料"
          },
          {
            title: "${courseTitle}实践基地",
            type: "实地资源",
            url: "#",
            suggestion: "提供真实的实践环境，增强学习效果"
          },
          {
            title: "${courseTitle}在线学习平台",
            type: "数字资源",
            url: "#",
            suggestion: "提供丰富的在线学习资源，支持自主学习"
          }
        ],
        interactiveActivities: [
          "${courseTitle}知识竞赛",
          "小组项目设计与展示",
          "角色扮演活动",
          "问题解决挑战"
        ]
      };

      // 如果有OPENAI_API_KEY环境变量，调用真实的OpenAI API
      if (context.env.OPENAI_API_KEY) {
        return callOpenAI(courseTitle, courseFramework, targetAudience, context.env.OPENAI_API_KEY);
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
async function callOpenAI(courseTitle, courseFramework, targetAudience, apiKey) {
  const systemPrompt = `你是一位资深的研学旅行课程开发专家，请根据课程框架和目标人群，推荐合适的教学内容和资源。`;

  const userPrompt = `请根据以下课程信息，推荐合适的教学内容和资源：
- 课程标题：${courseTitle}
- 课程框架：${JSON.stringify(courseFramework)}
- 目标人群：${targetAudience}

请以JSON格式返回，包含以下字段：
- "contentRecommendations": 教学内容推荐列表，每个推荐包含标题、类型、描述和使用建议
- "resourceRecommendations": 资源推荐列表，每个资源包含标题、类型、URL和使用建议
- "interactiveActivities": 互动活动建议列表
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