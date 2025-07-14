-- Database migration for Members and Roles Management
-- Create tables for team members, roles, and their relationships

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    color VARCHAR(20) DEFAULT 'gray',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    avatar_url TEXT,
    title VARCHAR(100),
    department VARCHAR(100),
    bio TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    links JSONB DEFAULT '{}'::jsonb,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create member_projects junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS member_projects (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(50), -- Project-specific role (e.g., 'Lead Developer', 'Designer')
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(member_id, project_id)
);

-- Insert default roles
INSERT INTO roles (name, display_name, description, permissions, color) VALUES
    ('ADMIN', 'Administrator', 'Full system access with all permissions', 
     '["CREATE", "READ", "UPDATE", "DELETE", "MANAGE_USERS", "MANAGE_ROLES"]'::jsonb, 'red'),
    ('MEMBER', 'Team Member', 'Standard access with project management capabilities', 
     '["CREATE", "READ", "UPDATE"]'::jsonb, 'blue'),
    ('VIEWER', 'Viewer', 'Read-only access to view content', 
     '["READ"]'::jsonb, 'gray')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_role_id ON members(role_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_department ON members(department);
CREATE INDEX IF NOT EXISTS idx_member_projects_member_id ON member_projects(member_id);
CREATE INDEX IF NOT EXISTS idx_member_projects_project_id ON member_projects(project_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('roles', 'members', 'member_projects')
ORDER BY table_name, ordinal_position;
