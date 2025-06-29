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
  X,
  CheckCircle2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import { TaskDialog } from "@/components/task/TaskDialog"; // Unified TaskDialog
import  ThemeChanger  from "@/components/themeChanger";

import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner";
import { Category } from "@/types/category";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/categoryApi";

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

// This will be replaced with data from the API



export function AppSidebar() {
  const router = useRouter();

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for category creation/editing
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State for delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = () => {
    setIsCreatingCategory(true);
    setNewCategoryName("");
  };

  // Handle creating a category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Kategoriename darf nicht leer sein");
      return;
    }

    try {
      const newCategory = await createCategory(newCategoryName);
      setCategories([...categories, newCategory]);
      setIsCreatingCategory(false);
      setNewCategoryName("");
      toast.success("Kategorie erstellt");
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error("Fehler beim Erstellen der Kategorie");
    }
  };

  // Handle editing a category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  // Handle updating a category
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    if (!newCategoryName.trim()) {
      toast.error("Kategoriename darf nicht leer sein");
      return;
    }

    try {
      const updatedCategory = await updateCategory(editingCategory.id, newCategoryName);
      setCategories(
        categories.map((cat) => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );
      setEditingCategory(null);
      setNewCategoryName("");
      toast.success("Kategorie aktualisiert");
    } catch (err) {
      console.error("Failed to update category:", err);
      toast.error("Fehler beim Aktualisieren der Kategorie");
    }
  };

  // Handle confirming category deletion
  const handleConfirmDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  // Handle deleting a category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    // Prevent deleting the last category
    if (categories.length <= 1) {
      toast.error("Die letzte Kategorie kann nicht gelöscht werden");
      setCategoryToDelete(null);
      return;
    }

    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      toast.success("Kategorie gelöscht");
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error("Fehler beim Löschen der Kategorie");
    }
  };

  // Cancel category creation/editing/deletion
  const handleCancelCategoryAction = () => {
    setIsCreatingCategory(false);
    setEditingCategory(null);
    setCategoryToDelete(null);
    setNewCategoryName("");
  };

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
                    {/* Loading state */}
                    {isLoading && (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm">Kategorien werden geladen...</div>
                      </SidebarMenuSubItem>
                    )}

                    {/* Error state */}
                    {error && !isLoading && (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm text-red-500">{error}</div>
                      </SidebarMenuSubItem>
                    )}

                    {/* Empty state */}
                    {!isLoading && !error && categories.length === 0 && (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm">Keine Kategorien gefunden</div>
                      </SidebarMenuSubItem>
                    )}

                    {/* Category creation UI */}
                    {isCreatingCategory && (
                      <SidebarMenuSubItem>
                        <div className="flex items-center gap-2 px-2 py-1">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Neue Kategorie"
                            className="flex-1 px-2 py-1 text-sm border rounded"
                            autoFocus
                          />
                          <button 
                            onClick={handleCreateCategory}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Speichern"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={handleCancelCategoryAction}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Abbrechen"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </SidebarMenuSubItem>
                    )}

                    {/* Categories list */}
                    {!isLoading && !error && categories.map((category) => (
                      <SidebarMenuSubItem key={category.id}>
                        {editingCategory && editingCategory.id === category.id ? (
                          // Editing UI
                          <div className="flex items-center gap-2 px-2 py-1">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border rounded"
                              autoFocus
                            />
                            <button 
                              onClick={handleUpdateCategory}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Speichern"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={handleCancelCategoryAction}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Abbrechen"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          // Normal display
                          <>
                            <SidebarMenuButton asChild>
                              <a
                                href={`/tasks?category=${category.id}`}
                                className="flex items-center gap-2"
                              >
                                <FolderCheck className="h-4 w-4" />
                                <span>{category.name}</span>
                              </a>
                            </SidebarMenuButton>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuAction className="cursor-pointer">
                                  <MoreHorizontal />
                                </SidebarMenuAction>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="right" align="start">
                                <DropdownMenuItem 
                                  onClick={() => handleEditCategory(category)}
                                  className="cursor-pointer"
                                >
                                  <span>Kategorie bearbeiten</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleConfirmDelete(category)}
                                  className="cursor-pointer text-red-600"
                                >
                                  <span>Kategorie löschen</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
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
                <DropdownMenuItem
                  onClick={() => router.push("/account")}>
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

      {/* Confirmation Dialog for Category Deletion */}
      <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategorie löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du die Kategorie "{categoryToDelete?.name}" löschen möchtest?
              Alle Tasks in dieser Kategorie werden nicht gelöscht, aber sie verlieren ihre Kategorie-Zuordnung.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
