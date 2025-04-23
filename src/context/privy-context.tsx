// context/privy-context.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";
// Replace this with any of the networks listed at https://github.com/wevm/viem/blob/main/src/chains/index.ts
import { base } from "viem/chains";
interface Props {
  children: React.ReactNode;
}

export const PrivyWrapper = ({ children }: Props) => {
  return (
    // TODO: Add PrivyProvider
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["wallet", "email", "passkey"],
        appearance: { theme: "light" },
        defaultChain: base,
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
