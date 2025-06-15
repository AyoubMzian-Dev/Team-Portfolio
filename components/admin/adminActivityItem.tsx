

import { theme } from "@/lib/theme-config"

interface AdminActivityItemProps {
  action: string
  item: string
  time: string
}

export default function AdminActivityItem({ action, item, time }: AdminActivityItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: theme.colors.accent }}
      />
      <div className="flex-1">
        <p style={{ color: theme.colors.text }} className="font-medium">
          {action}
        </p>
        <p style={{ color: theme.colors.textMuted }} className="text-sm">
          {item} • {time}
        </p>
      </div>
    </div>
  )
}