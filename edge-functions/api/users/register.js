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
      const { username, email, password, role } = body;

      // 简单验证输入
      if (!username || !email || !password) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }), { 
          status: 400,
          headers: { 'content-type': 'application/json' }
        });
      }

      // 测试环境下的简单注册逻辑
      // 实际部署时可能需要连接数据库进行用户唯一性检查和密码加密

      // 生成模拟token
      const token = email.split('@')[0] + '-' + Date.now() + '-token';

      return new Response(JSON.stringify({
        success: true,
        data: {
          _id: 'user-' + Date.now(),
          username: username,
          email: email,
          role: role || 'user',
          token,
        },
      }), {
        status: 201,
        headers: { 'content-type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }
  });
}