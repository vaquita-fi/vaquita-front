"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { HeroUIProvider } from "@heroui/system";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { baseSepolia } from "viem/chains";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'vaquita-ui',
      preference: 'smartWalletOnly',
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <OnchainKitProvider chain={baseSepolia}>
        <HeroUIProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </HeroUIProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
