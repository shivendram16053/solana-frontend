"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokens } from "@/hook/useToken";
import { PinataSDK } from "pinata-web3";


const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
})



const CreateTokenPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { createToken } = useTokens();
  const [tokenName, setTokenName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [initialSupply, setInitialSupply] = useState<number>(1000);
  const [decimals, setDecimals] = useState<number>(6);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [mintAuthority, setMintAuthority] = useState<boolean>(false);
  const [freezeAuthority, setFreezeAuthority] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  if (!connected || !publicKey) {
    return (
      <div>
        <h1>Connect your wallet first</h1>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!imageFile) {
        setError("Image is necessary");
        throw new Error("Image file is required");
      }


      const uploadImage = await pinata.upload.file(imageFile);
      const imageUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${uploadImage.IpfsHash}`;

      const tokenJSONfile= {
        "name": `${tokenName}`,
        "symbol": `${symbol}`,
        "description": `${description}`,
        "image": `${imageUrl}`
      }

      const uploadTokenData = await pinata.upload.json(tokenJSONfile);
      const tokenURI = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${uploadTokenData.IpfsHash}`;


      const result = await createToken(
        tokenName,
        symbol,
        initialSupply,
        decimals,
        tokenURI,
        description,
        mintAuthority,
        freezeAuthority
      );

      if (result.success) {
        setSuccess(`Token Created Successfully: ${result.result.toString()}`);
        console.log("Token Created Successfully:", result.result.toString());
      } else {
        setError(`Failed to create token: ${result.result}`);
        console.error("Failed to create token:", result.result);
      }
    } catch (error) {
      setError(`Error creating token: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Error creating token:", error);
    }
  };

  return (
    <div>
      <h1>Create Token</h1>
      <p>Connected Wallet: {publicKey.toString()}</p>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Token Name:</label>
          <input
          className="text-black"
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Symbol:</label>
          <input
          className="text-black"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Initial Supply:</label>
          <input
          className="text-black"
            type="number"
            value={initialSupply}
            placeholder="Default is 1000"
            onChange={(e) =>
              setInitialSupply(
                Number(e.target.value)
              )
            }
            required
          />
        </div>
        <div>
          <label>Decimals (min : 0 & max : 9):</label>
          <input
          className="text-black"
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            min={0}
            max={9}
            required
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
          className="text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div>

        <div>
          <label>
            Mint Authority
            <input
          className="text-black"
              type="checkbox"
              checked={mintAuthority}
              onChange={(e) => setMintAuthority(e.target.checked)}
            />
          </label>
        </div>

        <div>
          <label>
            Freeze Authority
            </label>
            <input
          className="text-black"
              type="checkbox"
              checked={freezeAuthority}
              onChange={(e) => setFreezeAuthority(e.target.checked)}
            />
        </div>

        </div>
        <button type="submit">
          create token
        </button>
      </form>
    </div>
  );
};

export default CreateTokenPage;
