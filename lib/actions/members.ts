"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Enhanced logging for debugging
const logOperation = (operation: string, data?: any) => {
  console.log(`👥 [${new Date().toISOString()}] ${operation}`, data ? JSON.stringify(data, null, 2) : '')
}

// Types
export interface Member {
  id: number
  name: string
  email: string
  role_id?: number
  role?: Role
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
    email?: string
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

export interface MemberProject {
  id: number
  member_id: number
  project_id: number
  role?: string
  assigned_at: Date
  member?: Member
  project?: any // Project type from projects.ts
}

// Database row types
interface MemberRow {
  id: number
  name: string
  email: string
  role_id?: number
  status: string
  avatar_url?: string
  title?: string
  department?: string
  bio?: string
  skills: string | string[]
  links: string | object
  join_date: Date
  created_at: Date
  updated_at: Date
  role_name?: string
  role_display_name?: string
  role_color?: string
  project_count?: number
}

interface RoleRow {
  id: number
  name: string
  display_name: string
  description?: string
  permissions: string | string[]
  color: string
  created_at: Date
  updated_at: Date
  member_count?: number
}

// Validation schemas
const MemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  role_id: z.number().int().positive("Invalid role").optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  avatar_url: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  title: z.string().max(100, "Title too long").optional(),
  department: z.string().max(100, "Department too long").optional(),
  bio: z.string().max(1000, "Bio too long").optional(),
  skills: z.array(z.string().max(50, "Skill name too long")).default([]),
  links: z.object({
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  }).default({}),
  join_date: z.string().optional() // ISO date string
})

const RoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50, "Role name too long").regex(/^[A-Z_]+$/, "Role name must be uppercase with underscores"),
  display_name: z.string().min(1, "Display name is required").max(100, "Display name too long"),
  description: z.string().max(500, "Description too long").optional(),
  permissions: z.array(z.string()).default([]),
  color: z.string().regex(/^(red|blue|green|yellow|purple|pink|gray|orange|teal|cyan)$/, "Invalid color").default("gray")
})

// Helper functions
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

function transformMemberRow(row: MemberRow): Member {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role_id: row.role_id,
    role: row.role_name ? {
      id: row.role_id!,
      name: row.role_name,
      display_name: row.role_display_name!,
      description: "",
      permissions: [],
      color: row.role_color!,
      created_at: new Date(),
      updated_at: new Date()
    } : undefined,
    status: row.status as "active" | "inactive" | "pending",
    avatar_url: row.avatar_url,
    title: row.title,
    department: row.department,
    bio: row.bio,
    skills: parseJsonField(row.skills, []),
    links: parseJsonField(row.links, {}),
    join_date: row.join_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
    project_count: row.project_count
  }
}

