"use client";

import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

const CreateTokenPage: React.FC = () => {
    const { connected, publicKey } = useWallet();
    const [tokenName, setTokenName] = useState<string>('');
    const [symbol, setSymbol] = useState<string>('');
    const [initialSupply, setInitialSupply] = useState<number | ''>('');

    if (!connected || !publicKey) {
        return (
            <div>
                <h1>Connect your wallet first</h1>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your logic here to handle the token creation
        console.log('Token Name:', tokenName);
        console.log('Symbol:', symbol);
        console.log('Initial Supply:', initialSupply);
        console.log('Public Key:', publicKey.toString());
    };

    return (
        <div>
            <h1>Create Token</h1>
            <p>Connected Wallet: {publicKey.toString()}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Token Name:</label>
                    <input
                        type="text"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Symbol:</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Initial Supply:</label>
                    <input
                        type="number"
                        value={initialSupply}
                        onChange={(e) => setInitialSupply(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                    />
                </div>
                <button type="submit">Create Token</button>
            </form>
        </div>
    );
};

export default CreateTokenPage;
