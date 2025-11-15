-- 修复SCL文件表的字段结构
ALTER TABLE scl_files 
DROP COLUMN IF EXISTS file_url,
DROP COLUMN IF EXISTS project_name,
ADD COLUMN IF NOT EXISTS file_hash VARCHAR(64),
ADD COLUMN IF NOT EXISTS upload_path TEXT,
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- 修复解析数据表的字段结构
ALTER TABLE parsed_data
DROP COLUMN IF EXISTS summary,
DROP COLUMN IF EXISTS substation_count,
DROP COLUMN IF EXISTS ied_count,
DROP COLUMN IF EXISTS has_communication,
DROP COLUMN IF EXISTS has_data_types,
ADD COLUMN IF NOT EXISTS header JSONB,
ADD COLUMN IF NOT EXISTS structure_summary JSONB,
ADD COLUMN IF NOT EXISTS validation_errors JSONB,
ADD COLUMN IF NOT EXISTS parsing_status VARCHAR(20) DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed'));

-- 创建存储桶（如果还没有创建）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('scl-files', 'scl-files', true, 52428800, ARRAY['application/xml', 'text/xml'])
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶的访问策略
CREATE POLICY "SCL文件存储策略" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'scl-files' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'scl-files' AND auth.uid()::text = (storage.foldername(name))[1]);