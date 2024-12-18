"use client";

import React, { useEffect, useState } from "react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useClusterWallet } from "@/hook/useWallet";
import { useTokens } from "@/hook/useToken";
import { useNFTs } from "@/hook/useNFTs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { ExternalLink } from 'lucide-react';

const Page = () => {
  const { cluster, wallet } = useClusterWallet();
  const { tokens, tokenLoadingError, tokenLoading } = useTokens();
  const { nfts, NFTError, NFTLoading } = useNFTs();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenImages, setTokenImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTokenImages = async () => {
      if (!tokens || tokens.length === 0) return;

      const imagePromises = tokens.map(async (token) => {
        if (token.uri) {
          try {
            const response = await fetch(token.uri);
            const metadata = await response.json();
            return { address: token.address, image: metadata.image };
          } catch (error) {
            console.error(`Failed to fetch image for token ${token.address}:`, error);
            return { address: token.address, image: "" };
          }
        }
        return { address: token.address, image: "" };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce<{ [key: string]: string }>((acc, { address, image }) => {
        if (image) acc[address] = image;
        return acc;
      }, {});

      setTokenImages(imageMap);
    };

    fetchTokenImages();
  }, [tokens]);
  const formatAmount = (amount: string) => {
    const tokenAmount = parseFloat(amount) ;

    return tokenAmount.toLocaleString();
  };

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
    <div className=" text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Dashboard</h1>

        <Card className=" border-gray-700">
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {wallet ? (
              isLoading ? (
                <Skeleton className="h-8 w-48 bg-gray-700" />
              ) : (
                <p className="text-2xl font-semibold">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : "N/A"}{" "}
                  <span className="text-sm font-normal text-gray-400">in {cluster}</span>
                </p>
              )
            ) : (
              <p className="text-yellow-400">Please connect your wallet to view balance.</p>
            )}
          </CardContent>
        </Card>

        <Card className=" border-gray-700">
          <CardHeader>
            <CardTitle>Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            {tokenLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full " />
                <Skeleton className="h-8 w-full " />
              </div>
            ) : tokenLoadingError ? (
              <p className="text-red-500">Error: {tokenLoadingError}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Logo</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Token Address</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokens.filter(token => token.amount !== "0").map((token, index) => (
                      <TableRow key={index}>
                        <TableCell>
                            {tokenImages[token.address] ? (
                              <img
                                src={tokenImages[token.address]}
                                alt={token.name}
                                className="h-8 w-8 object-cover rounded-lg"
                              />
                            ) : (
                              <h1>????</h1>
                            )}
                          </TableCell>
                        <TableCell>{token.name}</TableCell>
                        <TableCell>
                          <Link 
                            href={`https://explorer.solana.com/address/${token.address}?cluster=${cluster}`}
                            className="text-blue-400 hover:text-blue-300 flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {token.address.slice(0, 4)}...{token.address.slice(-4)}
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>{formatAmount(token.amount)+ " "+token.symbol}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className=" border-gray-700">
          <CardHeader>
            <CardTitle>NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            {NFTLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-32 w-32 bg-gray-700" />
                ))}
              </div>
            ) : NFTError ? (
              <p className="text-red-500">NFT Error: {NFTError}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {nfts.length > 0 ? (
                  nfts.map((nft, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img src={nft.uri} alt={nft.name} className="w-32 h-32 object-cover rounded-lg shadow-lg" />
                      <p className="mt-2 text-sm text-center text-gray-300">{nft.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full text-center">No NFTs found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;

