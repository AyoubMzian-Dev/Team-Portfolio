"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Enhanced logging for debugging
const logOperation = (operation: string, data?: any) => {
  console.log(`🔧 [${new Date().toISOString()}] ${operation}`, data ? JSON.stringify(data, null, 2) : '')
}

// Types
export interface Project {
  id: number
  title: string
  description: string
  long_description?: string
  image_url?: string
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  category?: string
  status?: "draft" | "published" | "archived"
  featured: boolean
  created_at: Date
  updated_at: Date
}

// Database row type (raw from database)
interface ProjectRow {
  id: number
  title: string
  description: string
  long_description?: string
  image_url?: string
  demo_url?: string
  github_url?: string
  tech_stack: string | string[] // Can be JSON string or array
  category?: string
  status?: string
  featured: boolean
  created_at: Date
  updated_at: Date
}

// Validation schemas
const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  long_description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  demo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tech_stack: z.array(z.string()).min(1, "At least one technology is required"),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().default(false),
})

const CreateProjectSchema = ProjectSchema
const UpdateProjectSchema = ProjectSchema.partial()

// Type exports for better type safety
export type CreateProjectInput = z.infer<typeof ProjectSchema>
export type UpdateProjectInput = Partial<CreateProjectInput>

// Helper function to transform database row to Project
function transformProjectRow(row: ProjectRow): Project {
  return {
    ...row,
    tech_stack: Array.isArray(row.tech_stack) 
      ? row.tech_stack 
      : (typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack || '[]') : []),
    status: (row.status as "draft" | "published" | "archived") || "draft"
  }
}

// Server Actions
export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY featured DESC, created_at DESC
    `
    
    return projects.map(project => transformProjectRow(project as ProjectRow))
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function getProject(id: number): Promise<Project | null> {
  try {
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${id}
    `
    
    const project = projects[0] as ProjectRow
    if (!project) return null
    
    return transformProjectRow(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    throw new Error("Failed to fetch project")
  }
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  logOperation("CREATE_PROJECT_START", data)
  
  try {
    // Step 1: Validate input data
    const validatedData = CreateProjectSchema.parse(data)
    logOperation("CREATE_PROJECT_VALIDATED", validatedData)

    // Step 2: Prepare tech stack as PostgreSQL array (keep as JavaScript array)
    const techStackArray = validatedData.tech_stack
    logOperation("CREATE_PROJECT_TECH_STACK", techStackArray)

    // Step 3: Execute database insert with proper array handling
    const projects = await sql`
      INSERT INTO projects (
        title, 
        description, 
        long_description,
        image_url, 
        demo_url, 
        github_url, 
        tech_stack, 
        category,
        status,
        featured,
        created_at
      )
      VALUES (
        ${validatedData.title},
        ${validatedData.description},
        ${validatedData.long_description || null},
        ${validatedData.image_url || null},
        ${validatedData.demo_url || null},
        ${validatedData.github_url || null},
        ${techStackArray},
        ${validatedData.category || null},
        ${validatedData.status || 'draft'},
        ${validatedData.featured || false},
        NOW()
      )
      RETURNING *
    `

    const newProject = projects[0] as ProjectRow
    if (!newProject) {
      throw new Error("Failed to create project - no project returned from database")
    }

    logOperation("CREATE_PROJECT_DB_RESULT", newProject)

    // Step 4: Revalidate cache paths
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")
    logOperation("CREATE_PROJECT_CACHE_REVALIDATED")
    
    // Step 5: Transform and return the new project
    const transformedProject = transformProjectRow(newProject)
    logOperation("CREATE_PROJECT_SUCCESS", transformedProject)
    
    return transformedProject
    
  } catch (error) {
    logOperation("CREATE_PROJECT_ERROR", { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      inputData: data 
    })
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ")
      throw new Error(`Validation error: ${validationErrors}`)
    }
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        throw new Error(`Database schema error: ${error.message}`)
      }
      if (error.message.includes('duplicate key')) {
        throw new Error("A project with this title already exists")
      }
      if (error.message.includes('connection')) {
        throw new Error("Database connection failed. Please try again.")
      }
      if (error.message.includes('malformed array')) {
        throw new Error("Invalid tech stack format. Please try again.")
      }
    }
    
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown database error'}`)
  }
}

