import { createTransferInstruction, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, transfer } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import React, { useState } from "react";

interface TransferTokensProps {
  tokenAddress: string;
}

const TransferTokens: React.FC<TransferTokensProps> = ({ tokenAddress }) => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");



  // Load the wallet's keypair from localStorage
  const getKeypairFromStorage = (): Keypair | null => {
    const secretKeyString = localStorage.getItem("walletSecretKey");
    if (secretKeyString) {
      const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
      return Keypair.fromSecretKey(secretKey);
    }
    return null;
  };


  const handleTransfer = async () => {
    setError(null);
    setTxSignature(null);

    if(!recipient || !amount){
      setError("Reciepent and amount required");
      return;
    }

    const keypair = getKeypairFromStorage();

    if(!keypair){
      setError("No wallet found. Please connect or create your wallet")
    }else{
      try {
        const reciepentAddress = new PublicKey(recipient);
  
        const reciepentTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,keypair,new PublicKey(tokenAddress),reciepentAddress
        )
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,keypair,new PublicKey(tokenAddress),keypair.publicKey
        )

        const tx = new Transaction().add(
          createTransferInstruction(
            senderTokenAccount.address,    
            reciepentTokenAccount.address, 
            keypair.publicKey,             
            parseInt(amount)*1000000000,              
            [],                            
            TOKEN_PROGRAM_ID               
          )
        )

        const signature = await sendAndConfirmTransaction(connection,tx,[keypair])
        setTxSignature(signature)
      } catch (err:any) {
        setError(`Transaction failed: ${err.message}`);

      }
    }

    
    
    console.log(`Transferring ${amount} tokens to ${recipient} from ${tokenAddress}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded">
    <h2 className="text-xl font-semibold mb-4">Transfer {tokenAddress} Tokens</h2>
    {error && <p className="text-red-500">{error}</p>}
    <input
      type="text"
      placeholder="Recipient Address"
      value={recipient}
      onChange={(e) => setRecipient(e.target.value)}
      className="p-2 mb-4 w-full bg-gray-700 rounded"
    />
    <input
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="p-2 mb-4 w-full bg-gray-700 rounded"
    />
    <button
      onClick={handleTransfer}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Send Tokens
    </button>

    {txSignature && (
      <div className="mt-4">
        <h3>Transaction Successful!</h3>
        <a
          href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          View on Solana Explorer
        </a>
      </div>
    )}
  </div>
  );
};

export default TransferTokens;
