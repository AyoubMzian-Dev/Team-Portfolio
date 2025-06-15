

import { theme } from "@/lib/theme-config"
import AdminActivityItem from "./adminActivityItem"

const recentActivities = [
  {
    action: "New project added",
    item: "E-commerce Platform",
    time: "2 hours ago",
  },
  {
    action: "Team member updated",
    item: "John Doe profile",
    time: "1 day ago",
  },
  {
    action: "New inquiry received",
    item: "Mobile App Development",
    time: "2 days ago",
  },
]

export default function AdminRecentActivity() {
  return (
    <div className="glass-card p-6">
      <h3 
        className="text-xl font-semibold mb-4"
        style={{ color: theme.colors.text }}
      >
        Recent Activity
      </h3>
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <AdminActivityItem
            key={index}
            action={activity.action}
            item={activity.item}
            time={activity.time}
          />
        ))}
      </div>
    </div>
  )
}