export async function updateProject(id: number, data: UpdateProjectInput): Promise<Project> {
  logOperation("UPDATE_PROJECT_START", { id, data })
  
  try {
    // Step 1: Validate input
    const validatedData = UpdateProjectSchema.parse(data)
    logOperation("UPDATE_PROJECT_VALIDATED", validatedData)

    // Filter out undefined values
    const cleanData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(cleanData).length === 0) {
      throw new Error("No fields to update")
    }

    logOperation("UPDATE_PROJECT_CLEAN_DATA", cleanData)

    // Prepare values for update with proper data types
    const updates: any = {}
    
    if (cleanData.title !== undefined) updates.title = cleanData.title
    if (cleanData.description !== undefined) updates.description = cleanData.description
    if (cleanData.long_description !== undefined) updates.long_description = cleanData.long_description || null
    if (cleanData.image_url !== undefined) updates.image_url = cleanData.image_url || null
    if (cleanData.demo_url !== undefined) updates.demo_url = cleanData.demo_url || null
    if (cleanData.github_url !== undefined) updates.github_url = cleanData.github_url || null
    if (cleanData.tech_stack !== undefined) updates.tech_stack = cleanData.tech_stack // Keep as array
    if (cleanData.category !== undefined) updates.category = cleanData.category || null
    if (cleanData.status !== undefined) updates.status = cleanData.status
    if (cleanData.featured !== undefined) updates.featured = cleanData.featured

    logOperation("UPDATE_PROJECT_UPDATES", updates)

    // Build SQL query with conditional updates
    const projects = await sql`
      UPDATE projects SET
        title = COALESCE(${updates.title || null}, title),
        description = COALESCE(${updates.description || null}, description),
        long_description = COALESCE(${updates.long_description}, long_description),
        image_url = COALESCE(${updates.image_url}, image_url),
        demo_url = COALESCE(${updates.demo_url}, demo_url),
        github_url = COALESCE(${updates.github_url}, github_url),
        tech_stack = COALESCE(${updates.tech_stack || null}, tech_stack),
        category = COALESCE(${updates.category}, category),
        status = COALESCE(${updates.status || null}, status),
        featured = COALESCE(${updates.featured !== undefined ? updates.featured : null}, featured),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    const updatedProject = projects[0] as ProjectRow
    if (!updatedProject) {
      throw new Error("Project not found")
    }

    logOperation("UPDATE_PROJECT_DB_RESULT", updatedProject)

    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")
    logOperation("UPDATE_PROJECT_CACHE_REVALIDATED")

    const transformedProject = transformProjectRow(updatedProject)
    logOperation("UPDATE_PROJECT_SUCCESS", transformedProject)

    return transformedProject
  } catch (error) {
    logOperation("UPDATE_PROJECT_ERROR", { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      id,
      data 
    })
    
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(", ")}`)
    }
    throw new Error(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown database error'}`)
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    const result = await sql`
      DELETE FROM projects 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      throw new Error("Project not found")
    }

    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")
  } catch (error) {
    console.error("Error deleting project:", error)
    throw new Error("Failed to delete project")
  }
}

export async function toggleProjectFeatured(id: number): Promise<Project> {
  try {
    const projects = await sql`
      UPDATE projects 
      SET featured = NOT featured, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    const updatedProject = projects[0] as ProjectRow
    if (!updatedProject) {
      throw new Error("Project not found")
    }

    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return transformProjectRow(updatedProject)
  } catch (error) {
    console.error("Error toggling project featured status:", error)
    throw new Error("Failed to toggle featured status")
  }
}
