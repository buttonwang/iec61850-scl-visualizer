// 测试登录API（绕过邮箱确认）
async function testLoginTest() {
  const loginData = {
    email: 'user1763044150720@testmail.com',
    password: 'test123456'
  };

  try {
    console.log('测试绕过邮箱确认的登录...');
    console.log('登录数据:', loginData);

    const response = await fetch('http://localhost:3000/api/auth/login-test', {
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
testLoginTest();