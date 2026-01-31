"use client"

import type React from "react"
import { SettingsProvider } from '@/contexts/settingsContext';

import { LoadingProvider } from "@/contexts/loading-context"
// import { QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
// import { queryClient } from "@/lib/api-client"
import { ThemeProvider } from "@/contexts/theme-provider"

import { AuthProvider } from "@/contexts/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
   
     <SettingsProvider>
    
     <LoadingProvider>
     <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
           {children}
           {/* <ReactQueryDevtools initialIsOpen={false} /> */}
         </ThemeProvider>
         </AuthProvider>
         </LoadingProvider>
       
       </SettingsProvider>
   )
}
