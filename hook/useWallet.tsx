import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cluster } from '@solana/web3.js';

interface ClusterWalletContextType {
  cluster: Cluster;
  wallet: string;
  setCluster: (cluster: Cluster) => void;
  setWallet: (wallet: string) => void;
}

const ClusterWalletContext = createContext<ClusterWalletContextType | undefined>(undefined);

export const ClusterWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cluster, setCluster] = useState<Cluster>("devnet");
  const [wallet, setWallet] = useState<string>("");

  useEffect(() => {
    const savedCluster = localStorage.getItem("cluster") as Cluster;
    const savedWallet = localStorage.getItem("wallet");
    
    if (savedCluster) setCluster(savedCluster);
    if (savedWallet) setWallet(savedWallet);
  }, []);


  return (
    <ClusterWalletContext.Provider value={{ cluster, wallet, setCluster, setWallet }}>
      {children}
    </ClusterWalletContext.Provider>
  );
};

export const useClusterWallet = () => {
  const context = useContext(ClusterWalletContext);
  if (!context) {
    throw new Error("useClusterWallet must be used within a ClusterWalletProvider");
  }
  return context;
};
