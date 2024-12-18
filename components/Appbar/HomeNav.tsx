// components/HomeNav.tsx

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useClusterWallet } from "@/hook/useWallet";
import { Cluster } from "@solana/web3.js";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const HomeNav: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { cluster, setCluster, wallet, setWallet } = useClusterWallet();

  useEffect(() => {
    if (publicKey && connected) {
      const walletAddress = publicKey.toString();
      setWallet(walletAddress);
    } else {
      setWallet("");
    }
  }, [publicKey, connected, setWallet]);

  const handleClusterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCluster = event.target.value as Cluster;
    setCluster(newCluster);
  };

  return (
    <div className="sticky bg-black p-6 flex items-center justify-between top-0 ">
      <div className="flex space-x-4">
        <input
          type="text"
          value={wallet || ""}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter Wallet or Connect Wallet"
          className="w-96 bg-white border-none text-sm outline-zinc-700 p-1 rounded-xl"
        />
      </div>
      <div className="flex items-center space-x-5">
        <select
          value={cluster}
          onChange={handleClusterChange}
          className="bg-zinc-800 w-40 outline-none p-1 rounded-xl"
        >
          <option value="devnet">Devnet</option>
          <option value="testnet">Testnet</option>
          <option value="mainnet-beta">Mainnet</option>
        </select>
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default HomeNav;
