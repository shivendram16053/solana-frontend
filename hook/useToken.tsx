import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import React, { useContext, useState,createContext, useEffect } from 'react'
import { useClusterWallet } from './useWallet';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from "@solana/wallet-adapter-react";


interface Token{
    tokens:{
        address:string,
        amount:string,
        name:string,
    }[];
    tokenError:string | null,
    tokenLoading:boolean

}

const TokenContext = createContext<Token | undefined>(undefined)

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {wallet,cluster} = useClusterWallet();
  const { publicKey, connected } = useWallet();
  const connection = new Connection(clusterApiUrl(cluster),'confirmed');
  const [tokens, setTokens] = useState<
    { address: string; amount: string; name: string }[]
  >([]);
  const [tokenError, setError] = useState<string | null>(null);
  const [tokenLoading,setTokenLoading]= useState<boolean>(false);
  useEffect(()=>{
    if(connected || publicKey || wallet){
      setError("")
      const fetchTokens = async ( )=>{
        try{
          setTokenLoading(true);
          const pubkey = new PublicKey(wallet)
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey,{
            programId:TOKEN_PROGRAM_ID,
          })
    
          const tokenList = tokenAccounts.value.map((tokenAccountInfo)=>{
            const mintAddress=tokenAccountInfo.account.data.parsed.info.mint;
            const tokenAmount=tokenAccountInfo.account.data.parsed.info.tokenAmount.uiAmountString;
            const tokenName= "Unknown Token";
    
            return{
              address:mintAddress,
              amount:tokenAmount,
              name:tokenName,
            }
          })
    
          setTokens(tokenList);  
          setTokenLoading(false);    
        }catch (err: any) {
          setError(`Failed to fetch tokens: ${err.message}`);
        }finally{
          setTokenLoading(false);
        }
      }
  
      fetchTokens();
    }else{
      setTokens([]);
      setError("Connect Your wallet");
      setTokenLoading(false)
    }
  },[wallet,cluster])





  return (
    <TokenContext.Provider value={{tokens,tokenError,tokenLoading}}>
        {children}
    </TokenContext.Provider>
  )
}

export const useTokens = ()=>{
    const context = useContext(TokenContext);
    if(!context){
        throw new Error("useClusterWallet must be used within a ClusterWalletProvider");
  }
  return context;
}