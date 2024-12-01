"use client";

import "@/app/globals.css";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useMemo, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cluster, setCluster] = useState<string | null>("Devnet");

  useEffect(() => {
    const clusterLocal = localStorage.getItem("cluster");
    if (clusterLocal) {
      setCluster(clusterLocal);
    }
  }, [cluster]);

  const network = useMemo(() => {
    switch (cluster) {
      case "testnet":
        return WalletAdapterNetwork.Testnet;
      case "mainnet-beta":
        return WalletAdapterNetwork.Mainnet;
      case "devnet":
      default:
        return WalletAdapterNetwork.Devnet;
    }
  }, [cluster]);

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
