"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Enhanced logging for debugging
const logOperation = (operation: string, data?: any) => {
  console.log(`👥 [${new Date().toISOString()}] ${operation}`, data ? JSON.stringify(data, null, 2) : '')
}

// Types based on your existing team_members table structure
export interface TeamMember {
  id: number
  name: string
  role: string // This is the job role/title, not a foreign key
  bio?: string
  image_url?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  skills: string[]
  created_at: Date
}

// For compatibility with the UI, we'll map this to the expected Member interface
export interface Member {
  id: number
  name: string
  email?: string // Not in team_members table, we'll use a placeholder or make optional
  role?: { // We'll adapt the role string to this structure for UI compatibility
    id: number
    name: string
    display_name: string
    color: string
  }
  status: "active" | "inactive" | "pending"
  avatar_url?: string
  title?: string
  department?: string
  bio?: string
  skills: string[]
  links: {
    github?: string
    linkedin?: string
    portfolio?: string
    twitter?: string
  }
  join_date: Date
  created_at: Date
  updated_at: Date
  project_count?: number
}

export interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  permissions: string[]
  color: string
  created_at: Date
  updated_at: Date
  member_count?: number
}

// Database row type for team_members
interface TeamMemberRow {
  id: number
  name: string
  role: string
  bio?: string
  image_url?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  skills: string[] | string // Can be array or JSON string
  created_at: Date
}

// Validation schemas adapted for team_members table
const TeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.string().min(1, "Role is required").max(100, "Role too long"),
  bio: z.string().max(1000, "Bio too long").optional(),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  github_url: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  skills: z.array(z.string().max(50, "Skill name too long")).default([])
})

const RoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name too long").regex(/^[A-Z_]+$/, "Role name must be uppercase with underscores"),
  display_name: z.string().min(1, "Display name is required").max(100, "Display name too long"),
  description: z.string().max(500, "Description too long").optional(),
  permissions: z.array(z.string()).default([]),
  color: z.string().regex(/^(red|blue|green|yellow|purple|pink|gray|orange|teal|cyan)$/, "Invalid color").default("gray")
})

// Helper functions
function parseSkills(skills: any): string[] {
  if (Array.isArray(skills)) {
    return skills
  }
  if (typeof skills === 'string') {
    try {
      return JSON.parse(skills)
    } catch {
      return []
    }
  }
  return []
}

// Map role string to role object for UI compatibility
function mapRoleStringToObject(roleString: string): { id: number; name: string; display_name: string; color: string } {
  const roleMap: Record<string, { id: number; name: string; display_name: string; color: string }> = {
    "Full-Stack Developer": { id: 1, name: "FULLSTACK", display_name: "Full-Stack Developer", color: "blue" },
    "Frontend Developer": { id: 2, name: "FRONTEND", display_name: "Frontend Developer", color: "green" },
    "Backend Developer": { id: 3, name: "BACKEND", display_name: "Backend Developer", color: "purple" },
    "UI/UX Designer": { id: 4, name: "DESIGNER", display_name: "UI/UX Designer", color: "pink" },
    "DevOps Engineer": { id: 5, name: "DEVOPS", display_name: "DevOps Engineer", color: "orange" },
    "Project Manager": { id: 6, name: "PM", display_name: "Project Manager", color: "yellow" },
    "Data Scientist": { id: 7, name: "DATA", display_name: "Data Scientist", color: "cyan" },
    "Mobile Developer": { id: 8, name: "MOBILE", display_name: "Mobile Developer", color: "teal" }
  }
  
  return roleMap[roleString] || { id: 0, name: "OTHER", display_name: roleString, color: "gray" }
}

function transformTeamMemberToMember(row: TeamMemberRow): Member {
  return {
    id: row.id,
    name: row.name,
    email: `${row.name.toLowerCase().replace(/\s+/g, '.')}@team.com`, // Generate placeholder email
    role: mapRoleStringToObject(row.role),
    status: "active" as const, // Default to active since not in table
    avatar_url: row.image_url,
    title: row.role,
    department: undefined,
    bio: row.bio,
    skills: parseSkills(row.skills),
    links: {
      github: row.github_url,
      linkedin: row.linkedin_url,
      twitter: row.twitter_url
    },
    join_date: row.created_at,
    created_at: row.created_at,
    updated_at: row.created_at, // Use created_at since updated_at doesn't exist
    project_count: 0 // Default since we don't have project assignments
  }
}

function transformRoleRow(row: any): Role {
  return {
    id: row.id,
    name: row.name,
    display_name: row.display_name,
    description: row.description,
    permissions: parseJsonField(row.permissions, []),
    color: row.color,
    created_at: row.created_at,
    updated_at: row.updated_at,
    member_count: row.member_count
  }
}

function parseJsonField(field: any, fallback: any = null): any {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return fallback
    }
  }
  return field || fallback
}

// TEAM MEMBER OPERATIONS

