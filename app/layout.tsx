"use client";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/sidebar/SidebarMenu";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner"
//für swr
import { SWRConfig } from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function RootLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname();
  const showSidebar = !pathname.includes("/auth");

  return (
    <SWRConfig
      value={{
        fetcher,
        // optional: Automatische Revalidierung nur bei Fokus/Reconnect
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        // Requests in kurzen Intervallen deduplizieren
        dedupingInterval: 60000,
      }}>
      <html lang="de" suppressHydrationWarning>
        <body className="flex min-h-screen bg-gray-50 dark:bg-zinc-900" >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
            <SidebarProvider >
              {showSidebar && <AppSidebar />}
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                {showSidebar && <SidebarMenu />}
                {children}
                <Toaster />
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </SWRConfig>

  );
}
