// EdgeOne 兼容的资源列表路由
export function onRequest(context) {
  if (context.request.method === 'GET') {
    return getResources(context);
  } else if (context.request.method === 'POST') {
    return createResource(context);
  } else {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        'Allow': 'GET, POST'
      }
    });
  }
}

// 获取资源列表
async function getResources(context) {
  // 模拟资源数据
  const mockResources = [
    {
      _id: 'resource-1',
      title: '故宫历史图片集',
      type: 'image',
      url: 'https://example.com/images/forbidden-city.jpg',
      description: '故宫建筑与文物图片集',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'resource-2',
      title: '长城建筑技术文档',
      type: 'document',
      url: 'https://example.com/documents/great-wall-tech.pdf',
      description: '长城建筑技术与材料分析',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    data: mockResources
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  });
}

// 创建资源
async function createResource(context) {
  try {
    const body = await context.request.json();
    
    // 模拟创建资源
    const newResource = {
      _id: 'resource-' + Date.now(),
      title: body.title || '新资源',
      type: body.type || 'document',
      url: body.url || 'https://example.com/default-resource',
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body
    };

    return new Response(JSON.stringify({
      success: true,
      data: newResource
    }), {
      status: 201,
      headers: {
        'content-type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json'
      }
    });
  }
}