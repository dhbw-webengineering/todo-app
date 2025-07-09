"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePathname } from "next/navigation";


import {
  Home,
  Search,
  SquareCheckBig,
  User2,
  ChevronUp,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";



import { TaskDialog } from "@/src/components/task/TaskDialog";
import ThemeChanger from "@/src/components/themeChanger";
import { CategoryManagement } from "./CategoryManagement";

import { useAuth } from "@/src/state/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function AppSidebar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const pathname = usePathname();

  const items = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Tasks", url: "/tasks", icon: SquareCheckBig },
    { title: "Suche", icon: Search, url: "/search" },
  ];

  // Logout über Hook
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Erfolgreich abgemeldet", { duration: 3000 });
    } catch {
      toast.error("Fehler beim Abmelden");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Todo-Webapp</h1>
          <SidebarTrigger className="cursor-pointer" />
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700" />
      </SidebarHeader>

      <SidebarContent>
        <div className="p-2">
          <button
            onClick={() => setOpenCreateDialog(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md bg-primary/20 hover:bg-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="">Task erstellen</span>
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Seiten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {
                      <Link href={item.url} className={`flex items-center gap-2 ${pathname === item.url ? 'bg-secondary font-semibold' : ''}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <CategoryManagement />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeChanger />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 cursor-pointer">
                  <User2 className="h-4 w-4" />
                  {loading ? "Lädt..." : user?.email ?? "Gast"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuItem onSelect={() => router.push("/account")} className='cursor-pointer'>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={handleLogout} className='cursor-pointer'>
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Task-Dialog */}
      <TaskDialog
        mode="create"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        hideTrigger
      />

    </Sidebar>
  );
}
