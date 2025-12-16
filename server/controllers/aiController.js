const { OpenAI } = require('openai');
const AIContent = require('../models/AIContent');

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 通用AI生成函数
const generateAIContent = async (input, systemPrompt, userPrompt, type, courseId) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const output = JSON.parse(completion.choices[0].message.content);

    // 保存AI生成内容到数据库
    await AIContent.create({
      type,
      input,
      output,
      courseId,
    });

    return output;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw new Error('Failed to generate AI content');
  }
};

// 1. 课程需求分析
const analyzeDemand = async (req, res) => {
  try {
    const { courseTitle, targetAudience, duration, objectives } = req.body;
    const courseId = req.body.courseId;

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

    const output = await generateAIContent(
      req.body,
      systemPrompt,
      userPrompt,
      'demandAnalysis',
      courseId
    );

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 2. 课程框架生成
const generateFramework = async (req, res) => {
  try {
    const { courseTitle, demandAnalysis } = req.body;
    const courseId = req.body.courseId;

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

    const output = await generateAIContent(
      req.body,
      systemPrompt,
      userPrompt,
      'courseFramework',
      courseId
    );

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 3. 教学内容智能推荐
const recommendContent = async (req, res) => {
  try {
    const { courseTitle, courseFramework, targetAudience } = req.body;
    const courseId = req.body.courseId;

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

    const output = await generateAIContent(
      req.body,
      systemPrompt,
      userPrompt,
      'teachingContent',
      courseId
    );

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 4. 行程规划优化
const optimizeItinerary = async (req, res) => {
  try {
    const { courseTitle, duration, courseStructure, location } = req.body;
    const courseId = req.body.courseId;

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

    const output = await generateAIContent(
      req.body,
      systemPrompt,
      userPrompt,
      'itinerary',
      courseId
    );

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 5. 评估体系构建
const buildAssessment = async (req, res) => {
  try {
    const { courseTitle, courseObjectives, targetAudience } = req.body;
    const courseId = req.body.courseId;

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

    const output = await generateAIContent(
      req.body,
      systemPrompt,
      userPrompt,
      'assessment',
      courseId
    );

    res.status(200).json({
      success: true,
      data: output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  analyzeDemand,
  generateFramework,
  recommendContent,
  optimizeItinerary,
  buildAssessment,
};
