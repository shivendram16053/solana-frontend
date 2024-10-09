"use client";

import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import FetchTokens from './FetchTokens';

const CreateToken = () => {
  const [error, setError] = useState<string | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [tokenSignature, setTokenSignature] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  
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
        1000000000000 // Amount of tokens (adjust decimals as necessary)
      );

      setTokenSignature(signature);
      setError(null); // Clear any previous error
    } catch (err:any) {
      setError("Error creating token: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <h1>Create Token</h1>

      {error && <p className="text-red-500">{error}</p>}

      <button 
        onClick={handleTokenCreation} 
        disabled={loading} 
        className='bg-blue-500 text-white py-2 px-4 rounded'
      >
        {loading ? "Creating Token..." : "Create Token"}
      </button>

      {tokenSignature && (
        <div className="mt-4">
          <h2>Token Created!</h2>
          <a 
            href={`https://explorer.solana.com/tx/${tokenSignature}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on Solana Explorer
          </a>
        </div>
      )}

      <h2 className='text-3xl'>Tokens available</h2>
      <FetchTokens publicKey={publicKey}/>
    </div>
  );
};

export default CreateToken;
