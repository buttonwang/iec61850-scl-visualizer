# IEC 61850 SCL文件解析与可视化系统

一个专业的智能变电站配置描述语言文件解析和可视化工具，支持IEC 61850标准。

## 功能特点

### 1. SCL文件解析
- ✅ 支持IEC 61850标准的.cid、.icd、.scd文件格式
- ✅ XML结构验证和解析
- ✅ 提取变电站、IED设备、通信配置等信息
- ✅ 详细的文件结构分析

### 2. 设备可视化
- ✅ 变电站设备拓扑图展示
- ✅ 电压等级、间隔、设备层次结构
- ✅ IED设备位置和连接关系
- ✅ 交互式设备选择和详情查看

### 3. 消息模拟
- ✅ IEC 61850消息类型模拟（READ、WRITE、CONTROL、GOOSE、SV等）
- ✅ 设备状态动态变化
- ✅ 自动模拟模式
- ✅ 消息响应时间和结果分析

### 4. 用户管理
- ✅ 用户注册和登录
- ✅ 文件管理和存储
- ✅ 项目分类和检索
- ✅ 数据安全和权限控制

## 技术栈

- **前端**: Next.js 14、React 18、TypeScript
- **样式**: Tailwind CSS
- **图表**: Recharts
- **图标**: Lucide React
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **存储**: Supabase Storage
- **认证**: Supabase Auth

## 快速开始

### 1. 环境配置

复制环境变量模板：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加您的Supabase配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库设置

在Supabase控制台中执行以下SQL创建数据库表：

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SCL文件表
CREATE TABLE scl_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  project_name TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('cid', 'icd', 'scd'))
);

-- 解析数据表
CREATE TABLE parsed_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_id UUID NOT NULL REFERENCES scl_files(id),
  parsed_content JSONB NOT NULL,
  summary JSONB,
  version TEXT,
  substation_count INTEGER DEFAULT 0,
  ied_count INTEGER DEFAULT 0,
  has_communication BOOLEAN DEFAULT FALSE,
  has_data_types BOOLEAN DEFAULT FALSE
);

-- 模拟日志表
CREATE TABLE simulation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_id UUID NOT NULL REFERENCES scl_files(id),
  message_type TEXT NOT NULL,
  target_device TEXT NOT NULL,
  parameters JSONB,
  response_time INTEGER,
  status TEXT CHECK (status IN ('success', 'error')),
  result_data JSONB
);

-- 创建索引
CREATE INDEX idx_scl_files_user_id ON scl_files(user_id);
CREATE INDEX idx_scl_files_created_at ON scl_files(created_at DESC);
CREATE INDEX idx_parsed_data_file_id ON parsed_data(file_id);
CREATE INDEX idx_simulation_logs_file_id ON simulation_logs(file_id);
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 使用说明

### 1. 文件上传
- 点击"文件上传"选项卡
- 选择.cid、.icd或.scd格式的SCL文件
- 系统自动解析并显示文件结构

### 2. 结构分析
- 查看SCL文件的详细结构
- 浏览变电站、IED设备、通信配置等信息
- 支持多标签页切换查看

### 3. 设备可视化
- 查看变电站设备拓扑图
- 点击设备查看详细信息
- 启动模拟观察设备状态变化

### 4. 消息模拟
- 选择目标设备和消息类型
- 发送IEC 61850消息
- 查看消息响应和结果分析

### 5. 文件管理
- 查看已上传的文件列表
- 下载和删除文件
- 按项目分类管理文件

## 部署

### Vercel部署

1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 其他平台

支持任何支持Next.js的平台部署。

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT License