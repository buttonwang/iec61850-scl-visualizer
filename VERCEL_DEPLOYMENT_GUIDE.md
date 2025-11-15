# Vercel部署指南

## 🚀 部署到Vercel

### 📋 前提条件
- 项目构建成功 ✅
- 所有依赖项安装完成 ✅
- 环境变量配置完成 ✅

### 🔧 部署步骤

#### 1. 环境变量配置
在Vercel控制台中设置以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://gcgwtknahxbzyyugykjd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3d0a25haHhienl5dWd5a2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDE1MzEsImV4cCI6MjA3ODYxNzUzMX0.Fzsl0NvKxUrIBrp2ehroxyXHyKqnkwW30iPLkmKtFXc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3d0a25haHhienl5dWd5a2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA0MTUzMSwiZXhwIjoyMDc4NjE3NTMxfQ.cjpy-6f1yMHJCR1T8RU-s8K2yqp21W2FxTPyuM0Gtuw
NODE_ENV=production
```

#### 2. 构建配置
构建命令：`npm run build`
输出目录：`.next`
安装命令：`npm install`

#### 3. 框架设置
框架：Next.js
Node.js版本：18.x 或更高

### 🎯 部署前检查清单

- [x] 项目成功构建
- [x] 所有API端点工作正常
- [x] 环境变量已配置
- [x] Supabase数据库连接正常
- [x] 文件上传功能测试通过
- [x] 消息模拟功能测试通过
- [x] 用户认证系统工作正常

### 🔍 功能验证

部署后请验证以下功能：

1. **文件上传和解析** ✅
   - 支持.cid, .icd, .scd文件格式
   - 正确解析SCL文件结构
   - 显示变电站和IED设备信息

2. **设备可视化** ✅
   - 变电站拓扑图显示
   - 设备状态可视化
   - 交互式设备查看

3. **消息模拟** ✅
   - GOOSE消息模拟
   - SV采样值模拟
   - MMS制造消息模拟
   - 设备响应测试

4. **用户认证** ✅
   - 用户注册功能
   - 用户登录功能
   - 文件管理功能
   - 项目历史记录

### ⚠️ 注意事项

1. **环境变量安全**
   - 确保Service Role Key只在服务器端使用
   - Anon Key可以在前端使用
   - 不要在代码中硬编码敏感信息

2. **数据库权限**
   - 确保Supabase数据库权限正确配置
   - anon角色有适当的读取权限
   - authenticated角色有完整的CRUD权限

3. **文件大小限制**
   - 大文件上传可能需要调整Vercel的函数超时设置
   - 考虑使用Vercel的Edge Functions处理大文件

### 🛠️ 故障排除

#### 如果部署失败：
1. 检查构建日志中的错误信息
2. 验证所有环境变量是否正确设置
3. 确保Supabase项目正常运行
4. 检查API端点是否可访问

#### 如果功能异常：
1. 检查浏览器控制台错误
2. 验证网络请求是否成功
3. 检查Supabase数据库连接
4. 查看Vercel函数日志

### 📞 支持

如果遇到问题，请检查：
- Vercel部署日志
- Supabase控制台
- 浏览器开发者工具
- 项目文档和README

---

**🎉 项目已准备好部署到Vercel！**