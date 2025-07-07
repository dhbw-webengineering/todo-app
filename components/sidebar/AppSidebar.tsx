"use client";

import {
  Calendar,
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
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useState } from "react";
import { TaskDialog } from "@/components/task/TaskDialog"; // Unified TaskDialog
import Link from "next/link";

import  ThemeChanger  from "@/components/themeChanger";
import { CategoryManagement } from "./CategoryManagement";
import { useRouter } from "next/navigation"
import { ApiRoute } from "@/ApiRoute";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SearchMenu from "../searchMenu";


export function AppSidebar() {
  const router = useRouter();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [loading] = useState(false);

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home
    },
    {
      title: "Alle Tasks",
      url: "/tasks",
      icon: SquareCheckBig
    },
    {
      title: "Suche",
      icon: Search,
      onClick: () => setOpenSearchDialog(true)
    },
  ];

  const handleLogout = async () => {
    fetch(ApiRoute.LOGOUT, { method: 'POST', credentials: "include" }).then(() => {
      router.push("/auth/login");
      toast.success("Erfolgreich abgemeldet", {
        duration: 3000,
      });
    });
  };

  const onSearch = async (params: URLSearchParams) => {
      router.replace(`/search?${params.toString()}`);
      setOpenSearchDialog(false);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Todo-Webapp</h1>
          <SidebarTrigger className="cursor-pointer"/>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700" />
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2">
          <button
            onClick={() => setOpenCreateDialog(true)}
            disabled={loading}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Task erstellen</span>
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Seiten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    { item.url ?
                      (
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      ) :
                      (
                        <div onClick={item.onClick} className="flex items-center gap-2 cursor-pointer">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      )
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/account")}>
                  <span>Account</span>

                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* TaskDialog mit mode="create" außerhalb der Sidebar-Struktur */}
      <TaskDialog
        mode="create"
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        hideTrigger={true} // Button ist bereits in der Sidebar implementiert
      />

      {/* Search dialog */}
      <Dialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
          <DialogContent>
            <DialogHeader className="mb-3">
              <DialogTitle>
                Suchen
              </DialogTitle>
            </DialogHeader>
            <SearchMenu onSearch={onSearch} />
          </DialogContent>
        </Dialog>

    </Sidebar>
  );
}
