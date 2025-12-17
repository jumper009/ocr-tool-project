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
      const { courseTitle, duration, courseStructure, location } = body;

      // 生成模拟数据
      const mockResult = {
        dailyItineraries: Array.from({ length: duration }, (_, i) => ({
          date: `第${i + 1}天`,
          schedule: [
            {
              time: "09:00-10:30",
              activity: `${courseTitle}课程模块${i + 1}`,
              location: `${location}教学中心`,
              transportation: "步行",
              notes: "请提前10分钟到达教室"
            },
            {
              time: "10:30-10:45",
              activity: "休息",
              location: `${location}休息区`,
              transportation: "步行",
              notes: "休息期间请保持安静"
            },
            {
              time: "10:45-12:00",
              activity: `${courseTitle}实践活动`,
              location: `${location}实践区`,
              transportation: "步行",
              notes: "请遵守安全操作规程"
            },
            {
              time: "12:00-13:30",
              activity: "午餐",
              location: `${location}餐厅`,
              transportation: "步行",
              notes: "请节约粮食，保持餐厅卫生"
            },
            {
              time: "13:30-15:30",
              activity: `${courseTitle}实地考察`,
              location: `${location}考察点`,
              transportation: "大巴",
              notes: "请听从导游安排，注意安全"
            },
            {
              time: "15:30-17:00",
              activity: "总结与分享",
              location: `${location}讨论区`,
              transportation: "步行",
              notes: "请积极参与讨论，分享收获"
            }
          ]
        })),
        logistics: {
          transportation: "统一安排大巴接送",
          accommodation: `${location}酒店，2人一间`,
          catering: "营养均衡的一日三餐",
          safety: "配备专业安全员，全程保障安全"
        },
        contingencyPlan: "如遇恶劣天气或其他突发情况，将调整行程或提供备选方案"
      };

      // 如果有OPENAI_API_KEY环境变量，调用真实的OpenAI API
      if (context.env.OPENAI_API_KEY) {
        return callOpenAI(courseTitle, duration, courseStructure, location, context.env.OPENAI_API_KEY);
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
async function callOpenAI(courseTitle, duration, courseStructure, location, apiKey) {
  const systemPrompt = `你是一位资深的研学旅行行程规划专家，请根据课程结构和时间安排，优化研学行程。`;

  const userPrompt = `请根据以下课程信息，生成一份优化的研学行程：
- 课程标题：${courseTitle}
- 课程时长：${duration}天
- 课程结构：${JSON.stringify(courseStructure)}
- 研学地点：${location}

请以JSON格式返回，包含以下字段：
- "dailyItineraries": 每日行程列表，每个行程包含日期、时间安排、活动内容、地点、交通方式和注意事项
- "logistics": 后勤安排，包含交通、住宿、餐饮和安全措施
- "contingencyPlan": 应急预案
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