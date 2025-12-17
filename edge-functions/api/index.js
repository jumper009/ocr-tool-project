// EdgeOne 兼容的 API 根路径路由
export function onRequest(context) {
  if (context.request.method === 'GET') {
    return new Response('研学旅行课程开发系统 API', {
      status: 200,
      headers: {
        'content-type': 'text/plain'
      }
    });
  } else {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        'Allow': 'GET'
      }
    });
  }
}