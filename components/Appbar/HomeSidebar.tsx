import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { FaExchangeAlt, FaHistory, FaImages, FaBox, FaCoins, FaMapMarkerAlt } from "react-icons/fa";

const HomeSidebar = () => {
  const pathname = usePathname();

  const getActiveClass = (path: string | null) => 
    pathname === path ? "bg-gray-900" : "hover:bg-gray-800";

  return (
    <div className="bg-black w-96 h-screen p-6 text-white">
      {/* Sidebar Header */}
      <div className="flex items-center space-x-3 mb-8">
        {/* Title */}
        <h1 className="text-2xl font-bold">Step</h1>
      </div>

      {/* Sidebar Items */}
      <ul className="space-y-4">
        {/* Dashboard */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home")}`}>
          <FaBox />
          <Link href="/home">Dashboard</Link>
        </li>

        {/* Create */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home/create-token")}`}>
          <FaCoins />
          <Link href="/home/create-token">Create Token</Link>
        </li>

        {/* Swap */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home/swap-token")}`}>
          <FaExchangeAlt />
          <Link href="/home/swap-token">Swap Token</Link>
        </li>

        {/* Transaction History */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home/transaction-history")}`}>
          <FaHistory />
          <Link href="/home/transaction-history">Transactions</Link>
        </li>

        {/* Create NFTs */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home/create-nfts")}`}>
          <FaImages />
          <Link href="/home/create-nfts">Create NFTs</Link>
        </li>

        {/* NFT Gallery */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home/wallet-nfts")}`}>
          <FaMapMarkerAlt />
          <Link href="/home/wallet-nfts">NFT's Gallery</Link>
        </li>

        {/* Accounts */}
        <li className={`flex items-center space-x-3 p-2 rounded-lg ${getActiveClass("/home/accounts")}`}>
          <FaBox />
          <Link href="/home/accounts">Accounts</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomeSidebar;
