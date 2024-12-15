"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokens } from "@/hook/useToken";
import { PinataSDK } from "pinata-web3";
import Link from "next/link";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

const CreateTokenPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { createToken } = useTokens();
  const [tokenName, setTokenName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [initialSupply, setInitialSupply] = useState<number>(1000);
  const [decimals, setDecimals] = useState<number>(9);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [mintAuthority, setMintAuthority] = useState<boolean>(false);
  const [freezeAuthority, setFreezeAuthority] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [creating,setCreating] = useState<boolean>(false);

  if (!connected || !publicKey) {
    return (
      <div className="flex items-center justify-center  text-white">
        <h1 className="text-2xl font-bold">Connect your wallet first</h1>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setCreating(true);
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!imageFile || !initialSupply || !tokenName || !symbol || !decimals) {
        setError("Image is necessary");
        throw new Error("Image file is required");
      }

      const uploadImage = await pinata.upload.file(imageFile);
      const imageUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${uploadImage.IpfsHash}`;

      const tokenJSONfile = {
        name: `${tokenName}`,
        symbol: `${symbol}`,
        description: `${description}`,
        image: `${imageUrl}`,
      };

      const uploadTokenData = await pinata.upload.json(tokenJSONfile);
      const tokenURI = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${uploadTokenData.IpfsHash}`;

      const result = await createToken(
        tokenName,
        symbol,
        initialSupply,
        decimals,
        tokenURI,
        description,
        mintAuthority,
        freezeAuthority
      );

      if (result.success) {
        setCreating(false);
        setSuccess(`${result.result.toString()}`);
        console.log("Token Created Successfully:", result.result.toString());
      } else {
        setCreating(false);
        setError(`Failed to create token: ${result.result}`);
        console.error("Failed to create token:", result.result);
      }
    } catch (error) {
      setError(
        `Error creating token: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      console.error("Error creating token:", error);
    }
  };

  return (
    <div className=" text-white sm:p-6 md:p-8">
      <div className="max-w-3xl m-auto ">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Create Token</h1>
        
        {error && (
          <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-md mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div
          className="bg-green-900 border border-green-600 text-green-100 px-4 py-3 rounded-md mb-4"
          role="alert"
        >
          <strong className="font-bold">Success: </strong>
          <Link href={`https://solscan.io/token/${success}?cluster=devnet`} className="block sm:inline">Token Created Successfully: {success}</Link>
        </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tokenName" className="block text-sm font-medium mb-1">
                Token Name
              </label>
              <input
                id="tokenName"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                required
                placeholder="Enter Token Name"
              />
            </div>
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium mb-1">
                Symbol
              </label>
              <input
                id="symbol"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
                placeholder="Enter Token Symbol"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="initialSupply" className="block text-sm font-medium mb-1">
              Initial Supply
            </label>
            <input
              id="initialSupply"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              type="text"
              inputMode="numeric"
              value={initialSupply.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value)) {
                  setInitialSupply(Number(value));
                }
              }}
              required
            />
          </div>
            <div>
              <label htmlFor="decimals" className="text-sm flex items-center font-medium mb-1">
                Decimals <p className="text-xs pl-1">(Set to 9, solana default decimal)</p>
              </label>
              <input
                id="decimals"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(Number(e.target.value))}
                required
                readOnly
              />
            </div>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Image
            </label>
            <input
              id="image"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                id="mintAuthority"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-gray-800 border-gray-700 rounded"
                type="checkbox"
                checked={mintAuthority}
                onChange={(e) => setMintAuthority(e.target.checked)}
              />
              <label htmlFor="mintAuthority" className="ml-2 block text-sm">
                Mint Authority
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="freezeAuthority"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-gray-800 border-gray-700 rounded"
                type="checkbox"
                checked={freezeAuthority}
                onChange={(e) => setFreezeAuthority(e.target.checked)}
              />
              <label htmlFor="freezeAuthority" className="ml-2 block text-sm">
                Freeze Authority
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {creating ? <p>Creating Now...</p>:<p>Create Now</p>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTokenPage;

