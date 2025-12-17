// EdgeOne 兼容的资源详情路由
export function onRequest(context) {
  const { id } = context.params;
  
  if (context.request.method === 'GET') {
    return getResourceById(context, id);
  } else if (context.request.method === 'PUT') {
    return updateResource(context, id);
  } else if (context.request.method === 'DELETE') {
    return deleteResource(context, id);
  } else {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        'Allow': 'GET, PUT, DELETE'
      }
    });
  }
}

// 获取单个资源
async function getResourceById(context, id) {
  // 模拟资源数据
  const mockResource = {
    _id: id,
    title: '故宫历史图片集',
    type: 'image',
    url: 'https://example.com/images/forbidden-city.jpg',
    description: '故宫建筑与文物图片集',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      resolution: '1920x1080',
      size: '2.5MB',
      tags: ['故宫', '历史', '建筑']
    }
  };

  return new Response(JSON.stringify({
    success: true,
    data: mockResource
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  });
}

// 更新资源
async function updateResource(context, id) {
  try {
    const body = await context.request.json();
    
    // 模拟更新资源
    const updatedResource = {
      _id: id,
      title: body.title || '故宫历史图片集',
      type: body.type || 'image',
      url: body.url || 'https://example.com/images/forbidden-city.jpg',
      description: body.description || '故宫建筑与文物图片集',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: body.metadata || {
        resolution: '1920x1080',
        size: '2.5MB',
        tags: ['故宫', '历史', '建筑']
      },
      ...body
    };

    return new Response(JSON.stringify({
      success: true,
      data: updatedResource
    }), {
      status: 200,
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

// 删除资源
async function deleteResource(context, id) {
  // 模拟删除资源
  return new Response(JSON.stringify({
    success: true,
    data: {}
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  });
}