function transformRoleRow(row: RoleRow): Role {
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

// MEMBER OPERATIONS

export async function getMembers(): Promise<Member[]> {
  try {
    logOperation("GET_MEMBERS")
    
    const result = await sql`
      SELECT 
        m.*,
        r.name as role_name,
        r.display_name as role_display_name,
        r.color as role_color,
        COUNT(mp.project_id) as project_count
      FROM members m
      LEFT JOIN roles r ON m.role_id = r.id
      LEFT JOIN member_projects mp ON m.id = mp.member_id
      GROUP BY m.id, r.id, r.name, r.display_name, r.color
      ORDER BY m.created_at DESC
    `
    
    const members = result.map(transformMemberRow)
    logOperation("GET_MEMBERS_SUCCESS", { count: members.length })
    return members
  } catch (error) {
    logOperation("GET_MEMBERS_ERROR", error)
    throw new Error("Failed to fetch members")
  }
}

export async function getMemberById(id: number): Promise<Member | null> {
  try {
    logOperation("GET_MEMBER_BY_ID", { id })
    
    const result = await sql`
      SELECT 
        m.*,
        r.name as role_name,
        r.display_name as role_display_name,
        r.color as role_color,
        COUNT(mp.project_id) as project_count
      FROM members m
      LEFT JOIN roles r ON m.role_id = r.id
      LEFT JOIN member_projects mp ON m.id = mp.member_id
      WHERE m.id = ${id}
      GROUP BY m.id, r.id, r.name, r.display_name, r.color
    `
    
    if (result.length === 0) {
      logOperation("GET_MEMBER_BY_ID_NOT_FOUND", { id })
      return null
    }
    
    const member = transformMemberRow(result[0] as MemberRow)
    logOperation("GET_MEMBER_BY_ID_SUCCESS", { id, name: member.name })
    return member
  } catch (error) {
    logOperation("GET_MEMBER_BY_ID_ERROR", { id, error })
    throw new Error("Failed to fetch member")
  }
}

export async function createMember(formData: FormData): Promise<{ success: boolean; member?: Member; error?: string }> {
  try {
    logOperation("CREATE_MEMBER_START")
    
    // Extract and validate data
    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      role_id: formData.get("role_id") ? parseInt(formData.get("role_id")!.toString()) : undefined,
      status: formData.get("status")?.toString() || "active",
      avatar_url: formData.get("avatar_url")?.toString() || "",
      title: formData.get("title")?.toString() || "",
      department: formData.get("department")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
      skills: JSON.parse(formData.get("skills")?.toString() || "[]"),
      links: JSON.parse(formData.get("links")?.toString() || "{}"),
      join_date: formData.get("join_date")?.toString()
    }
    
    logOperation("CREATE_MEMBER_RAW_DATA", rawData)
    
    const validatedData = MemberSchema.parse(rawData)
    logOperation("CREATE_MEMBER_VALIDATED", validatedData)
    
    // Check for existing email
    const existingMember = await sql`
      SELECT id FROM members WHERE email = ${validatedData.email}
    `
    
    if (existingMember.length > 0) {
      return { success: false, error: "A member with this email already exists" }
    }
    
    // Insert member
    const result = await sql`
      INSERT INTO members (
        name, email, role_id, status, avatar_url, title, department, bio, skills, links, join_date
      ) VALUES (
        ${validatedData.name},
        ${validatedData.email},
        ${validatedData.role_id || null},
        ${validatedData.status},
        ${validatedData.avatar_url || null},
        ${validatedData.title || null},
        ${validatedData.department || null},
        ${validatedData.bio || null},
        ${JSON.stringify(validatedData.skills)},
        ${JSON.stringify(validatedData.links)},
        ${validatedData.join_date ? new Date(validatedData.join_date) : new Date()}
      ) RETURNING *
    `
    
    const newMember = transformMemberRow(result[0] as MemberRow)
    logOperation("CREATE_MEMBER_SUCCESS", { id: newMember.id, name: newMember.name })
    
    revalidatePath("/admin/members")
    
    return { success: true, member: newMember }
  } catch (error) {
    logOperation("CREATE_MEMBER_ERROR", error)
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    
    return { success: false, error: "Failed to create member" }
  }
}

