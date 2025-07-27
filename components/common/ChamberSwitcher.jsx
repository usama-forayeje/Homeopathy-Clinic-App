// components/layout/sidebar/ChamberSwitcher.jsx
"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronsDown, Stethoscope } from "lucide-react";
import { useChamberStore } from "@/store/chamberStore"; // Import Zustand store
import { company } from "@/components/layout/AppSidebar"; // Assuming company export from AppSidebar for simplicity

// ChamberSwitcher now receives only onChamberSwitch prop
export function ChamberSwitcher({ onChamberSwitch }) {
  // Directly select state from Zustand
  const { chambers, activeChamber } = useChamberStore();
  const [selectedChamberLocal, setSelectedChamberLocal] = useState(activeChamber);

  // Sync local state with global activeChamber from Zustand
  useEffect(() => {
    if (activeChamber && activeChamber.$id !== selectedChamberLocal?.$id) {
      setSelectedChamberLocal(activeChamber);
    }
  }, [activeChamber, selectedChamberLocal]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
            <company.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="truncate text-xs">
              {selectedChamberLocal?.chamberName || "Select Chamber"}
            </span>
          </div>
          <ChevronsDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Select Chamber
        </DropdownMenuLabel>
        {chambers.map((chamber) => (
          <DropdownMenuItem
            key={chamber.$id}
            onClick={() => {
              onChamberSwitch(chamber.$id); // Call handler to update global state
            }}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Stethoscope className="size-4 shrink-0" />
            </div>
            {chamber.chamberName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}