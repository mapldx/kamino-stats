"use client";

import axios from "axios";

import '@solana/wallet-adapter-react-ui/styles.css';
import { FC, useMemo, useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { clusterApiUrl } from '@solana/web3.js';
import Header from '@/components/header';
import Portfolio from '@/components/portfolio';

const WalletContent = () => {
  const { connected, publicKey } = useWallet();
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    if (connected) {
      // const address = publicKey?.toBase58();
      const address = "8PhAFNi714pfG5HnufLVNEpASrnF7Qvu79sf3w21paKJ"
      axios
        .get(`http://localhost:3000/api/portfolio?address=${address}`)
        .then((response) => {
          setPortfolioData(response.data.portfolio);
        })
        .catch((error) => {
          console.error('Error fetching portfolio data:', error);
        });
    }
  }, [connected, publicKey]);

  return (
    <main className='flex flex-col h-screen'>
      {!connected ? (
        <div className="flex flex-1 justify-center items-center">
          <WalletMultiButton />
        </div>
      ) : (
        <div>
          <div className="px-24 py-12">
            {portfolioData ? <Portfolio portfolio={portfolioData} /> : (
              <div className="flex justify-center items-center">
                <div className="spinner mr-4"></div>
                [Portfolio data is loaded live, can take up to a minute...]
              </div>
            )}
            <div className="flex items-center justify-center mt-6">
              <WalletDisconnectButton />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default function Page() {
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
            <WalletContent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
}