export async function updateMember(id: number, formData: FormData): Promise<{ success: boolean; member?: Member; error?: string }> {
  try {
    logOperation("UPDATE_MEMBER_START", { id })
    
    // Extract and validate data
    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      role_id: formData.get("role_id") ? parseInt(formData.get("role_id")!.toString()) : undefined,
      status: formData.get("status")?.toString() || "active",
      avatar_url: formData.get("avatar_url")?.toString() || "",
      title: formData.get("title")?.toString() || "",
      department: formData.get("department")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
      skills: JSON.parse(formData.get("skills")?.toString() || "[]"),
      links: JSON.parse(formData.get("links")?.toString() || "{}"),
      join_date: formData.get("join_date")?.toString()
    }
    
    const validatedData = MemberSchema.partial().parse(rawData)
    logOperation("UPDATE_MEMBER_VALIDATED", { id, data: validatedData })
    
    // Check if member exists
    const existingMember = await getMemberById(id)
    if (!existingMember) {
      return { success: false, error: "Member not found" }
    }
    
    // Check for email conflicts (excluding current member)
    if (validatedData.email) {
      const emailConflict = await sql`
        SELECT id FROM members WHERE email = ${validatedData.email} AND id != ${id}
      `
      
      if (emailConflict.length > 0) {
        return { success: false, error: "A member with this email already exists" }
      }
    }
    
    // Build dynamic update query
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${updateValues.length + 2}`) // +2 because id is $1
        if (key === 'skills' || key === 'links') {
          updateValues.push(JSON.stringify(value))
        } else if (key === 'join_date' && value) {
          updateValues.push(new Date(value as string))
        } else {
          updateValues.push(value)
        }
      }
    })
    
    if (updateFields.length === 0) {
      return { success: false, error: "No fields to update" }
    }
    
    const updateQuery = `
      UPDATE members 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $1 
      RETURNING *
    `
    
    const result = await sql.query(updateQuery, [id, ...updateValues])
    
    const updatedMember = transformMemberRow(result.rows[0] as MemberRow)
    logOperation("UPDATE_MEMBER_SUCCESS", { id, name: updatedMember.name })
    
    revalidatePath("/admin/members")
    
    return { success: true, member: updatedMember }
  } catch (error) {
    logOperation("UPDATE_MEMBER_ERROR", { id, error })
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    
    return { success: false, error: "Failed to update member" }
  }
}

export async function deleteMember(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    logOperation("DELETE_MEMBER_START", { id })
    
    // Check if member exists
    const existingMember = await getMemberById(id)
    if (!existingMember) {
      return { success: false, error: "Member not found" }
    }
    
    // Delete member (cascade will handle member_projects)
    await sql`DELETE FROM members WHERE id = ${id}`
    
    logOperation("DELETE_MEMBER_SUCCESS", { id, name: existingMember.name })
    
    revalidatePath("/admin/members")
    
    return { success: true }
  } catch (error) {
    logOperation("DELETE_MEMBER_ERROR", { id, error })
    return { success: false, error: "Failed to delete member" }
  }
}

// ROLE OPERATIONS

export async function getRoles(): Promise<Role[]> {
  try {
    logOperation("GET_ROLES")
    
    const result = await sql`
      SELECT 
        r.*,
        COUNT(m.id) as member_count
      FROM roles r
      LEFT JOIN members m ON r.id = m.role_id
      GROUP BY r.id
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
    
    const newRole = transformRoleRow(result[0] as RoleRow)
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
    
    const updatedRole = transformRoleRow(result.rows[0] as RoleRow)
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
    
    // Check if role is in use
    const membersWithRole = await sql`SELECT COUNT(*) as count FROM members WHERE role_id = ${id}`
    if (parseInt(membersWithRole[0].count) > 0) {
      return { success: false, error: "Cannot delete role that is assigned to members" }
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

// PROJECT ASSIGNMENT OPERATIONS

export async function assignMemberToProject(
  memberId: number, 
  projectId: number, 
  role?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    logOperation("ASSIGN_MEMBER_TO_PROJECT", { memberId, projectId, role })
    
    // Check if assignment already exists
    const existing = await sql`
      SELECT id FROM member_projects 
      WHERE member_id = ${memberId} AND project_id = ${projectId}
    `
    
    if (existing.length > 0) {
      return { success: false, error: "Member is already assigned to this project" }
    }
    
    await sql`
      INSERT INTO member_projects (member_id, project_id, role)
      VALUES (${memberId}, ${projectId}, ${role || null})
    `
    
    logOperation("ASSIGN_MEMBER_TO_PROJECT_SUCCESS", { memberId, projectId })
    
    revalidatePath("/admin/members")
    revalidatePath("/admin/projects")
    
    return { success: true }
  } catch (error) {
    logOperation("ASSIGN_MEMBER_TO_PROJECT_ERROR", { memberId, projectId, error })
    return { success: false, error: "Failed to assign member to project" }
  }
}

export async function removeMemberFromProject(
  memberId: number, 
  projectId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    logOperation("REMOVE_MEMBER_FROM_PROJECT", { memberId, projectId })
    
    const result = await sql`
      DELETE FROM member_projects 
      WHERE member_id = ${memberId} AND project_id = ${projectId}
    `
    
    if (result.count === 0) {
      return { success: false, error: "Assignment not found" }
    }
    
    logOperation("REMOVE_MEMBER_FROM_PROJECT_SUCCESS", { memberId, projectId })
    
    revalidatePath("/admin/members")
    revalidatePath("/admin/projects")
    
    return { success: true }
  } catch (error) {
    logOperation("REMOVE_MEMBER_FROM_PROJECT_ERROR", { memberId, projectId, error })
    return { success: false, error: "Failed to remove member from project" }
  }
}

export async function getMemberProjects(memberId: number): Promise<MemberProject[]> {
  try {
    const result = await sql`
      SELECT mp.*, p.title as project_title, p.status as project_status
      FROM member_projects mp
      JOIN projects p ON mp.project_id = p.id
      WHERE mp.member_id = ${memberId}
      ORDER BY mp.assigned_at DESC
    `
    
    return result.map(row => ({
      id: row.id,
      member_id: row.member_id,
      project_id: row.project_id,
      role: row.role,
      assigned_at: row.assigned_at,
      project: {
        id: row.project_id,
        title: row.project_title,
        status: row.project_status
      }
    }))
  } catch (error) {
    logOperation("GET_MEMBER_PROJECTS_ERROR", { memberId, error })
    throw new Error("Failed to fetch member projects")
  }
}
