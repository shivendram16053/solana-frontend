"use client";

import React, { ReactNode } from "react";
import HomeSidebar from "@/components/Appbar/HomeSidebar";
import HomeNav from "@/components/Appbar/HomeNav";
import { ClusterWalletProvider } from "@/hook/useWallet";
import { TokenProvider } from "@/hook/useToken";
import { NFTProvider } from "@/hook/useNFTs";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ClusterWalletProvider>
      <TokenProvider>
        <NFTProvider>
          <div className="flex">
            <HomeSidebar />
            <div className="w-full">
              <HomeNav />
              <div className="p-4">{children}</div>
            </div>
          </div>
        </NFTProvider>
      </TokenProvider>
    </ClusterWalletProvider>
  );
};

export default Layout;
