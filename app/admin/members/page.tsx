"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCog,
  Github,
  Linkedin,
  Mail,
  Globe,
  Settings,
  Activity,
  Plus,
  Download,
  Upload,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { MemberForm } from "@/components/admin/team-member-form"
import { 
  getMembers, 
  getRoles, 
  deleteMember, 
  type Member, 
  type Role 
} from "@/lib/actions/team-members"



export default function MembersManagementPage() {
  // State management
  const [members, setMembers] = useState<Member[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("members")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [membersData, rolesData] = await Promise.all([
        getMembers(),
        getRoles()
      ])
      
      setMembers(membersData)
      setRoles(rolesData)
    } catch (err) {
      console.error("Failed to load data:", err)
      setError("Failed to load data. Please refresh the page.")
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    try {
      setLoading(true)
      setError(null)
      toast.info("Setting up database...")
      
      const response = await fetch('/api/admin/setup-database', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success("Database setup completed successfully!")
        // Try to load data again
        await loadData()
      } else {
        setError(result.details || "Database setup failed")
        toast.error("Database setup failed")
      }
    } catch (err) {
      console.error("Database setup error:", err)
      setError("Failed to setup database")
      toast.error("Failed to setup database")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const membersData = await getMembers()
        const rolesData = await getRoles()

        setMembers(membersData)
        setRoles(rolesData)
      } catch (error) {
        toast.error("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtered members based on search and filters
  const filteredMembers = useMemo(() => {
    if (!members) return []
    
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (member.title && member.title.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesRole = !filterRole || (member.role && member.role.name === filterRole)
      const matchesStatus = !filterStatus || member.status === filterStatus
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [searchTerm, filterRole, filterStatus, members])

  // Stats calculations
  const stats = useMemo(() => {
    if (!members || !roles) return { total: 0, active: 0, inactive: 0, admins: 0, totalRoles: 0 }
    
    return {
      total: members.length,
      active: members.filter(m => m.status === "active").length,
      inactive: members.filter(m => m.status === "inactive").length,
      admins: members.filter(m => m.role?.name === "ADMIN").length,
      totalRoles: roles.length
    }
  }, [members, roles])

  const handleAddMember = useCallback(() => {
    setShowAddMemberDialog(true)
  }, [])

  const handleEditMember = useCallback((member: any) => {
    setSelectedMember(member)
    setShowAddMemberDialog(true)
  }, [])

  const handleDeleteMember = useCallback(async (memberId: number) => {
    setLoading(true)
    try {
      await deleteMember(memberId)
      setMembers(prev => prev.filter(m => m.id !== memberId))
      toast.success("Member deleted successfully")
    } catch (error) {
      toast.error("Failed to delete member")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddRole = useCallback(() => {
    setShowAddRoleDialog(true)
  }, [])

  const handleEditRole = useCallback((role: any) => {
    setSelectedRole(role)
    setShowAddRoleDialog(true)
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "red"
      case "MEMBER": return "blue"
      case "VIEWER": return "gray"
      default: return "gray"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : "yellow"
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gradient">Team Management</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage team members, roles, and permissions with comprehensive admin controls
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-full"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <EnhancedButton variant="outline" size="lg" icon={<Download />}>
            Export Data
          </EnhancedButton>
          <EnhancedButton variant="outline" size="lg" icon={<Upload />}>
            Import Data
          </EnhancedButton>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Card className="form-glass-card">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Loading team data...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-16">
          <Card className="form-glass-card border-red-200">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Connection Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <p className="text-sm text-muted-foreground mb-6">
                This might be because the database tables haven't been created yet or the connection is not configured.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={setupDatabase} variant="default">
                  Setup Database
                </Button>
                <Button onClick={loadData} variant="outline">
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="form-glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-accent">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </CardContent>
        </Card>
        <Card className="form-glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card className="form-glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.inactive}</div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </CardContent>
        </Card>
        <Card className="form-glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.admins}</div>
            <div className="text-sm text-muted-foreground">Administrators</div>
          </CardContent>
        </Card>
        <Card className="form-glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.totalRoles}</div>
            <div className="text-sm text-muted-foreground">Total Roles</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <Card className="form-glass-card glow-effect">
        <CardHeader className="py-8 ">
          <TabsList className="h-3/4 grid w-full grid-cols-4 gap-2 bg-black rounded-lg  ">
            <TabsTrigger 
              value="members" 
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow data-[state=active]:glow-effect"
            >
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="roles" 
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow data-[state=active]:glow-effect"
            >
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow data-[state=active]:glow-effect"
            >
              <Activity className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow data-[state=active]:glow-effect"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="space-y-6">
          <TabsContent value="members" className="space-y-6 mt-0">
            {/* Members Tab Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-glass"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 rounded-md bg-background border border-border text-sm"
                  >
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-md bg-background border border-border text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <EnhancedButton 
                variant="gradient" 
                size="lg" 
                icon={<UserPlus />}
                onClick={handleAddMember}
                glow="medium"
              >
                Add Member
              </EnhancedButton>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="form-glass-card hover:glow-effect transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    {/* Member Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar_url || "/placeholder-user.jpg"}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.title}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Member Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Department:</span>
                        <span>{member.department || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Projects:</span>
                        <span>{member.project_count || 0}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleColor(member.role?.name || "VIEWER") as any}>
                        {member.role?.display_name || "No Role"}
                      </Badge>
                      <Badge variant={getStatusColor(member.status) as any}>
                        {member.status}
                      </Badge>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {member.links.github && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={member.links.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.links.linkedin && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.links.portfolio && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={member.links.portfolio} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${member.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-16">
                <div className="p-8 form-glass-card bg-card/20 rounded-xl border-2 border-dashed border-border/50 max-w-md mx-auto">
                  <Users className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-3 text-gradient">No Members Found</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {searchTerm || filterRole || filterStatus 
                      ? "No members match your current filters. Try adjusting your search criteria."
                      : "Start building your team by adding your first member."
                    }
                  </p>
                  <EnhancedButton 
                    variant="gradient"
                    size="lg"
                    icon={<UserPlus />}
                    onClick={handleAddMember}
                    glow="medium"
                  >
                    Add First Member
                  </EnhancedButton>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="roles" className="space-y-6 mt-0">
            {/* Roles Tab Controls */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Role Management</h3>
              <EnhancedButton 
                variant="gradient" 
                size="default" 
                icon={<Plus />}
                onClick={handleAddRole}
              >
                Add Role
              </EnhancedButton>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="form-glass-card hover:glow-effect transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{role.display_name}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <Badge variant={role.color as any}>{role.name}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members:</span>
                      <span className="font-medium">{role.member_count || 0}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={(role.member_count || 0) > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 mt-0">
            <div className="text-center py-16">
              <Activity className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-3">Project Assignments</h3>
              <p className="text-muted-foreground">
                Coming soon - Manage member project assignments and workload distribution.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-0">
            <div className="text-center py-16">
              <Settings className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-3">Team Settings</h3>
              <p className="text-muted-foreground">
                Coming soon - Configure team policies, notifications, and preferences.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
                </Tabs>


      {/* Add/Edit Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="form-glass-card max-w-2xl">
          <div className="text-center py-8">
            <MemberForm 
              member={selectedMember || undefined}
              roles={roles}
              onClose={() => {
                setShowAddMemberDialog(false)
                setSelectedMember(null)
              }}
              onSuccess={() => {
                toast.success(`Member ${selectedMember ? "updated" : "added"} successfully`)
                setShowAddMemberDialog(false)
                setSelectedMember(null)
                loadData() // Refresh data
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Role Dialog */}
      <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
        <DialogContent className="form-glass-card max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? "Edit Role" : "Add New Role"}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Role form will be implemented here
            </p>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
}
