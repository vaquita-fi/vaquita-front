"use client";

import Header from "@/components/ui/Header/Header";
import React from "react";

export default function CompetitiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center overflow-hidden h-dvh bg-gradient-to-r bg-background">
      <nav className="relative bottom-0 left-0 w-full">
        <Header />
      </nav>
      {children}
    </main>
  );
}
