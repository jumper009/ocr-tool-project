// EdgeOne 兼容的课程列表路由
export function onRequest(context) {
  if (context.request.method === 'GET') {
    return getCourses(context);
  } else if (context.request.method === 'POST') {
    return createCourse(context);
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

// 获取课程列表
async function getCourses(context) {
  // 模拟课程数据
  const mockCourses = [
    {
      _id: 'course-1',
      title: '故宫文化研学之旅',
      description: '探索中国古代皇宫文化与历史',
      createdBy: {
        _id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'course-2',
      title: '长城历史探索课程',
      description: '了解长城的建造历史与军事防御体系',
      createdBy: {
        _id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    data: mockCourses
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  });
}

// 创建课程
async function createCourse(context) {
  try {
    const body = await context.request.json();
    
    // 模拟创建课程
    const newCourse = {
      _id: 'course-' + Date.now(),
      title: body.title || '新课程',
      description: body.description || '',
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
      data: newCourse
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