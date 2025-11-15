// 测试用户注册功能
async function testRegistration() {
  const testData = {
    email: 'user1234@testmail.com',
    password: 'test123456'
  };

  try {
    console.log('测试用户注册...');
    console.log('测试数据:', testData);

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('响应状态:', response.status);
    const data = await response.json();
    console.log('响应数据:', data);

    if (response.ok) {
      console.log('✅ 用户注册成功!');
    } else {
      console.log('❌ 用户注册失败:', data.error);
    }
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 测试登录功能
async function testLogin() {
  const loginData = {
    email: 'user1234@testmail.com',
    password: 'test123456'
  };

  try {
    console.log('\n测试用户登录...');
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
async function runTests() {
  await testRegistration();
  await testLogin();
}

runTests();