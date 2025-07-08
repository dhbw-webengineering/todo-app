"use client";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/sidebar/SidebarMenu";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner"
import { ErrorProvider } from '../context/ErrorContext';
import ErrorBanner from "@/components/ErrorBanner";


export default function RootLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname();
  const showSidebar = !pathname.includes("/auth");

  return (
    <html lang="de" suppressHydrationWarning>
      <body className="flex min-h-screen bg-gray-50 dark:bg-zinc-900" >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          <ErrorProvider>
            <SidebarProvider >
              {showSidebar && <AppSidebar />}
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                {showSidebar && <SidebarMenu />}
                {children}
                <Toaster />
                <ErrorBanner />
              </main>
            </SidebarProvider>
          </ErrorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
