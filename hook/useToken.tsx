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
  AccountLayout,
  AuthorityType,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  ExtensionType,
  getAssociatedTokenAddress,
  getMint,
  getMintLen,
  getTokenMetadata,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

interface Token {
  tokens: {
    address: string;
    amount: string;
    symbol:string;
    name: string;
    uri: string | null;
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
  const { publicKey, connected, signTransaction } = useWallet();
  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const [tokens, setTokens] = useState<
    { address: string; amount: string;symbol:string; name: string; uri: string | null }[]
  >([]);
  const [tokenLoadingError, setLoadingError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);

  const fetchToken = async () => {
  
    setTokenLoading(true);
    setLoadingError(null);
  
    try {
      const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(wallet), {
        programId: TOKEN_2022_PROGRAM_ID,
      });
  
      const tokensList = await Promise.all(
        tokenAccounts.value.map(async ({ pubkey, account }) => {
          try {
            const accountInfo = AccountLayout.decode(account.data);
            const mintAddress = new PublicKey(accountInfo.mint);
            const metadata = await getTokenMetadata(connection, mintAddress);
            const mintInfo = await connection.getParsedAccountInfo(mintAddress) as any;

            const decimals =
            mintInfo.value?.data?.parsed?.info?.decimals || 0;

          // Format the amount by removing decimals
          const formattedAmount = (BigInt(accountInfo.amount) / BigInt(10 ** decimals)).toString();


              
            return {
              address: pubkey.toString(),
              amount: formattedAmount,
              symbol:metadata?.symbol,
              name: metadata?.name || "Unknown Token",
              uri: metadata?.uri || null,
            };
          } catch (metadataError) {
            console.error(`Error fetching metadata for account ${pubkey}:`, metadataError);
            return null;
          }
        })
      );
  
      const validTokens = tokensList.filter(
        (token): token is {
          address: string;
          amount: string;
          symbol:string;
          name: string;
          uri: string | null;
        } => token !== null
      );

      setTokens(validTokens);
    } catch (err) {
      console.error("Error fetching token accounts:", err);
      setLoadingError("Failed to load tokens. Please try again.");
    } finally {
      setTokenLoading(false);
    }
  };
  

  useEffect(() => {
    if(connected||wallet){
      fetchToken();
    }
    else{
      setTokens([])
      setLoadingError("Connect Wallet")
    }
  }, [wallet,cluster]);

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
            updateAuthority: mintKeypair.publicKey,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
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

        if (!mintAuthority) {
          transaction.add(
            createSetAuthorityInstruction(
              mintKeypair.publicKey,
              publicKey,
              AuthorityType.MintTokens,
              null,
              [],
              TOKEN_2022_PROGRAM_ID
            )
          );
        }

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