export async function getMembers(): Promise<Member[]> {
  try {
    logOperation("GET_TEAM_MEMBERS")
    
    const result = await sql`
      SELECT * FROM team_members
      ORDER BY created_at DESC
    `
    
    const members = result.map(transformTeamMemberToMember)
    logOperation("GET_TEAM_MEMBERS_SUCCESS", { count: members.length })
    return members
  } catch (error) {
    logOperation("GET_TEAM_MEMBERS_ERROR", error)
    throw new Error("Failed to fetch team members")
  }
}

export async function getMemberById(id: number): Promise<Member | null> {
  try {
    logOperation("GET_TEAM_MEMBER_BY_ID", { id })
    
    const result = await sql`
      SELECT * FROM team_members
      WHERE id = ${id}
    `
    
    if (result.length === 0) {
      logOperation("GET_TEAM_MEMBER_BY_ID_NOT_FOUND", { id })
      return null
    }
    
    const member = transformTeamMemberToMember(result[0] as TeamMemberRow)
    logOperation("GET_TEAM_MEMBER_BY_ID_SUCCESS", { id, name: member.name })
    return member
  } catch (error) {
    logOperation("GET_TEAM_MEMBER_BY_ID_ERROR", { id, error })
    throw new Error("Failed to fetch team member")
  }
}

export async function createMember(formData: FormData): Promise<{ success: boolean; member?: Member; error?: string }> {
  try {
    logOperation("CREATE_TEAM_MEMBER_START")
    
    // Extract and validate data
    const rawData = {
      name: formData.get("name")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
      image_url: formData.get("image_url")?.toString() || "",
      github_url: formData.get("github_url")?.toString() || "",
      linkedin_url: formData.get("linkedin_url")?.toString() || "",
      twitter_url: formData.get("twitter_url")?.toString() || "",
      skills: JSON.parse(formData.get("skills")?.toString() || "[]")
    }
    
    logOperation("CREATE_TEAM_MEMBER_RAW_DATA", rawData)
    
    const validatedData = TeamMemberSchema.parse(rawData)
    logOperation("CREATE_TEAM_MEMBER_VALIDATED", validatedData)
    
    // Insert team member
    const result = await sql`
      INSERT INTO team_members (
        name, role, bio, image_url, github_url, linkedin_url, twitter_url, skills
      ) VALUES (
        ${validatedData.name},
        ${validatedData.role},
        ${validatedData.bio || null},
        ${validatedData.image_url || null},
        ${validatedData.github_url || null},
        ${validatedData.linkedin_url || null},
        ${validatedData.twitter_url || null},
        ${validatedData.skills}
      ) RETURNING *
    `
    
    const newMember = transformTeamMemberToMember(result[0] as TeamMemberRow)
    logOperation("CREATE_TEAM_MEMBER_SUCCESS", { id: newMember.id, name: newMember.name })
    
    revalidatePath("/admin/members")
    
    return { success: true, member: newMember }
  } catch (error) {
    logOperation("CREATE_TEAM_MEMBER_ERROR", error)
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    
    return { success: false, error: "Failed to create team member" }
  }
}

