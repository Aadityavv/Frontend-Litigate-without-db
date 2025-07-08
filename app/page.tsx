'use client';
import React, { Suspense } from 'react';
import UnifiedDashboardComponent from "@/components/unified-dashboard"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnifiedDashboardComponent />
    </Suspense>
  );
}