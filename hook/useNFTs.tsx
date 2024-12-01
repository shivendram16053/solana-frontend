import React, { createContext, useContext, useEffect, useState } from 'react'
import { useClusterWallet } from './useWallet';
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import {Metaplex, Pda } from '@metaplex-foundation/js';


interface NFTs{
    nfts:{
        name:string,
        uri:string,
        symbol:string,
        address:PublicKey|Pda,
    }[],
    NFTError:string|null,
    NFTLoading:boolean,
}

const NFTContext = createContext<NFTs | undefined>(undefined);

export const NFTProvider:React.FC<{children:React.ReactNode}>= ({children}) => {
 
    const {wallet,cluster}=useClusterWallet();
    const { publicKey, connected } = useWallet();
    const [nfts,setNfts]=useState<{name:string,uri:string,symbol:string,address:PublicKey|Pda}[]>([]);
    const [NFTError,setNftError]= useState<string | null>(null);
    const [NFTLoading,setNftLoading]= useState<boolean>(false);
    const connection = new Connection(clusterApiUrl(cluster),'confirmed');

    useEffect(()=>{
        if(connected || publicKey || wallet){
            setNftError("");
            const fetchNFTs = async ()=>{
                try{
                    setNftLoading(true);
                    const pubkey = new PublicKey(wallet);
                const metaplex = Metaplex.make(connection)
                const fetchedNFTs = await metaplex.nfts().findAllByOwner({owner:pubkey});

                const nftList = fetchedNFTs.map((NftInfo)=>{
                    return{
                      address : NftInfo.address,
                      name : NftInfo.name,
                      uri : NftInfo.uri,
                      symbol: NftInfo.symbol,
                    }                    
                })

                setNfts(nftList);
                setNftLoading(false);
                }catch(err:any){
                 setNftError(`Failed to fetch tokens : ${err.message}`)
                }finally{
                    setNftLoading(false);
                }

                
            }

            fetchNFTs();
        }else{
            setNfts([]);
            setNftError("Connect your wallet");
            setNftLoading(false);
        }
    },[wallet,cluster,connected])


  return (
    <NFTContext.Provider value={{nfts,NFTError,NFTLoading}}>
        {children}
    </NFTContext.Provider>
  )
}

export const useNFTs = ()=>{
    const context = useContext(NFTContext);
    if(!context){
        throw new Error("useClusterWallet must be used within a ClusterWalletProvider");
  }
  return context;
}