// 测试登录最新确认的用户
async function testLoginLatest() {
  const loginData = {
    email: 'user1763044150720@testmail.com',
    password: 'test123456'
  };

  try {
    console.log('测试最新确认的用户登录...');
    console.log('登录数据:', loginData);

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log('响应状态:', response.status);
    const data = await response.json();
    console.log('响应数据:', data);

    if (response.ok) {
      console.log('✅ 用户登录成功!');
    } else {
      console.log('❌ 用户登录失败:', data.error);
    }
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testLoginLatest();