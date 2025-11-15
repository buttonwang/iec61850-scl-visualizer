// 测试完整流程：注册 + 确认 + 登录
async function testFullFlow() {
  const timestamp = Date.now();
  const testData = {
    email: `user${timestamp}@testmail.com`,
    password: 'test123456'
  };

  try {
    console.log('=== 测试完整流程 ===');
    console.log('1. 用户注册...');
    console.log('注册数据:', testData);

    // 1. 注册
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const registerData = await registerResponse.json();
    console.log('注册响应:', registerData);

    if (!registerResponse.ok) {
      console.log('❌ 注册失败');
      return;
    }

    console.log('✅ 注册成功!');

    // 2. 确认用户
    console.log('\n2. 确认用户邮箱...');
    const confirmResponse = await fetch('http://localhost:3000/api/auth/confirm-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testData.email })
    });

    const confirmData = await confirmResponse.json();
    console.log('确认响应:', confirmData);

    if (!confirmResponse.ok) {
      console.log('❌ 确认失败');
      return;
    }

    console.log('✅ 确认成功!');

    // 3. 登录
    console.log('\n3. 用户登录...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const loginData = await loginResponse.json();
    console.log('登录响应:', loginData);

    if (loginResponse.ok) {
      console.log('✅ 登录成功! 完整流程测试通过!');
    } else {
      console.log('❌ 登录失败:', loginData.error);
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testFullFlow();