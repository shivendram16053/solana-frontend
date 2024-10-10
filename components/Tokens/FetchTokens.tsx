import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Link from "next/link";

interface FetchTokensProps {
  publicKey: string;
  fetchTrigger:boolean;
}

const FetchTokens: React.FC<FetchTokensProps> = ({
  publicKey,
 fetchTrigger,
}) => {
  const [tokens, setTokens] = useState<
    { address: string; amount: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  useEffect(() => {
    const fetchTokens = async () => {
      if (!fetchTrigger) return; // Do not fetch unless triggered

      setLoading(true);
      setError(null);

      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          new PublicKey(publicKey),
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        const tokenList = tokenAccounts.value.map((tokenAccountInfo) => {
          const mintAddress = tokenAccountInfo.account.data.parsed.info.mint;
          const tokenAmount =
            tokenAccountInfo.account.data.parsed.info.tokenAmount
              .uiAmountString;

          const tokenName = "Unknown Token"; // Placeholder for token name

          return {
            address: mintAddress,
            amount: tokenAmount,
            name: tokenName,
          };
        });

        setTokens(tokenList);
      } catch (err: any) {
        setError(`Failed to fetch tokens: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [fetchTrigger, publicKey]); // Fetch tokens when fetchTrigger is true


  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">
        Tokens for Public Key: {publicKey.toString()}
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {tokens.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border-separate border-spacing-2 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left">Token Name</th>
                <th className="p-3 text-left">Token Address</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index} className="bg-gray-900">
                  <td className="p-3">{token.name || "Unknown Token"}</td>
                  <td className="p-3">
                    <a
                      href={`https://explorer.solana.com/address/${token.address}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {token.address}
                    </a>
                  </td>
                  <td className="p-3">{token.amount}</td>
                  <td className="p-3">
                    <Link href={`/transfertoken/${token.address}`}>
                      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        Transfer
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4">No tokens found for this public key.</p>
      )}
    </div>
  );
};

export default FetchTokens;
