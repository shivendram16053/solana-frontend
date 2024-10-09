"use client";

import React, { useCallback, useEffect, useState } from "react";
import bs58 from "bs58";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import AirdroptoWallet from "./AirdroptoWallet";

const CreateWallet: React.FC = () => {
  const [keypair, setKeyPair] = useState<Keypair | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [showSecKey, setShowSecKey] = useState<boolean>(false);

  useEffect(() => {
    const savedSecretKey = localStorage.getItem("walletSecretKey");
    if (savedSecretKey) {
      const secretKeyArray = JSON.parse(savedSecretKey);
      const restoredKeypair = Keypair.fromSecretKey(
        new Uint8Array(secretKeyArray)
      );
      setKeyPair(restoredKeypair);
      setPublicKey(restoredKeypair.publicKey.toBase58());
    }
  }, []);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

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
      const walletBalance =
        (await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL;
      setBalance(walletBalance);
    }
  }, [keypair, connection]);

  useEffect(() => {
    getBalance();
    if (keypair) {
      const publickey = new PublicKey(keypair.publicKey) as PublicKey;

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

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6 font-semibold">Create Solana Wallet</h1>

      {publicKey ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl mb-2 font-semibold">Your Wallet Address:</h2>
          <p className="break-all text-sm">{publicKey}</p>
          {showSecKey ? (
            <div className="mt-4">
              <h2 className="text-2xl mb-2 font-semibold">Your SecretKey</h2>

              <p className="text-xs">{secretKey}</p>
              <p
                onClick={() => setShowSecKey(false)}
                className="text-red-500 cursor-pointer mt-2"
              >
                Hide Secret Key
              </p>
            </div>
          ) : (
            <button
              onClick={getSecretKey}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded mt-4 transition duration-200"
            >
              Show Secret Key
            </button>
          )}

          <h2 className="text-2xl mt-6 font-semibold">Balance</h2>
          <p className="text-lg">
            {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
          </p>
          <AirdroptoWallet keypair={keypair} />
        </div>
      ) : (
        <button
          onClick={handleCreateWallet}
          className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded mt-6 transition duration-200"
        >
          Create Wallet
        </button>
      )}
    </div>
  );
};

export default CreateWallet;
