// components/layout/UserNav.jsx
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useAuth } from "@/providers/AuthProvider"; // আপনার AuthProvider থেকে useAuth ইম্পোর্ট করুন

export function UserNav() {
  // const { user, logout } = useAuth(); // Auth context থেকে ইউজার এবং লগআউট ফাংশন

  // ডেমো ডেটা, আপনার AuthProvider থেকে আসল ডেটা আসবে
  const user = {
    name: "Dr. Rahim",
    email: "dr.rahim@example.com",
    // image: "/path/to/user-image.jpg"
  };

  const handleLogout = () => {
    // logout(); // আপনার আসল লগআউট ফাংশন কল করুন
    console.log("User logged out");
    // রিডাইরেক্ট করুন লগইন পেজে
    window.location.href = '/auth/login';
  };

  if (!user) {
    return null;
  }

  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'DR';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}