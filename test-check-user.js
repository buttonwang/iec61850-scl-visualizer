// 检查用户状态
async function checkUserStatus() {
  const email = 'user1763044080737@testmail.com';
  
  try {
    console.log('检查用户状态...');
    console.log('用户邮箱:', email);

    // 获取用户列表
    const response = await fetch('http://localhost:3000/api/auth/list-users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('响应状态:', response.status);
    const data = await response.json();
    console.log('用户列表:', JSON.stringify(data, null, 2));

    // 找到特定用户
    const user = data.users?.find(u => u.email === email);
    if (user) {
      console.log('\n找到用户:');
      console.log('ID:', user.id);
      console.log('邮箱:', user.email);
      console.log('确认状态:', user.email_confirmed_at);
      console.log('创建时间:', user.created_at);
      console.log('用户元数据:', user.user_metadata);
    } else {
      console.log('未找到用户');
    }

  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

// 运行检查
checkUserStatus();