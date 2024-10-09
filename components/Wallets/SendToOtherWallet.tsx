"use client";

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';

const SendToOtherWallet = () => {
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [keypair, setKeyPair] = useState<Keypair | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  useEffect(() => {
    const savedSecretKey = localStorage.getItem("walletSecretKey");
    if (savedSecretKey) {
      const secretKeyArray = JSON.parse(savedSecretKey);
      const restoredKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
      setKeyPair(restoredKeypair);
    }
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSignature(null); // Clear previous success state

    if (!wallet || !amount) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      const sendpublickey = new PublicKey(wallet);

      if (!PublicKey.isOnCurve(sendpublickey.toBytes())) {
        setError('Please provide a valid public key');
        setSubmitting(false);
        return;
      }

      if (keypair) {
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: sendpublickey,
            lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
          })
        );

        const sendSignature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        setSignature(sendSignature); // Set success state
      }
    } catch (error: any) {
      setError("Transaction failed: " + error.message);
    } finally {
      setSubmitting(false); // Stop loading
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label>Enter wallet address to send SOL:</label>
          <input
            type='text'
            placeholder='Enter wallet address'
            name='wallet'
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className='border rounded p-2 text-black'
          />
        </div>

        <div className='mb-4'>
          <label>Enter the amount of SOL:</label>
          <input
            type='number'
            placeholder='Enter the amount of SOL'
            name='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='border rounded p-2 text-black'
          />
        </div>

        {error && (
          <div className='text-red-500'>
            <h2>Transaction Failed</h2>
            <p>{error}</p>
          </div>
        )}

        {signature && (
          <div className='text-green-500'>
            <h2>Transaction Sent</h2>
            <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
              Check on Explorer
            </a>
          </div>
        )}

        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded' disabled={submitting}>
          {submitting ? 'Submitting...' : 'Send SOL'}
        </button>
      </form>
    </div>
  );
};

export default SendToOtherWallet;
