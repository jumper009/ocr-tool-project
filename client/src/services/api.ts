import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用/api作为基础路径，配合vite proxy
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 定义API响应接口
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// 用户相关接口
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// AI服务相关接口
export interface AnalyzeDemandData {
  courseTitle: string;
  targetAudience: string;
  duration: string;
  objectives: string;
  courseId?: string;
}

export interface AnalyzeDemandResponse {
  demandSummary: string;
  targetAudienceAnalysis: string;
  coreObjectives: string[];
  keyTopics: string[];
  teachingMethods: string[];
  resourcesRequired: string[];
}

export interface GenerateFrameworkData {
  courseTitle: string;
  demandAnalysis: string;
  courseId?: string;
}

export interface GenerateFrameworkResponse {
  frameworkId: string;
  courseTitle: string;
  courseObjectives: string[];
  courseStructure: {
    name: string;
    target: string;
    content: string;
    duration: string;
    teachingMethods: string;
  }[];
  teachingStrategies: string[];
  assessmentMethods: string[];
}

export interface RecommendContentData {
  courseFrameworkId: string;
  topics: string[];
  targetAudience: string;
}

export interface RecommendContentResponse {
  contentRecommendations: {
    title: string;
    type: string;
    description: string;
    usageSuggestions: string;
  }[];
  resourceRecommendations: {
    title: string;
    type: string;
    url: string;
    usageSuggestions: string;
  }[];
  interactiveActivities: string[];
}

export interface OptimizeItineraryData {
  courseTitle: string;
  duration: string;
  courseStructure: string;
  location: string;
  courseId?: string;
}

export interface OptimizeItineraryResponse {
  dailyItineraries: {
    date: string;
    timeSchedule: string;
    activities: string;
    location: string;
    transportation: string;
    notes: string;
  }[];
  logistics: {
    transportation: string;
    accommodation: string;
    catering: string;
    safetyMeasures: string;
  };
  contingencyPlan: string;
}

export interface BuildAssessmentData {
  courseFrameworkId: string;
  objectives: string[];
  targetAudience: string;
}

export interface BuildAssessmentResponse {
  assessmentDimensions: {
    name: string;
    description: string;
    weight: number;
  }[];
  assessmentMethods: {
    name: string;
    applicableDimensions: string;
    implementationSuggestions: string;
  }[];
  evaluationCriteria: {
    level: string;
    description: string;
    scoreRange: string;
  }[];
  dataCollectionMethods: string[];
  reportingStructure: string[];
}

// 课程相关接口
export interface Course {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  duration: string;
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  targetAudience: string;
  duration: string;
  objectives: string[];
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  targetAudience?: string;
  duration?: string;
  objectives?: string[];
}

// 资源相关接口
export interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceData {
  name: string;
  type: string;
  url: string;
  description: string;
  courseId?: string;
}

export interface UpdateResourceData {
  name?: string;
  type?: string;
  url?: string;
  description?: string;
  courseId?: string;
}

// 用户认证服务API
export const authService = {
  // 用户登录
  login: (data: LoginData): Promise<ApiResponse<{ token: string; user: User }>> => api.post('/users/login', data),
  // 用户注册
  register: (data: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> => api.post('/users/register', data),
};

// AI服务API
export const aiService = {
  // 课程需求分析
  analyzeDemand: (data: AnalyzeDemandData): Promise<ApiResponse<AnalyzeDemandResponse>> => api.post('/ai/analyze-demand', data),
  // 课程框架生成
  generateFramework: (data: GenerateFrameworkData): Promise<ApiResponse<GenerateFrameworkResponse>> => api.post('/ai/generate-framework', data),
  // 教学内容智能推荐
  recommendContent: (data: RecommendContentData): Promise<ApiResponse<RecommendContentResponse>> => api.post('/ai/recommend-content', data),
  // 行程规划优化
  optimizeItinerary: (data: OptimizeItineraryData): Promise<ApiResponse<OptimizeItineraryResponse>> => api.post('/ai/optimize-itinerary', data),
  // 评估体系构建
  buildAssessment: (data: BuildAssessmentData): Promise<ApiResponse<BuildAssessmentResponse>> => api.post('/ai/build-assessment', data),
};

// 课程服务API
export const courseService = {
  // 获取课程列表
  getCourses: () => api.get<ApiResponse<Course[]>>('/courses'),
  // 创建课程
  createCourse: (data: CreateCourseData) => api.post<ApiResponse<Course>>('/courses', data),
  // 获取单个课程
  getCourseById: (id: string) => api.get<ApiResponse<Course>>(`/courses/${id}`),
  // 更新课程
  updateCourse: (id: string, data: UpdateCourseData) => api.put<ApiResponse<Course>>(`/courses/${id}`, data),
  // 删除课程
  deleteCourse: (id: string) => api.delete<ApiResponse<void>>(`/courses/${id}`),
};

// 资源服务API
export const resourceService = {
  // 获取资源列表
  getResources: () => api.get<ApiResponse<Resource[]>>('/resources'),
  // 创建资源
  createResource: (data: CreateResourceData) => api.post<ApiResponse<Resource>>('/resources', data),
  // 获取单个资源
  getResourceById: (id: string) => api.get<ApiResponse<Resource>>(`/resources/${id}`),
  // 更新资源
  updateResource: (id: string, data: UpdateResourceData) => api.put<ApiResponse<Resource>>(`/resources/${id}`, data),
  // 删除资源
  deleteResource: (id: string) => api.delete<ApiResponse<void>>(`/resources/${id}`),
};

export default api;
