"use client";

import '@solana/wallet-adapter-react-ui/styles.css';
import { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { clusterApiUrl } from '@solana/web3.js';
import Header from '@/components/header';

export default function Portfolio() {
  const network = WalletAdapterNetwork.Mainnet;
  
  const endpoint = clusterApiUrl(network);
  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
    ],
    [network]
  );

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="flex flex-1 justify-center items-center">
              <WalletMultiButton />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
}