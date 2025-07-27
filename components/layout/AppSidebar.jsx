"use client";

import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserAvatarProfile } from "@/components/common/UserAvatarProfile";
import { navItems } from "@/constants/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  ChevronRight,
  ChevronsDown,
  CreditCard,
  LogOut,
  Stethoscope,
  User,
  Bell,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAllChambers } from "@/hooks/useChambers";
import { useChamberStore } from "@/store/chamberStore";
import { ChamberSwitcher } from "../common/ChamberSwitcher";

export const company = {
  name: "Popular Homeo Care",
  logo: Stethoscope,
  plan: "Professional",
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const { activeChamber, setActiveChamber, setChambers, isLoadingChambers, setLoadingChambers, chambersLoaded } = useChamberStore();

  const { data: fetchedChambers, isLoading: queryLoading } = useAllChambers();

  useEffect(() => {
    setLoadingChambers(queryLoading);

    if (!queryLoading && fetchedChambers) {
      setChambers(fetchedChambers);

      if (!activeChamber && fetchedChambers.length > 0) {
        setActiveChamber(fetchedChambers[0]);
      }
    } else if (!queryLoading && fetchedChambers && fetchedChambers.length === 0) {
      setActiveChamber(null);
    }
  }, [queryLoading, fetchedChambers, setChambers, setActiveChamber, setLoadingChambers, activeChamber]);

  const handleSwitchChamber = (chamberId) => {
    useChamberStore.getState().setActiveChamberById(chamberId);
  };

  const isParentActive = (item) => {
    if (!item.items) return false;
    return item.items.some((subItem) => {
      if (subItem.url) {
        return pathname === subItem.url;
      }
      if (subItem.items) {
        return subItem.items.some((deepSubItem) => pathname === deepSubItem.url);
      }
      return false;
    });
  };

  return (
     <Sidebar collapsible="icon">
      <SidebarHeader>
        {!isLoadingChambers && chambersLoaded && useChamberStore.getState().chambers.length > 0 ? (
          <ChamberSwitcher
            // chambers and defaultChamber props are now directly read from the store
            // in ChamberSwitcher, reducing props drilling
            onChamberSwitch={handleSwitchChamber} // Pass the handler
          />
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {isLoadingChambers ? "Loading Chambers..." : "No Chambers Found."}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item?.items && item?.items?.length > 0) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isParentActive(item)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <Icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            if (subItem?.items && subItem?.items?.length > 0) {
                              return (
                                <Collapsible
                                  key={subItem.title}
                                  asChild
                                  defaultOpen={isParentActive(subItem)}
                                  className="group/collapsible"
                                >
                                  <SidebarMenuSubItem>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuSubButton tooltip={subItem.title}>
                                        {subItem.icon && <SubIcon className="h-4 w-4" />}
                                        <span>{subItem.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                      </SidebarMenuSubButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <SidebarMenuSub>
                                        {subItem.items?.map((deepSubItem) => (
                                          <SidebarMenuSubItem key={deepSubItem.title}>
                                            <SidebarMenuSubButton asChild isActive={pathname === deepSubItem.url}>
                                              <Link href={deepSubItem.url}>
                                                <span>{deepSubItem.title}</span>
                                              </Link>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        ))}
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                  </SidebarMenuSubItem>
                                </Collapsible>
                              );
                            } else {
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            }
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              } else {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {user && (
                    <UserAvatarProfile
                      className="h-8 w-8 rounded-lg"
                      showInfo
                      user={user}
                    />
                  )}
                  <ChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    {user && (
                      <UserAvatarProfile
                        className="h-8 w-8 rounded-lg"
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/billing">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
