'use client';

import React, { useEffect, useState } from "react";
import TransferTokens from "@/components/Tokens/TransferTokens";
import { useParams } from "next/navigation";

const TransferTokenPage = () => {
  const {tokenAddress} = useParams();

  // If tokenAddress is not available yet, show loading or return null
  if (!tokenAddress) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Transfer Tokens</h1>
      <p className="text-xl mb-6">Transferring tokens for: {tokenAddress}</p>
      {/* Pass the tokenAddress to the TransferTokens component */}
      <TransferTokens tokenAddress={tokenAddress as string} />
    </div>
  );
};

export default TransferTokenPage;
