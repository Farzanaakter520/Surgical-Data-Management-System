import type React from "react"
import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Mail,
  Calendar,
  ShoppingCart,
  CreditCard,
  Database,
  Shield,
  Bell,
} from "lucide-react"

export interface IconConfig {
  id: string
  icon: React.ElementType
  label: string
  description: string
  color: string
  bgColor: string
  notifications?: number
  onClick: () => void
}

export const createIconConfigs = (handleIconClick: (iconId: string) => void): IconConfig[] => [
  {
    id: "dashboard",
    icon: Home,
    label: "Dashboard",
    description: "Main overview and analytics",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    onClick: () => handleIconClick("dashboard"),
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    description: "Manage user accounts",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    notifications: 3,
    onClick: () => handleIconClick("users"),
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    description: "View reports and insights",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    onClick: () => handleIconClick("analytics"),
  },
  {
    id: "documents",
    icon: FileText,
    label: "Documents",
    description: "File management system",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    onClick: () => handleIconClick("documents"),
  },
  {
    id: "messages",
    icon: Mail,
    label: "Messages",
    description: "Communication center",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
    notifications: 12,
    onClick: () => handleIconClick("messages"),
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Calendar",
    description: "Schedule and events",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
    onClick: () => handleIconClick("calendar"),
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    label: "E-commerce",
    description: "Online store management",
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    notifications: 5,
    onClick: () => handleIconClick("ecommerce"),
  },
  {
    id: "payments",
    icon: CreditCard,
    label: "Payments",
    description: "Financial transactions",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
    onClick: () => handleIconClick("payments"),
  },
  {
    id: "database",
    icon: Database,
    label: "Database",
    description: "Data management",
    color: "text-slate-600",
    bgColor: "bg-slate-50 hover:bg-slate-100",
    onClick: () => handleIconClick("database"),
  },
  {
    id: "security",
    icon: Shield,
    label: "Security",
    description: "System protection",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
    onClick: () => handleIconClick("security"),
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    description: "Alert management",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 hover:bg-cyan-100",
    notifications: 8,
    onClick: () => handleIconClick("notifications"),
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    description: "System configuration",
    color: "text-gray-600",
    bgColor: "bg-gray-50 hover:bg-gray-100",
    onClick: () => handleIconClick("settings"),
  },
]
