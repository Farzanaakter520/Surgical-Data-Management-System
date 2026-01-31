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
  BarChart,
} from "lucide-react"
import {
    Hospital,
    UserCheck,
    UserCog,
    Stethoscope,
    FileHeart,
    } from "lucide-react"

export interface ReportTileMenuConfig {
  id: string
  icon: React.ElementType
  label: string
  description: string
  color: string
  bgColor: string
  notifications?: number
  onClick: () => void
}

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
  
  export const createTileIconConfigs = (handleIconClick: (iconId: string) => void): IconConfig[] => [
    {
  id: "reporting",
  icon: BarChart, // Or replace with another relevant icon
  label: "Reporting & Analytics",
  description: "View insights, trends, and data visualizations",
  color: "text-purple-600",
  bgColor: "bg-purple-50 hover:bg-purple-100",
  onClick: () => handleIconClick("patient-reporting"),
}
    // {
    //   id: "doctors",
    //   icon: Stethoscope,
    //   label: "Doctors",
    //   description: "Manage doctor profiles and availability",
    //   color: "text-green-600",
    //   bgColor: "bg-green-50 hover:bg-green-100",
    //   onClick: () => handleIconClick("doctors"),
    // },
    // {
    //   id: "staff",
    //   icon: UserCog,
    //   label: "Staff",
    //   description: "Manage medical and administrative staff",
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50 hover:bg-purple-100",
    //   onClick: () => handleIconClick("staff"),
    // },
    // {
    //   id: "operations",
    //   icon: FileHeart,
    //   label: "Operations",
    //   description: "Schedule and track procedures",
    //   color: "text-rose-600",
    //   bgColor: "bg-rose-50 hover:bg-rose-100",
    //   onClick: () => handleIconClick("operations"),
    // },
    // {
    //   id: "diagnosis",
    //   icon: UserCheck,
    //   label: "Diagnosis",
    //   description: "Record and manage diagnosis records",
    //   color: "text-amber-600",
    //   bgColor: "bg-amber-50 hover:bg-amber-100",
    //   onClick: () => handleIconClick("diagnosis"),
    // },
    // {
    //   id: "settings",
    //   icon: Settings,
    //   label: "Settings",
    //   description: "System settings and preferences",
    //   color: "text-gray-600",
    //   bgColor: "bg-gray-50 hover:bg-gray-100",
    //   onClick: () => handleIconClick("settings"),
    // },
  ]