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
import {
    Hospital,
    UserCheck,
    UserCog,
    Stethoscope,
    FileHeart,
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

export interface IconConfig {
    id: string
    icon: React.ElementType
    label: string
    description: string
    color: string
    bgColor: string
    path:string
    notifications?: number
    onClick: () => void
  }
  
  export const createIconConfigs = (handleIconClick: (iconId: string) => void): IconConfig[] => [
    {
      id: "hospital",
      icon: Hospital,
      label: "Hospital",
      description: "Manage hospital details and settings",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      path:"/dashboard/masterdata/hospital",
      onClick: () => handleIconClick("/dashboard/masterdata/hospital"),
    }
    //,
    // {
    //   id: "doctors",
    //   icon: Stethoscope,
    //   label: "Doctors",
    //   description: "Manage doctor profiles and availability",
    //   color: "text-green-600",
    //   bgColor: "bg-green-50 hover:bg-green-100",
    //   path:"/dashboard/masterdata/doctors",
    //   onClick: () => handleIconClick("/dashboard/masterdata/doctors"),
    // },
    // {
    //   id: "staff",
    //   icon: UserCog,
    //   label: "Staff",
    //   description: "Manage medical and administrative staff",
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50 hover:bg-purple-100",
    //   path:"/dashboard/masterdata/staff",
    //   onClick: () => handleIconClick("/dashboard/masterdata/staff"),
    // },
    // {
    //   id: "operations",
    //   icon: FileHeart,
    //   label: "Operations",
    //   description: "Schedule and track procedures",
    //   color: "text-rose-600",
    //   bgColor: "bg-rose-50 hover:bg-rose-100",
    //   path:"/dashboard/masterdata/operations",
    //   onClick: () => handleIconClick("/dashboard/masterdata/operations"),
    // },
    // {
    //   id: "diagnosis",
    //   icon: UserCheck,
    //   label: "Diagnosis",
    //   description: "Record and manage diagnosis records",
    //   color: "text-amber-600",
    //   bgColor: "bg-amber-50 hover:bg-amber-100",
    //   path:"/dashboard/masterdata/diagnosis",
    //   onClick: () => handleIconClick("/dashboard/masterdata/diagnosis"),
    // },
    // {
    //   id: "settings",
    //   icon: Settings,
    //   label: "Settings",
    //   description: "System settings and preferences",
    //   color: "text-gray-600",
    //   bgColor: "bg-gray-50 hover:bg-gray-100",
    //   path:"/dashboard/masterdata/settings",
    //   onClick: () => handleIconClick("/dashboard/masterdata/settings"),
    // },
  ]