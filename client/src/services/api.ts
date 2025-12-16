import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
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

// AI服务API
export const aiService = {
  // 课程需求分析
  analyzeDemand: (data: any) => api.post('/ai/analyze-demand', data),
  // 课程框架生成
  generateFramework: (data: any) => api.post('/ai/generate-framework', data),
  // 教学内容智能推荐
  recommendContent: (data: any) => api.post('/ai/recommend-content', data),
  // 行程规划优化
  optimizeItinerary: (data: any) => api.post('/ai/optimize-itinerary', data),
  // 评估体系构建
  buildAssessment: (data: any) => api.post('/ai/build-assessment', data),
};

// 课程服务API
export const courseService = {
  // 获取课程列表
  getCourses: () => api.get('/courses'),
  // 创建课程
  createCourse: (data: any) => api.post('/courses', data),
  // 获取单个课程
  getCourseById: (id: string) => api.get(`/courses/${id}`),
  // 更新课程
  updateCourse: (id: string, data: any) => api.put(`/courses/${id}`, data),
  // 删除课程
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),
};

// 资源服务API
export const resourceService = {
  // 获取资源列表
  getResources: () => api.get('/resources'),
  // 创建资源
  createResource: (data: any) => api.post('/resources', data),
  // 获取单个资源
  getResourceById: (id: string) => api.get(`/resources/${id}`),
  // 更新资源
  updateResource: (id: string, data: any) => api.put(`/resources/${id}`, data),
  // 删除资源
  deleteResource: (id: string) => api.delete(`/resources/${id}`),
};

export default api;
