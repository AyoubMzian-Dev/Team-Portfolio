import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Inspecting team_members table structure...");
    
    // Check if team_members table exists and get its structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'team_members' 
      ORDER BY ordinal_position
    `;
    
    if (tableInfo.length === 0) {
      return NextResponse.json({
        success: false,
        error: "team_members table not found"
      });
    }
    
    // Get sample data to understand the structure
    const sampleData = await sql`SELECT * FROM team_members LIMIT 3`;
    
    // Get count
    const countResult = await sql`SELECT COUNT(*) as count FROM team_members`;
    const count = parseInt(countResult[0].count);
    
    return NextResponse.json({
      success: true,
      tableStructure: tableInfo,
      sampleData: sampleData,
      totalRecords: count
    });
    
  } catch (error) {
    console.error("❌ Table inspection failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to inspect team_members table",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
