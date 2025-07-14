# Team Members Admin - Quick Reference

## 🚀 Quick Start

### Access Admin Interface
```
http://localhost:3001/admin/members
```

### Key Files
```
📁 lib/actions/team-members.ts     # Server actions (CRUD operations)
📁 app/admin/members/page.tsx      # Main admin interface
📁 components/admin/team-member-form.tsx  # Add/Edit form
📁 Docs/TEAM_MEMBERS_ADMIN_INTEGRATION.md # Full documentation
```

---

## 📊 Database Schema

### Your Existing Table: `team_members`
```sql
id (serial)           # Primary key
name (varchar)        # Member name *required
role (varchar)        # Job role/title *required  
bio (text)           # Biography
image_url (varchar)   # Profile image URL
github_url (varchar)  # GitHub profile
linkedin_url (varchar) # LinkedIn profile
twitter_url (varchar) # Twitter profile
skills (text[])      # Skills array
created_at (timestamp) # Creation date
```

---

## 🔧 API Functions

### Import Server Actions
```typescript
import { 
  getMembers, 
  getMemberById,
  createMember, 
  updateMember, 
  deleteMember,
  getRoles 
} from "@/lib/actions/team-members"
```

### Core Operations
```typescript
// Get all members
const members = await getMembers()

// Get single member
const member = await getMemberById(1)

// Create new member
const formData = new FormData()
formData.append("name", "John Doe")
formData.append("role", "Full-Stack Developer")
formData.append("skills", JSON.stringify(["React", "Node.js"]))
const result = await createMember(formData)

// Update member
const result = await updateMember(1, formData)

// Delete member
const result = await deleteMember(1)
```

---

## 🎨 UI Components

### Member Form Usage
```tsx
import { MemberForm } from "@/components/admin/team-member-form"

<MemberForm 
  member={selectedMember}  // For editing (optional)
  roles={roles}           // Available roles
  onSuccess={() => {}}    // Success callback
  onClose={() => {}}      // Close callback
/>
```

### Form Data Structure
```typescript
{
  name: string,           // Required
  role: string,           // Required - from dropdown
  bio?: string,           // Optional
  image_url?: string,     // Optional - profile image URL
  github_url?: string,    // Optional - GitHub profile
  linkedin_url?: string,  // Optional - LinkedIn profile  
  twitter_url?: string,   // Optional - Twitter profile
  skills: string[]        // Array of skills
}
```

---

## 🎯 Available Roles

```typescript
const ROLE_OPTIONS = [
  "Full-Stack Developer",
  "Frontend Developer", 
  "Backend Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Project Manager",
  "Data Scientist",
  "Mobile Developer",
  "QA Engineer",
  "Product Manager"
]
```

---

## 🔍 Search & Filter

### Filter Members
```typescript
// By role
const frontendDevs = members.filter(m => m.role?.name === "FRONTEND")

// By status  
const activeMembers = members.filter(m => m.status === "active")

// By skills
const reactDevs = members.filter(m => m.skills.includes("React"))
```

### Search Implementation
```typescript
const searchResults = members.filter(member => 
  member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.title?.toLowerCase().includes(searchTerm.toLowerCase())
)
```

---

## 🛠️ Development Commands

### Test Database Connection
```bash
curl http://localhost:3001/api/admin/test-db
```

### Check Database Status
```bash
curl http://localhost:3001/api/admin/setup-database
```

### Inspect Table Structure
```bash
curl http://localhost:3001/api/admin/inspect-table
```

---

## 🐛 Common Issues & Solutions

### Issue: Table not found
```
Error: relation "team_members" does not exist
```
**Solution**: Check table name spelling, verify database connection

### Issue: Validation error
```
Error: Name is required
```
**Solution**: Ensure required fields (name, role) are provided

### Issue: Database connection
```
Error: No database connection string
```
**Solution**: Set `DATABASE_URL` environment variable

---

## 📝 Code Examples

### Add Member Programmatically
```typescript
const addMember = async () => {
  const formData = new FormData()
  formData.append("name", "Jane Smith")
  formData.append("role", "Frontend Developer")
  formData.append("bio", "Expert in React and TypeScript")
  formData.append("github_url", "https://github.com/janesmith")
  formData.append("skills", JSON.stringify(["React", "TypeScript", "CSS"]))
  
  const result = await createMember(formData)
  if (result.success) {
    console.log("Member added:", result.member)
  }
}
```

### Update Member Skills
```typescript
const updateSkills = async (memberId: number, newSkills: string[]) => {
  const member = await getMemberById(memberId)
  if (member) {
    const formData = new FormData()
    formData.append("skills", JSON.stringify(newSkills))
    await updateMember(memberId, formData)
  }
}
```

### Bulk Operations
```typescript
// Get all members with specific skill
const getReactDevelopers = async () => {
  const members = await getMembers()
  return members.filter(m => m.skills.includes("React"))
}

// Count members by role
const getMemberCounts = async () => {
  const members = await getMembers()
  const counts = {}
  members.forEach(m => {
    const role = m.role?.display_name || "Unknown"
    counts[role] = (counts[role] || 0) + 1
  })
  return counts
}
```

---

## 🎉 Success Indicators

### ✅ System Working Correctly
- Admin page loads at `/admin/members`
- Shows existing 8 team members
- Add/Edit forms work without errors
- Search and filtering functional
- Skills management working
- Database operations successful

### 🚨 Issues to Check
- Empty member list (database connection issue)
- Form validation errors (missing required fields)
- 500 errors (server action issues)
- Styling issues (component import problems)

---

## 📞 Quick Support

### Debug Information
```typescript
// Check if data loads
console.log("Members:", await getMembers())

// Check member structure
const member = await getMemberById(1)
console.log("Member structure:", member)

// Validate form data
const formData = new FormData()
// ... add data
console.log("Form data:", Object.fromEntries(formData))
```

### Log Monitoring
Server actions log with prefix `👥` - check console for:
- `GET_TEAM_MEMBERS_SUCCESS`
- `CREATE_TEAM_MEMBER_SUCCESS` 
- `UPDATE_TEAM_MEMBER_SUCCESS`
- Any `_ERROR` logs for issues
