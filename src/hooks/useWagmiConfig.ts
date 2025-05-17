'use client';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { http, createConfig } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { PUBLIC_NETWORK, RPC_URL, WC_PROJECT_ID } from '../constants';
import { getChainByName } from '../utils';

const chain = getChainByName(wagmiChains, PUBLIC_NETWORK);

export function useWagmiConfig() {
  
  const projectId = WC_PROJECT_ID ?? '';
  
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet],
        }
      ],
      {
        appName: 'Vaquita',
        projectId,
      },
    );

    const wagmiConfig = createConfig({
      chains: [chain],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [chain.id]: http(RPC_URL)
      },
    });

    return wagmiConfig;
  }, [projectId]);
}
