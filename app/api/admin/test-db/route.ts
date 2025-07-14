import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Testing direct SQL queries...");
    
    // Test basic connection
    const testQuery = await sql`SELECT 1 as test`;
    console.log("✅ Basic connection works");
    
    // Test roles table
    const rolesTest = await sql`SELECT COUNT(*) as count FROM roles`;
    console.log("✅ Roles table accessible, count:", rolesTest[0].count);
    
    // Test the actual query from getRoles
    const rolesQuery = await sql`
      SELECT 
        r.*,
        COUNT(m.id) as member_count
      FROM roles r
      LEFT JOIN members m ON r.id = m.role_id
      GROUP BY r.id
      ORDER BY r.created_at ASC
    `;
    console.log("✅ Complex roles query works, results:", rolesQuery.length);
    
    // Test members table
    const membersTest = await sql`SELECT COUNT(*) as count FROM members`;
    console.log("✅ Members table accessible, count:", membersTest[0].count);
    
    return NextResponse.json({
      success: true,
      tests: {
        basicConnection: true,
        rolesCount: parseInt(rolesTest[0].count),
        rolesQueryResults: rolesQuery.length,
        membersCount: parseInt(membersTest[0].count)
      },
      rolesData: rolesQuery
    });
    
  } catch (error) {
    console.error("❌ SQL Test failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "SQL test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
