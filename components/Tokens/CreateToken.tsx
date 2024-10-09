"use client";

import { createMint } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import React, { useEffect, useState } from 'react'

const CreateToken =async  () => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");
    const [error,setError]=useState<string | null>(null);
    const [keypair,setKeypair]=useState<Keypair | null>(null);
    
    useEffect(() => {
        const savedSecretKey = localStorage.getItem("walletSecretKey");
        if(!savedSecretKey){
            setError("Create or Connect a wallet first")
        }
        if (savedSecretKey) {
          const secretKeyArray = JSON.parse(savedSecretKey);
          const restoredKeypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
          setKeypair(restoredKeypair);
        }
    }, []);


    const handleTokenCreation = async ()=>{
        if(keypair){
            const token = await createMint(
                connection,
                keypair,
                keypair.publicKey,
                null,
                9
            )

            
        }
    }

   
    
  return (
    <div>CreateToken</div>
  )
}

export default CreateToken