"use client";

import React, { useCallback, useEffect, useState } from "react";
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

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const getBalance = useCallback( async () => {
    if (keypair) {  // Add this check to avoid using a potentially null keypair
      const walletBalance =
        (await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL;
      setBalance(walletBalance);
    }
  },[keypair,connection]);

  useEffect(() => {

    getBalance();
    if(keypair){
      const publickey= new PublicKey(keypair.publicKey) as PublicKey;

    const subscriptionId = connection.onAccountChange(
      publickey,
      async()=>{
        await getBalance();
      }
    );

    return ()=>{
      connection.removeAccountChangeListener(subscriptionId);
    }
    }
  }, [keypair, connection,getBalance]);

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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Create Solana Wallet</h1>

      {publicKey ? (
        <>
          <div>
            <h1>Your Wallet Address:</h1>
            <p>{publicKey}</p>
            <h1>Balance</h1>
            <p>{balance !== null ? `${balance} SOL` : "Loading..."}</p>
          </div>
          <AirdroptoWallet keypair={keypair} />
        </>
      ) : (
        <button onClick={handleCreateWallet}>Create Wallet</button>
      )}
    </div>
  );
};

export default CreateWallet;
