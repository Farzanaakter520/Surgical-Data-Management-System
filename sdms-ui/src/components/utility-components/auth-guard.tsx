"use client";

import type React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait until auth state is resolved

    if (!user && pathname !== "/login") {
      // Not logged in → redirect to login
      router.push("/login");
    } else if (user && pathname === "/login") {
      // Logged in → redirect to dashboard
      router.push("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  // Loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If no user (and not currently being redirected), show fallback
  if (!user && pathname !== "/login") {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>
                You need to be logged in to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/login")} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  // Render protected content
  return <>{children}</>;
}
