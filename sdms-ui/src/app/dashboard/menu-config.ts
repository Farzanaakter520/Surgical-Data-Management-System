import {
  FileText,
  Home,
  ClipboardList,
  Stethoscope,
  Calendar,
  User,
  LogOut,
  Users,
  CalendarClock,
  ClipboardCheck,
  BarChart3,
  Settings,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isHeader?: boolean;
  className?: string;
  children?: MenuItem[];
  roles?: string[]; // For role-based access control
}

export const menuConfig: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["patient", "doctor", "admin"],
  },

  // {
  //   title: "Patients",
  //   href: "/dashboard/patients",
  //   icon: Users,
  //   roles: ["doctor", "admin"],
  // },
  {
    title: "Manage Patients",
    href: "/dashboard/manage-patient",
    icon: Users,
    roles: ["doctor", "admin"],
  },

  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    roles: ["doctor", "admin"],
  },
  {
    title: "Manage Data",
    href: "/dashboard/masterdata",
    icon: Settings,
    roles: ["doctor", "admin"],
  },

  {
    title: "Logout",
    href: "/",
    icon: LogOut,
    className: "text-red-500 hover:text-red-600 mt-4",
    roles: ["patient", "doctor", "admin"],
  },
];
