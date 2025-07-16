"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import React from 'react';
export default function Layout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}