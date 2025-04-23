"use client";
import { Button, Divider, Snippet } from "@heroui/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { PiKeyReturnDuotone, PiWalletLight } from "react-icons/pi";

const WalletInfo = ({ onClose }: { onClose: () => void }) => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  if (!ready) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-start gap-2 py-4">
        <Button
          size="lg"
          className="w-full py-6 text-black border-b-4 border-black rounded-md border-l-1 border-t-1 border-r-1 bg-primary"
          onPress={() => login()}
        >
          Login with email or passkey
        </Button>
        <p className="text-sm text-gray-500">You&apos;re not logged in</p>
      </div>
    );
  }

  const wallet = wallets?.[0];
  const walletAddress = wallet?.address ?? "No wallet found";
  const isSmartWallet = wallet?.type === "ethereum";

  return (
    <div className="w-full p-4 border border-black rounded-xl bg-background">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <PiWalletLight className="w-5 h-5 " />
          {isSmartWallet ? "Smart Wallet (AA)" : "External Wallet"}
        </div>
      </div>

      <Snippet
        symbol=""
        className="p-2 font-mono text-xs break-all bg-white border border-gray-400 border-dashed rounded-md"
      >
        {walletAddress}
      </Snippet>

      <Divider className="my-4" />

      <Button
        size="sm"
        className="w-full"
        variant="light"
        color="danger"
        onPress={() => {
          logout();
          onClose();
        }}
        startContent={<PiKeyReturnDuotone />}
      >
        Disconnect
      </Button>
    </div>
  );
};

export default WalletInfo;
