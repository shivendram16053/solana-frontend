"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Connection, LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import AirdroptoWallet from "./AirdroptoWallet";

const CreateWallet: React.FC = () => {
  const [keypair, setKeyPair] = useState<Keypair | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [showSecKey, setShowSecKey] = useState<boolean>(false);
  const [showExampleCode, setShowExampleCode] = useState<boolean>(false);

  // Load wallet from localStorage on component mount
  useEffect(() => {
    const savedSecretKey = localStorage.getItem("walletSecretKey");
    if (savedSecretKey) {
      const secretKeyArray = JSON.parse(savedSecretKey);
      const restoredKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
      setKeyPair(restoredKeypair);
      setPublicKey(restoredKeypair.publicKey.toBase58());
    }
  }, []);

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const getSecretKey = () => {
    const savedSecretKey = localStorage.getItem("walletSecretKey");
    if (savedSecretKey) {
      const secretKeyArray = JSON.parse(savedSecretKey);
      const secKey = bs58.encode(new Uint8Array(secretKeyArray));
      setSecretKey(secKey);
      setShowSecKey(true);
    }
  };

  const getBalance = useCallback(async () => {
    if (keypair) {
      const walletBalance = (await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL;
      setBalance(walletBalance);
    }
  }, [keypair, connection]);

  useEffect(() => {
    getBalance();
    if (keypair) {
      const publickey = new PublicKey(keypair.publicKey);
      const subscriptionId = connection.onAccountChange(publickey, async () => {
        await getBalance();
      });
      return () => {
        connection.removeAccountChangeListener(subscriptionId);
      };
    }
  }, [keypair, connection, getBalance]);

  const handleCreateWallet = () => {
    if (keypair) {
      alert("A wallet is already generated");
      return;
    }
    const newKeypair = Keypair.generate();
    const secretKeyArray = Array.from(newKeypair.secretKey);
    localStorage.setItem("walletSecretKey", JSON.stringify(secretKeyArray));
    setKeyPair(newKeypair);
    setPublicKey(newKeypair.publicKey.toBase58());
    alert("Wallet successfully created");
  };

  const toggleExampleCode = () => setShowExampleCode(!showExampleCode);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6 font-bold text-center">Create Your Solana Wallet</h1>

      {publicKey ? (
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-xl w-full">
          <h2 className="text-2xl mb-4 font-semibold">Wallet Address</h2>
          <p className="break-all text-sm bg-gray-800 p-2 rounded">{publicKey}</p>

          {showSecKey ? (
            <div className="mt-4">
              <h2 className="text-2xl mb-2 font-semibold">Secret Key</h2>
              <p className="text-xs bg-gray-800 p-2 rounded break-all">{secretKey}</p>
              <button
                onClick={() => setShowSecKey(false)}
                className="text-red-500 cursor-pointer mt-2"
              >
                Hide Secret Key
              </button>
            </div>
          ) : (
            <button
              onClick={getSecretKey}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded mt-4 transition duration-200"
            >
              Show Secret Key
            </button>
          )}

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Balance</h2>
            <p className="text-lg mt-2">
              {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
            <AirdroptoWallet keypair={keypair} />
          </div>
        </div>
      ) : (
        <button
          onClick={handleCreateWallet}
          className="bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded transition duration-200 mt-6"
        >
          Create Wallet
        </button>
      )}

      {/* Example Code Section */}
      <button
        onClick={toggleExampleCode}
        className="mt-6 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition duration-200"
      >
        {showExampleCode ? "Hide Example" : "Show Example Code"}
      </button>

      {showExampleCode && (
        <div className="bg-gray-900 p-6 mt-4 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-xl font-semibold">Example Code</h2>
          <p className="text-sm mt-2">Here’s a simple example to create a wallet using `@solana/web3.js`:</p>

          <pre className="bg-gray-800 p-4 rounded-md mt-4 overflow-x-auto text-xs text-green-400">
            {`const { Keypair } = require('@solana/web3.js');
const keypair = Keypair.generate();
const publicKey = keypair.publicKey.toBase58();
const secretKey = keypair.secretKey;`}
          </pre>

          <p className="text-sm mt-4">
            This code generates a new wallet, providing both a public and secret key.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;
