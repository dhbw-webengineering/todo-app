
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/sidebar/SidebarMenu";
import { ReactNode } from "react";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="flex min-h-screen bg-gray-50 dark:bg-zinc-900" >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          <SidebarProvider >
            <AppSidebar />  
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
              <SidebarMenu />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
