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
      const { courseTitle, courseObjectives, targetAudience } = body;

      // 生成模拟数据
      const mockResult = {
        assessmentDimensions: [
          {
            name: "知识掌握",
            description: "学生对${courseTitle}核心知识的掌握程度",
            weight: 0.3
          },
          {
            name: "实践能力",
            description: "学生在${courseTitle}实践活动中的表现",
            weight: 0.4
          },
          {
            name: "团队协作",
            description: "学生在小组活动中的协作能力",
            weight: 0.2
          },
          {
            name: "创新思维",
            description: "学生在${courseTitle}学习中的创新表现",
            weight: 0.1
          }
        ],
        assessmentMethods: [
          {
            name: "理论考试",
            applicableDimensions: ["知识掌握"],
            suggestion: "采用闭卷考试形式，考察学生对核心知识的掌握"
          },
          {
            name: "实践操作评估",
            applicableDimensions: ["实践能力"],
            suggestion: "在实践活动中进行现场评估，记录学生的操作过程和结果"
          },
          {
            name: "小组项目评估",
            applicableDimensions: ["团队协作", "创新思维"],
            suggestion: "对小组项目的完成情况进行综合评估，包括协作过程和创新点"
          },
          {
            name: "学习日志评估",
            applicableDimensions: ["知识掌握", "实践能力"],
            suggestion: "通过分析学生的学习日志，评估其学习进度和收获"
          }
        ],
        evaluationCriteria: [
          {
            level: "优秀",
            description: "完全掌握${courseTitle}的核心知识，实践能力强，具有较强的创新思维和团队协作能力",
            scoreRange: "90-100"
          },
          {
            level: "良好",
            description: "较好掌握${courseTitle}的核心知识，实践能力较强，具有一定的创新思维和团队协作能力",
            scoreRange: "80-89"
          },
          {
            level: "合格",
            description: "基本掌握${courseTitle}的核心知识，实践能力一般，能够参与团队协作",
            scoreRange: "60-79"
          },
          {
            level: "不合格",
            description: "未能掌握${courseTitle}的核心知识，实践能力较弱，团队协作能力不足",
            scoreRange: "0-59"
          }
        ],
        dataCollectionMethods: [
          "考试试卷收集",
          "实践操作录像",
          "小组项目成果",
          "学习日志",
          "教师观察记录"
        ],
        reportingStructure: [
          "学生基本信息",
          "各评估维度得分情况",
          "综合评估结果",
          "学习亮点与建议",
          "教师评语"
        ]
      };

      // 如果有OPENAI_API_KEY环境变量，调用真实的OpenAI API
      if (context.env.OPENAI_API_KEY) {
        return callOpenAI(courseTitle, courseObjectives, targetAudience, context.env.OPENAI_API_KEY);
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
async function callOpenAI(courseTitle, courseObjectives, targetAudience, apiKey) {
  const systemPrompt = `你是一位资深的研学旅行课程评估专家，请根据课程目标和目标人群，构建一套完整的课程评估体系。`;

  const userPrompt = `请根据以下课程信息，构建一套完整的课程评估体系：
- 课程标题：${courseTitle}
- 课程目标：${JSON.stringify(courseObjectives)}
- 目标人群：${targetAudience}

请以JSON格式返回，包含以下字段：
- "assessmentDimensions": 评估维度列表，每个维度包含名称、描述和权重
- "assessmentMethods": 评估方法列表，每个方法包含名称、适用维度和实施建议
- "evaluationCriteria": 评估标准，包含不同等级的描述和分数范围
- "dataCollectionMethods": 数据收集方法列表
- "reportingStructure": 评估报告结构
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