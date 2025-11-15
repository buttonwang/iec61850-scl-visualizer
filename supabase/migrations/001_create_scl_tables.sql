-- IEC 61850 SCL文件管理系统数据库表

-- 用户表（使用Supabase Auth，不需要单独创建）
-- 项目表
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- SCL文件表
CREATE TABLE scl_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('cid', 'icd', 'scd')),
    file_size INTEGER NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    upload_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 解析数据表
CREATE TABLE parsed_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id UUID REFERENCES scl_files(id) ON DELETE CASCADE,
    version VARCHAR(20),
    header JSONB,
    parsed_content JSONB NOT NULL,
    structure_summary JSONB,
    validation_errors JSONB,
    parsing_status VARCHAR(20) DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 模拟日志表
CREATE TABLE simulation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_id UUID REFERENCES scl_files(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL,
    target_device VARCHAR(255) NOT NULL,
    parameters JSONB,
    simulation_result JSONB,
    response_time_ms INTEGER,
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'timeout')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 文件标签表（用于分类管理）
CREATE TABLE file_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 文件标签关联表
CREATE TABLE file_tag_relations (
    file_id UUID REFERENCES scl_files(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES file_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (file_id, tag_id)
);

-- 创建索引优化查询性能
CREATE INDEX idx_scl_files_user_id ON scl_files(user_id);
CREATE INDEX idx_scl_files_project_id ON scl_files(project_id);
CREATE INDEX idx_scl_files_created_at ON scl_files(created_at DESC);
CREATE INDEX idx_scl_files_file_type ON scl_files(file_type);

CREATE INDEX idx_parsed_data_file_id ON parsed_data(file_id);
CREATE INDEX idx_parsed_data_parsing_status ON parsed_data(parsing_status);

CREATE INDEX idx_simulation_logs_user_id ON simulation_logs(user_id);
CREATE INDEX idx_simulation_logs_file_id ON simulation_logs(file_id);
CREATE INDEX idx_simulation_logs_created_at ON simulation_logs(created_at DESC);
CREATE INDEX idx_simulation_logs_message_type ON simulation_logs(message_type);

CREATE INDEX idx_file_tags_user_id ON file_tags(user_id);
CREATE INDEX idx_file_tag_relations_file_id ON file_tag_relations(file_id);
CREATE INDEX idx_file_tag_relations_tag_id ON file_tag_relations(tag_id);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表添加更新时间触发器
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scl_files_updated_at BEFORE UPDATE ON scl_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parsed_data_updated_at BEFORE UPDATE ON parsed_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_tags_updated_at BEFORE UPDATE ON file_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 设置RLS（行级安全）
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scl_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE parsed_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_tag_relations ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 项目表策略
CREATE POLICY "用户只能查看自己的项目" ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的项目" ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的项目" ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的项目" ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- SCL文件表策略
CREATE POLICY "用户只能查看自己的文件" ON scl_files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的文件" ON scl_files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的文件" ON scl_files FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的文件" ON scl_files FOR DELETE
    USING (auth.uid() = user_id);

-- 解析数据表策略
CREATE POLICY "用户只能查看自己文件的解析数据" ON parsed_data FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM scl_files 
        WHERE scl_files.id = parsed_data.file_id 
        AND scl_files.user_id = auth.uid()
    ));

-- 模拟日志表策略
CREATE POLICY "用户只能查看自己的模拟日志" ON simulation_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的模拟日志" ON simulation_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 文件标签表策略
CREATE POLICY "用户只能查看自己的标签" ON file_tags FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能管理自己的标签" ON file_tags FOR ALL
    USING (auth.uid() = user_id);

-- 文件标签关联表策略
CREATE POLICY "用户只能管理自己文件的标签关联" ON file_tag_relations FOR ALL
    USING (EXISTS (
        SELECT 1 FROM scl_files 
        WHERE scl_files.id = file_tag_relations.file_id 
        AND scl_files.user_id = auth.uid()
    ));