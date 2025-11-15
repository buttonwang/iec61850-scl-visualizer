// 测试用户确认功能
async function confirmUser() {
  const email = 'user1234@testmail.com';
  
  try {
    console.log('确认用户邮箱...');
    console.log('用户邮箱:', email);

    // 使用Supabase Admin API确认用户
    const response = await fetch('http://localhost:3000/api/auth/confirm-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    console.log('响应状态:', response.status);
    const data = await response.json();
    console.log('响应数据:', data);

    if (response.ok) {
      console.log('✅ 用户确认成功!');
    } else {
      console.log('❌ 用户确认失败:', data.error);
    }
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行确认测试
confirmUser();