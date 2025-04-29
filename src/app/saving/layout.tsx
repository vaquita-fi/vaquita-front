"use client";

import React from "react";

export default function SavingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center h-dvh overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="flex flex-col justify-between w-full h-full max-w-3xl border-2 border-black bg-background">
        {children}
      </div>
    </main>
  );
}
