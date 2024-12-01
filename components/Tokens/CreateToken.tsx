"use client";

import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import FetchTokens from "./FetchTokens";

const CreateToken = () => {
  const [error, setError] = useState<string | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [tokenSignature, setTokenSignature] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>("100"); // Default 1 token (assuming 9 decimals)
  const [fetchTokensTrigger, setFetchTokensTrigger] = useState<boolean>(true); // For triggering token fetch


  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  useEffect(() => {
    const savedSecretKey = localStorage.getItem("walletSecretKey");
    if (!savedSecretKey) {
      setError("Create or connect a wallet first");
      return;
    }

    const secretKeyArray = JSON.parse(savedSecretKey);
    const restoredKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
    setKeypair(restoredKeypair);
    setPublicKey(restoredKeypair.publicKey.toBase58());
  }, []);

  const handleTokenCreation = async () => {
    if (!keypair) {
      setError("No wallet found.");
      return;
    }

    try {
      setLoading(true);

      // Create a new SPL token
      const token = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null, // Freeze authority (set to null if not needed)
        9 // Number of decimals
      );

      // Create an associated token account for the mint
      const myTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        token,
        keypair.publicKey
      );

      // Mint tokens to the associated account
      const signature = await mintTo(
        connection,
        keypair,
        token,
        myTokenAccount.address, // The token account that will receive the tokens
        keypair.publicKey, // The mint authority
        parseInt(tokenAmount)*1000000000 // User-defined amount of tokens (adjust decimals as necessary)
      );

      setTokenSignature(signature);
      setError(null); // Clear any previous error
      setFetchTokensTrigger(true);
    } catch (err: any) {
      setError("Error creating token: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Own Token</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-white text-lg font-semibold mb-2">
          Token Name
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-white text-lg font-semibold mb-2">
          Token Amount
        </label>
        <input
          type="number"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter amount of tokens to mint"
        />
      </div>

      <button
        onClick={handleTokenCreation}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
      >
        {loading ? "Creating Token..." : "Create Token"}
      </button>

      {tokenSignature && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Token Created Successfully!</h2>
          <a
            href={`https://explorer.solana.com/tx/${tokenSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            View Transaction on Solana Explorer
          </a>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Tokens</h2>
        <FetchTokens publicKey={publicKey} fetchTrigger={fetchTokensTrigger} />
      </div>
    </div>
  );
};

export default CreateToken;
