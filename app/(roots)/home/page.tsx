"use client";

import React, { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useClusterWallet } from "@/hook/useWallet";
import { useTokens } from "@/hook/useToken";
import Link from "next/link";
import { useNFTs } from "@/hook/useNFTs";

const Page = () => {
  const { cluster, wallet } = useClusterWallet();
  const { tokens, tokenError, tokenLoading } = useTokens();
  const {nfts,NFTError,NFTLoading}=useNFTs();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet && cluster) {
        setIsLoading(true);
        const connection = new Connection(clusterApiUrl(cluster), "confirmed");
        const pubkey = new PublicKey(wallet);
        const balanceLamports = await connection.getBalance(pubkey);
        setBalance(balanceLamports / 1e9);
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [wallet, cluster]);


  return (
    <div className="flex flex-col">
      {wallet ? (
        isLoading ? (
          <p>Loading balance...</p>
        ) : (
          <p>
            Account Balance ={" "}
            {balance !== null ? `${balance} SOL in ${cluster}` : "N/A"}{" "}
          </p>
        )
      ) : (
        <p>Please connect your wallet to view balance.</p>
      )}

      {/* Display tokens */}
      <div className="tokens">
        <h1>Tokens</h1>
        {tokenLoading ? (
          <p>Loading...</p>
        ) : tokenError ? (
          <p className="text-red-500">Error: {tokenError}</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead >
              <tr>
                <th className="border px-4 py-2 text-left">Token Address</th>
                <th className="border px-4 py-2 text-left">Amount</th>
                <th className="border px-4 py-2 text-left">Name</th>
              </tr>
            </thead>
            
              {tokens.map((token, index) => (
                <tbody>
                  {token.amount == "0" ? "" :(<tr key={index}>
                  <td className="border px-4 py-2">{token.name}</td>
                  <td className="border px-4 py-2 text-blue-500 underline"><Link href={`https://explorer.solana.com/address/${token.address}?cluster=${cluster}`}>{token.address}</Link></td>
                  <td className="border px-4 py-2">{token.amount}</td>
                </tr>)}
                </tbody>
              ))}
          </table>
        )}
      </div>

      {/* Display NFTs */}
      <div>
        <h1>NFTs</h1>
        {NFTLoading ? (
          <p>Loading...</p>
        ) : NFTError ? (
          <p className="text-red-500">NFT Error: {NFTError}</p>
        ) : (
          <div className="flex flex-wrap">
            {nfts.length > 0 ? (
              nfts.map((nft, index) => (
                <div key={index} className="flex flex-col items-center m-2">
                  <img src={nft.uri} alt={nft.name} className="w-32 h-32 object-cover rounded" />
                  <p className="text-center">{nft.name}</p>
                </div>
              ))
            ) : (
              <p>No NFTs found.</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Page;
