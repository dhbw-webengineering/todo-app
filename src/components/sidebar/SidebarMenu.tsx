"use client";

import { useSidebar } from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";
import { PanelLeftOpen } from "lucide-react";

export function SidebarMenu() {
  const { open, toggleSidebar, isMobile } = useSidebar();

  if(open && !isMobile) return null

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleSidebar}
      className="mb-3"
    >
      <PanelLeftOpen className="h-4 w-4" /> Navigation öffnen
    </Button>
  );
}
