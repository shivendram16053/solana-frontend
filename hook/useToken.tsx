import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import React, { useContext, useState, createContext, useEffect } from "react";
import { useClusterWallet } from "./useWallet";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddress,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { createInitializeInstruction, createUpdateFieldInstruction, pack, TokenMetadata } from "@solana/spl-token-metadata";

interface Token {
  tokens: {
    address: string;
    amount: string;
    name: string;
    image: string | null;
  }[];
  tokenLoadingError: string | null;
  tokenLoading: boolean;
  createToken: (
    name: string,
    symbol: string,
    initialSupply: number,
    decimals: number,
    imageUrl: string,
    description: string,
    mintAuthority: boolean,
    freezeAuthority: boolean
  ) => Promise<{ success: boolean; result: PublicKey | string }>;
}

const TokenContext = createContext<Token | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { wallet, cluster } = useClusterWallet();
  const { publicKey, connected, signTransaction } =
    useWallet();
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const [tokens, setTokens] = useState<
    { address: string; amount: string; name: string; image: string | null }[]
  >([]);
  const [tokenLoadingError, setLoadingError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);

  //SOLANA TOKEN FETCHING........
  useEffect(() => {
    if (connected || publicKey || wallet) {
      setLoadingError("");
      const fetchTokens = async () => {
        try {
          setTokenLoading(true);
          const pubkey = new PublicKey(wallet);
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            pubkey,
            {
              programId: TOKEN_PROGRAM_ID,
            }
          );

          const tokenList = await Promise.all(
            tokenAccounts.value.map(async (tokenAccountInfo) => {
              const mintAddress =
                tokenAccountInfo.account.data.parsed.info.mint;
              const tokenAmount =
                tokenAccountInfo.account.data.parsed.info.tokenAmount
                  .uiAmountString;

              return {
                address: mintAddress,
                amount: tokenAmount,
                name: "Unknown Token",
                image: null,
              };
            })
          );

          setTokens(tokenList);
          setTokenLoading(false);
        } catch (err: any) {
          setLoadingError(`Failed to fetch tokens: ${err.message}`);
        } finally {
          setTokenLoading(false);
        }
      };

      fetchTokens();
    } else {
      setTokens([]);
      setLoadingError("Connect Your wallet");
      setTokenLoading(false);
    }
  }, [wallet, cluster]);

  const createToken = async (
    name: string,
    symbol: string,
    initialSupply: number,
    decimals: number,
    imageUrl: string,
    description: string,
    mintAuthority: boolean,
    freezeAuthority: boolean
  ): Promise<{ success: boolean; result: PublicKey | string }> => {
    if (connected && publicKey && signTransaction) {
      try {
        const mintKeypair = Keypair.generate();
        const metadata: TokenMetadata = {
          updateAuthority: publicKey,
          mint: mintKeypair.publicKey,
          name: name,
          symbol: symbol,
          uri: imageUrl,
          additionalMetadata: [["description", `${description}`]],
        };
        const freezeAuth = freezeAuthority ? publicKey : null;

        const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
        const metadataLen = pack(metadata).length;
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const lamports = await connection.getMinimumBalanceForRentExemption(
          mintLen + metadataExtension + metadataLen
        );

        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        const transaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
          }),
          createInitializeMetadataPointerInstruction(
            mintKeypair.publicKey,
            publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID
          ),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            decimals,
            publicKey,
            freezeAuth,
            TOKEN_2022_PROGRAM_ID
          ),
          createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            metadata: mintKeypair.publicKey,
            updateAuthority: publicKey,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
          }),
          createUpdateFieldInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            metadata: mintKeypair.publicKey,
            updateAuthority: publicKey,
            field: metadata.additionalMetadata[0][0],
            value: metadata.additionalMetadata[0][1],
          }),
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenAddress,
            publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID
          ),
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAddress,
            publicKey,
            BigInt(initialSupply * 10 ** decimals),
            [],
            TOKEN_2022_PROGRAM_ID
          )
        );

        transaction.feePayer = publicKey;
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;

        const signedTransaction = await signTransaction(transaction);
        signedTransaction.partialSign(mintKeypair);

        const rawTransaction = signedTransaction.serialize();
        const signature = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });

        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        if (confirmation.value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
          );
        }

        console.log(
          `Token created with mint address: ${mintKeypair.publicKey.toString()}`
        );
        return { success: true, result: mintKeypair.publicKey };
      } catch (error) {
        console.error("Error creating token account or minting tokens:", error);
        return {
          success: false,
          result:
            "Error creating token account: " +
            (error instanceof Error ? error.message : String(error)),
        };
      }
    } else {
      return {
        success: false,
        result:
          "Error creating token: Wallet not connected or signTransaction not available",
      };
    }
  };

  return (
    <TokenContext.Provider
      value={{ tokens, tokenLoadingError, tokenLoading, createToken }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error(
      "useClusterWallet must be used within a ClusterWalletProvider"
    );
  }
  return context;
};
