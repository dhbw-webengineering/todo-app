"use client";

import { useState, ChangeEvent, Fragment } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Category } from "@/src/types/category";
import { useCategory } from "@/src/state/useCategory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar";
import { FolderCheck, Plus, MoreHorizontal, X, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/src/components/ui/tooltip";

function EditableCategoryInput({
  value,
  onChange,
  onConfirm,
  onCancel,
  autoFocus = false,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  onCancel: () => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Kategorie"
        className="flex-1 min-w-0 bg-transparent px-2 py-1 text-sm border rounded"
        autoFocus={autoFocus}
      />
      <Button
        variant={"ghost"}
        onClick={onConfirm}
        className="flex h-6 w-6 items-center justify-center rounded-full p-0 text-green-500 hover:bg-green-500/10 cursor-pointer"
        title="Speichern"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={onCancel}
        className="flex h-6 w-6 items-center justify-center rounded-full p-0 text-red-500 hover:bg-red-500/10 cursor-pointer"
        title="Abbrechen"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function CategoryManagement() {
  const {
    categories,
    loading,
    error,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategory();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    setIsCreating(true);
    setNewCategoryName("");
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Kategoriename darf nicht leer sein");
      return;
    }
    try {
      await addCategory(newCategoryName);
      toast.success("Kategorie erstellt");
      setIsCreating(false);
      setNewCategoryName("");
    } catch {
      toast.error("Fehler beim Erstellen der Kategorie");
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) {
      toast.error("Kategoriename darf nicht leer sein");
      return;
    }
    try {
      await editCategory(editingCategory.id.toString(), newCategoryName);
      toast.success("Kategorie aktualisiert");
      setEditingCategory(null);
      setNewCategoryName("");
    } catch {
      toast.error("Fehler beim Aktualisieren der Kategorie");
    }
  };

  const handleConfirmDelete = (cat: Category) => {
    setDeletingCategory(cat);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    if (categories.length <= 1) {
      toast.error("Die letzte Kategorie kann nicht gelöscht werden");
      setDeletingCategory(null);
      return;
    }
    try {
      await removeCategory(deletingCategory.id.toString());
      toast.success("Kategorie gelöscht");
      setDeletingCategory(null);
    } catch {
      toast.error("Fehler beim Löschen der Kategorie");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setDeletingCategory(null);
    setNewCategoryName("");
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Filter</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FolderCheck className="h-4 w-4" />
                <span>Alle Kategorien</span>
              </SidebarMenuButton>
              <SidebarMenuAction onClick={handleAddCategory}>
                <Plus />
              </SidebarMenuAction>
            </SidebarMenuItem>
            <SidebarMenuSub>
              {loading && (
                <SidebarMenuSubItem>
                  <div className="px-4 py-2 text-sm">
                    Kategorien werden geladen…
                  </div>
                </SidebarMenuSubItem>
              )}
              {error && !loading && (
                <SidebarMenuSubItem>
                  <div className="px-4 py-2 text-sm text-red-500">
                    {error.message}
                  </div>
                </SidebarMenuSubItem>
              )}
              {!loading && !error && categories.length === 0 && (
                <SidebarMenuSubItem>
                  <div className="px-4 py-2 text-sm">
                    Keine Kategorien gefunden
                  </div>
                </SidebarMenuSubItem>
              )}

              {isCreating && (
                <SidebarMenuSubItem>
                  <EditableCategoryInput
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onConfirm={handleCreateCategory}
                    onCancel={handleCancel}
                    autoFocus
                  />
                </SidebarMenuSubItem>
              )}

              {!loading &&
                !error &&
                categories.map((cat) => (
                  <SidebarMenuSubItem key={cat.id}>
                    {editingCategory?.id === cat.id ? (
                      <EditableCategoryInput
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onConfirm={handleUpdateCategory}
                        onCancel={handleCancel}
                        autoFocus
                      />
                    ) : (
                      <Fragment>
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/tasks?category=${cat.id}`}
                            className="flex items-center gap-2"
                          >
                            <FolderCheck className="h-4 w-4" />
                            <span>{cat.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild className="cursor-pointer">
                            <SidebarMenuAction>
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right">
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(cat)} className="cursor-pointer"
                            >
                              Kategorie bearbeiten
                            </DropdownMenuItem>
                            <Tooltip>
                              <TooltipTrigger className="w-[100%]">
                                <DropdownMenuItem
                                  onClick={() => handleConfirmDelete(cat)}
                                  disabled={categories.length <= 1}
                                  className={`${categories.length > 1 && "cursor-pointer"} text-red-600`}>
                                    Kategorie löschen
                                </DropdownMenuItem>
                              </TooltipTrigger>
                              {categories.length <= 1 && (
                                <TooltipContent>
                                  Die letzte Kategorie kann nicht gelöscht werden
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Fragment>
                    )}
                  </SidebarMenuSubItem>
                ))}
            </SidebarMenuSub>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Dialog
        open={!!deletingCategory}
        onOpenChange={(open: boolean | "intermediate") => !open && setDeletingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategorie löschen</DialogTitle>
            <DialogDescription>
              {`
              Bist du sicher, dass du die Kategorie "${deletingCategory?.name}"
              löschen möchtest? Alle Tasks verlieren dann ihre Kategorie.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)} className="cursor-pointer">
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} className="cursor-pointer">
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
