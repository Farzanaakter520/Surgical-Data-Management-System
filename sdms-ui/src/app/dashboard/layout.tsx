"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { menuConfig } from "@/app/dashboard/menu-config";
import { companySettings } from "@/lib/config/settings";
import Logo from "@/lib/config/logo";
import { ThemeToggle } from "@/components/utility-components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [userRole] = useState<string>("doctor");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const SIDEBAR_WIDTH = 220; // slightly wider for readability

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredMenuItems = menuConfig.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const handleMenuClick = (href: string) => {
    if (href === "/") handleLogout();
    else if (href !== "#") {
      router.push(href);
      if (isMobile) setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-950">
      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white shadow-md transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900
          ${
            isMobile
              ? isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }`}
        style={{ width: `${SIDEBAR_WIDTH}px` }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold truncate">
              {companySettings.shortName}
            </span>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Sidebar"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) =>
              item.isHeader ? (
                <li
                  key={item.title}
                  className="px-2 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  {item.title}
                </li>
              ) : (
                <li key={item.href}>
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-gray-100 font-medium dark:bg-gray-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span
                      className={`truncate ${
                        item.title === "Logout"
                          ? "text-red-500 hover:text-red-600"
                          : ""
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-gray-200 p-3 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center gap-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs">
                  <span className="max-w-[140px] truncate font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-muted-foreground capitalize">
                    {userRole}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-700 dark:text-red-500 dark:focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className="flex flex-1 flex-col overflow-x-hidden transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : `${SIDEBAR_WIDTH}px` }}
      >
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900 lg:px-6">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open Sidebar"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="container mx-auto max-w-screen-xl px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
