"use client";

import React, { useState } from "react";
import { Connection, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";

interface AirdropToWalletProps {
  keypair: Keypair | null;
}

const AirdroptoWallet: React.FC<AirdropToWalletProps> = ({ keypair }) => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAirdrop = async () => {
    if (!keypair) {
      alert("Please create a wallet first.");
      return;
    }

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    setStatus("Requesting airdrop...");
    try {
      const signature = await connection.requestAirdrop(
        keypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );

      // Confirm the transaction
      await connection.confirmTransaction(signature);
      setStatus("Airdrop successful! 2 SOL added to your wallet.");
    } catch (error:any) {
      console.error("Airdrop failed:", error);
      setStatus(`Airdrop failed: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleAirdrop}>Airdrop 2 SOL</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default AirdroptoWallet;