export async function updateMember(id: number, formData: FormData): Promise<{ success: boolean; member?: Member; error?: string }> {
  try {
    logOperation("UPDATE_TEAM_MEMBER_START", { id })
    
    // Extract and validate data
    const rawData = {
      name: formData.get("name")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
      image_url: formData.get("image_url")?.toString() || "",
      github_url: formData.get("github_url")?.toString() || "",
      linkedin_url: formData.get("linkedin_url")?.toString() || "",
      twitter_url: formData.get("twitter_url")?.toString() || "",
      skills: JSON.parse(formData.get("skills")?.toString() || "[]")
    }
    
    const validatedData = TeamMemberSchema.partial().parse(rawData)
    logOperation("UPDATE_TEAM_MEMBER_VALIDATED", { id, data: validatedData })
    
    // Check if team member exists
    const existingMember = await getMemberById(id)
    if (!existingMember) {
      return { success: false, error: "Team member not found" }
    }
    
    // Build dynamic update query
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${updateValues.length + 2}`) // +2 because id is $1
        if (key === 'skills') {
          updateValues.push(value) // PostgreSQL array
        } else {
          updateValues.push(value)
        }
      }
    })
    
    if (updateFields.length === 0) {
      return { success: false, error: "No fields to update" }
    }
    
    const updateQuery = `
      UPDATE team_members 
      SET ${updateFields.join(', ')}
      WHERE id = $1 
      RETURNING *
    `
    
    const result = await sql.query(updateQuery, [id, ...updateValues])
    
    const updatedMember = transformTeamMemberToMember(result.rows[0] as TeamMemberRow)
    logOperation("UPDATE_TEAM_MEMBER_SUCCESS", { id, name: updatedMember.name })
    
    revalidatePath("/admin/members")
    
    return { success: true, member: updatedMember }
  } catch (error) {
    logOperation("UPDATE_TEAM_MEMBER_ERROR", { id, error })
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    
    return { success: false, error: "Failed to update team member" }
  }
}

export async function deleteMember(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    logOperation("DELETE_TEAM_MEMBER_START", { id })
    
    // Check if team member exists
    const existingMember = await getMemberById(id)
    if (!existingMember) {
      return { success: false, error: "Team member not found" }
    }
    
    // Delete team member
    await sql`DELETE FROM team_members WHERE id = ${id}`
    
    logOperation("DELETE_TEAM_MEMBER_SUCCESS", { id, name: existingMember.name })
    
    revalidatePath("/admin/members")
    
    return { success: true }
  } catch (error) {
    logOperation("DELETE_TEAM_MEMBER_ERROR", { id, error })
    return { success: false, error: "Failed to delete team member" }
  }
}

// ROLE OPERATIONS (using the existing roles table for permissions)

export async function getRoles(): Promise<Role[]> {
  try {
    logOperation("GET_ROLES")
    
    const result = await sql`
      SELECT 
        r.*,
        0 as member_count
      FROM roles r
      ORDER BY r.created_at ASC
    `
    
    const roles = result.map(transformRoleRow)
    logOperation("GET_ROLES_SUCCESS", { count: roles.length })
    return roles
  } catch (error) {
    logOperation("GET_ROLES_ERROR", error)
    throw new Error("Failed to fetch roles")
  }
}

export async function createRole(formData: FormData): Promise<{ success: boolean; role?: Role; error?: string }> {
  try {
    logOperation("CREATE_ROLE_START")
    
    const rawData = {
      name: formData.get("name")?.toString() || "",
      display_name: formData.get("display_name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      permissions: JSON.parse(formData.get("permissions")?.toString() || "[]"),
      color: formData.get("color")?.toString() || "gray"
    }
    
    const validatedData = RoleSchema.parse(rawData)
    logOperation("CREATE_ROLE_VALIDATED", validatedData)
    
    // Check for existing role name
    const existingRole = await sql`
      SELECT id FROM roles WHERE name = ${validatedData.name}
    `
    
    if (existingRole.length > 0) {
      return { success: false, error: "A role with this name already exists" }
    }
    
    const result = await sql`
      INSERT INTO roles (name, display_name, description, permissions, color)
      VALUES (
        ${validatedData.name},
        ${validatedData.display_name},
        ${validatedData.description || null},
        ${JSON.stringify(validatedData.permissions)},
        ${validatedData.color}
      ) RETURNING *
    `
    
    const newRole = transformRoleRow(result[0])
    logOperation("CREATE_ROLE_SUCCESS", { id: newRole.id, name: newRole.name })
    
    revalidatePath("/admin/members")
    
    return { success: true, role: newRole }
  } catch (error) {
    logOperation("CREATE_ROLE_ERROR", error)
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    
    return { success: false, error: "Failed to create role" }
  }
}

export async function updateRole(id: number, formData: FormData): Promise<{ success: boolean; role?: Role; error?: string }> {
  try {
    logOperation("UPDATE_ROLE_START", { id })
    
    const rawData = {
      name: formData.get("name")?.toString() || "",
      display_name: formData.get("display_name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      permissions: JSON.parse(formData.get("permissions")?.toString() || "[]"),
      color: formData.get("color")?.toString() || "gray"
    }
    
    const validatedData = RoleSchema.partial().parse(rawData)
    logOperation("UPDATE_ROLE_VALIDATED", { id, data: validatedData })
    
    // Check if role exists
    const existingRoles = await sql`SELECT * FROM roles WHERE id = ${id}`
    if (existingRoles.length === 0) {
      return { success: false, error: "Role not found" }
    }
    
    // Check for name conflicts (excluding current role)
    if (validatedData.name) {
      const nameConflict = await sql`
        SELECT id FROM roles WHERE name = ${validatedData.name} AND id != ${id}
      `
      
      if (nameConflict.length > 0) {
        return { success: false, error: "A role with this name already exists" }
      }
    }
    
    // Build dynamic update query
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${updateValues.length + 2}`)
        if (key === 'permissions') {
          updateValues.push(JSON.stringify(value))
        } else {
          updateValues.push(value)
        }
      }
    })
    
    if (updateFields.length === 0) {
      return { success: false, error: "No fields to update" }
    }
    
    const updateQuery = `
      UPDATE roles 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $1 
      RETURNING *
    `
    
    const result = await sql.query(updateQuery, [id, ...updateValues])
    
    const updatedRole = transformRoleRow(result.rows[0])
    logOperation("UPDATE_ROLE_SUCCESS", { id, name: updatedRole.name })
    
    revalidatePath("/admin/members")
    
    return { success: true, role: updatedRole }
  } catch (error) {
    logOperation("UPDATE_ROLE_ERROR", { id, error })
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    
    return { success: false, error: "Failed to update role" }
  }
}

export async function deleteRole(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    logOperation("DELETE_ROLE_START", { id })
    
    // Check if role exists
    const existingRoles = await sql`SELECT * FROM roles WHERE id = ${id}`
    if (existingRoles.length === 0) {
      return { success: false, error: "Role not found" }
    }
    
    await sql`DELETE FROM roles WHERE id = ${id}`
    
    logOperation("DELETE_ROLE_SUCCESS", { id })
    
    revalidatePath("/admin/members")
    
    return { success: true }
  } catch (error) {
    logOperation("DELETE_ROLE_ERROR", { id, error })
    return { success: false, error: "Failed to delete role" }
  }
}
