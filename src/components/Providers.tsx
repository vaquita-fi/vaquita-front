"use client";

import { PrivyWrapper } from "@/context/privy-context";
import { HeroUIProvider } from "@heroui/system";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyWrapper>
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </HeroUIProvider>
    </PrivyWrapper>
  );
}
