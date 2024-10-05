"use client";

import React, { useEffect, useState } from 'react';
import { Keypair } from '@solana/web3.js';

const CreateWallet: React.FC = () => {
  const [keypair, setKeyPair] = useState<Keypair | null>(null);

  useEffect(() => {
    const savedSecretKey = localStorage.getItem('walletSecretKey');
    if (savedSecretKey) {
      // Convert the stored secret key back to Uint8Array
      const secretKeyArray = JSON.parse(savedSecretKey);
      const restoredKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
      setKeyPair(restoredKeypair);
    }
  }, []);

  const publicKey = keypair ? keypair.publicKey.toBase58() : null;

  const handleCreateWallet = () => {
    if (keypair) {
      alert('A wallet is already generated');
      return;
    }

    // Generate new keypair
    const newKeypair = Keypair.generate();
    const secretKeyArray = Array.from(newKeypair.secretKey); // Store secret key as array

    // Save the secret key in localStorage
    localStorage.setItem('walletSecretKey', JSON.stringify(secretKeyArray));

    // Update state with the new keypair
    setKeyPair(newKeypair);
    alert("Wallet successfully created");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Create Solana Wallet</h1>

      {publicKey ? (
        <div>
          <h2>Your Wallet Address:</h2>
          <p>{publicKey}</p>
        </div>
      ) : (
        <button onClick={handleCreateWallet}>Create Wallet</button>
      )}
    </div>
  );
};

export default CreateWallet;
