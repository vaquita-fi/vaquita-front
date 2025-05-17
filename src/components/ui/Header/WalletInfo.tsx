"use client";
import { Button, Divider, Snippet } from "@heroui/react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { useRouter } from "next/navigation";
import { PiKeyReturnDuotone, PiWalletLight } from "react-icons/pi";

const WalletInfo = ({ onClose }: { onClose: () => void }) => {
  // All wallet UI is now handled by OnchainKit's new wallet components
  return (
    <div className="flex flex-col items-start gap-2 py-4">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

export default WalletInfo;
