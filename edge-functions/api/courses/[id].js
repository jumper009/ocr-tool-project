// EdgeOne 兼容的课程详情路由
export function onRequest(context) {
  const { id } = context.params;
  
  if (context.request.method === 'GET') {
    return getCourseById(context, id);
  } else if (context.request.method === 'PUT') {
    return updateCourse(context, id);
  } else if (context.request.method === 'DELETE') {
    return deleteCourse(context, id);
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

// 获取单个课程
async function getCourseById(context, id) {
  // 模拟课程数据
  const mockCourse = {
    _id: id,
    title: '故宫文化研学之旅',
    description: '探索中国古代皇宫文化与历史',
    createdBy: {
      _id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [
      {
        _id: 'module-1',
        title: '故宫历史概述',
        content: '故宫，旧称紫禁城，是中国明清两代的皇家宫殿...'
      },
      {
        _id: 'module-2',
        title: '故宫建筑特色',
        content: '故宫的建筑布局遵循严格的中轴线对称原则...'
      }
    ]
  };

  return new Response(JSON.stringify({
    success: true,
    data: mockCourse
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  });
}

// 更新课程
async function updateCourse(context, id) {
  try {
    const body = await context.request.json();
    
    // 模拟更新课程
    const updatedCourse = {
      _id: id,
      title: body.title || '故宫文化研学之旅',
      description: body.description || '探索中国古代皇宫文化与历史',
      createdBy: {
        _id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body
    };

    return new Response(JSON.stringify({
      success: true,
      data: updatedCourse
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

// 删除课程
async function deleteCourse(context, id) {
  // 模拟删除课程
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