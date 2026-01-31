
import type { Metadata } from 'next'
import './globals.css';
import { Providers } from "./providers"
import { GlobalLoader } from "@/components/utility-components/global-loader"
import { ThemeProvider } from '@/contexts/theme-provider'
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: 'SDMS App',
  description: 'Created with SDMS',
  generator: 'SDMS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
     
      <body>
        <Providers>
         <GlobalLoader position="top" color="default" size="sm" />
         {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          
              {children}
          {/* </ThemeProvider> */}
          </Providers>
        <Toaster 
          richColors 
          position="top-center" 
          closeButton 
          theme="light" // light/dark/system
        />
      </body>
    </html>
  )
}
