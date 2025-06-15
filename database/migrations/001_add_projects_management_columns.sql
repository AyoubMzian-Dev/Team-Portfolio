-- Database migration for Projects Management feature
-- Add missing columns to projects table if they don't exist

-- Add long_description column for detailed project descriptions
ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description TEXT;

-- Add category column for project categorization
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Add status column for project lifecycle management
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Update existing projects to have draft status if status is null
UPDATE projects SET status = 'draft' WHERE status IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;
