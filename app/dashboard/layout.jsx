
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { cookies } from 'next/headers';
import React from 'react';
export default function Layout({ children }) {
  const cookieStore = cookies();
  const defaultSidebarOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <DashboardShell defaultSidebarOpen={defaultSidebarOpen}>
      {children}
    </DashboardShell>
  );
}