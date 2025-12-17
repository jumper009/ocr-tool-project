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
      const { email, password } = body;

      // 简单验证输入
      if (!email || !password) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }), { 
          status: 400,
          headers: { 'content-type': 'application/json' }
        });
      }

      // 测试账户验证（用于部署测试）
      const testEmail = context.env.TEST_EMAIL;
      const testPassword = context.env.TEST_PASSWORD;
      const testUsername = context.env.TEST_USERNAME;
      const testRole = context.env.TEST_ROLE;

      // 检查是否是测试账户登录
      if (testEmail && testPassword && email === testEmail && password === testPassword) {
        // 生成JWT token
        const token = testEmail.split('@')[0] + '-' + Date.now() + '-token';

        return new Response(JSON.stringify({
          success: true,
          data: {
            _id: 'test-user-id',
            username: testUsername || 'testuser',
            email: testEmail,
            role: testRole || 'user',
            token,
          },
        }), { 
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }

      // 非测试账户登录逻辑（简化版，实际部署时可能需要连接数据库）
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid credentials' 
      }), { 
        status: 400,
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