// EdgeOne Pages 配置文件
module.exports = {
  // 静态站点配置
  staticSite: {
    // 构建目录，默认为 public
    buildDir: 'public',
    // 配置回退页面，用于支持客户端路由
    fallback: 'index.html'
  },
  // Edge Functions 配置
  edgeFunctions: {
    // API 路由前缀
    apiPrefix: '/api'
  }
};