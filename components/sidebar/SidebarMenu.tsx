"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";

export function SidebarMenu() {
  const { open, toggleSidebar } = useSidebar();

  // Nur anzeigen wenn Sidebar geschlossen ist
  if (open) return null;

  return (
    <div className="top-4 left-6 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSidebar}
        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border shadow-md hover:shadow-lg transition-all duration-200"
      >
        <PanelLeftOpen className="h-4 w-4" />
        <span className="sm:inline">Navigation öffnen</span>
      </Button>
    </div>
  );
}
