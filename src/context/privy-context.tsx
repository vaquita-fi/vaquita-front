// context/privy-context.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";

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
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
