import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface FetchTokensProps {
  publicKey: String;
}

const FetchTokens: React.FC<FetchTokensProps> = ({ publicKey }) => {
  const [tokens, setTokens] = useState<{ address: string; amount: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed'); // You can adjust the network to devnet or mainnet as needed

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch token accounts owned by the public key
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          new PublicKey(publicKey),
          { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        );

        // Map token account info to get mint address and amount
        const tokenList = tokenAccounts.value.map((tokenAccountInfo) => ({
          address: tokenAccountInfo.account.data.parsed.info.mint,
          amount: tokenAccountInfo.account.data.parsed.info.tokenAmount.uiAmountString, // Get the UI-friendly amount
        }));

        setTokens(tokenList);
      } catch (err: any) {
        setError(`Failed to fetch tokens: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey]);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Tokens for Public Key: {publicKey.toString()}</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mt-8">Your Tokens:</h2>
      {tokens.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {tokens.map((token, index) => (
            <li key={index} className="flex justify-between bg-gray-800 p-2 rounded">
              <a
                href={`https://explorer.solana.com/address/${token.address}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {token.address}
              </a>
              <span>{token.amount} tokens</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No tokens found for this public key.</p>
      )}
    </div>
  );
};

export default FetchTokens;
