"use client";

import {
  Calendar,
  Home,
  Search,
  FolderCheck,
  SquareCheckBig,
  User2,
  ChevronUp,
  Plus,
  MoreHorizontal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useState } from "react";
import { TaskDialog } from "@/components/task/TaskDialog"; // Unified TaskDialog
import  ThemeChanger  from "@/components/themeChanger";

import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Alle Tasks",
    url: "/tasks",
    icon: SquareCheckBig,
  },
  {
    title: "Kalender",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Suche",
    url: "#",
    icon: Search,
  },
];

const kat = [
  {
    title: "Kategorie 1",
    id: "1",
    url: `/tasks?kat=1`,
    icon: Home,
  },
  {
    title: "Kategorie 2",
    id: "2",
    url: `/tasks?kat=2`,
    icon: Home,
  },
  {
    title: "Kategorie 3",
    id: "3",
    url: `/tasks?kat=3`,
    icon: Home,
  },
];



export function AppSidebar() {
  const handleAddCategory = () => {
    alert("Kategorie hinzufügen geklickt");
  };

  const router = useRouter()
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const handleCreateTask = async (taskData: any) => {
    try {
      console.log("Neuer Task erstellt:", taskData);
      // Hier würdest du normalerweise eine API-Anfrage machen
      // await createTask(taskData);
      
      // Dialog wird automatisch durch TaskDialog geschlossen
    } catch (error) {
      console.error("Fehler beim Erstellen des Tasks:", error);
    }
  };

  const handleLogout = async () => {
    fetch('http://localhost:3001/logout', { method: 'POST', credentials: "include" }).then(() => {
      router.push("/auth/login");
      toast.success("Erfolgreich abgemeldet", {
        duration: 3000,
      });
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Todo-Webapp</h1>
          <SidebarTrigger />
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700" />
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2">
          <button
            onClick={() => setOpenCreateDialog(true)}
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
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Filter</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <FolderCheck className="h-4 w-4" />
                      <span>Alle Kategorien</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <SidebarMenuAction
                    title="Kategorie hinzufügen"
                    onClick={handleAddCategory}
                  >
                    <Plus />
                  </SidebarMenuAction>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {kat.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuButton asChild>
                          <a
                            href={item.url}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem>
                              <span>Kategorie bearbeiten</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span>Kategorie löschen</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeChanger />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
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
        onSave={handleCreateTask}
        hideTrigger={true} // Button ist bereits in der Sidebar implementiert
      />
    </Sidebar>
  );
}
