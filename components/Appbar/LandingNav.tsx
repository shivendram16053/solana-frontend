"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

// const WalletMultiButton = dynamic(
//   async () =>
//     (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
//   { ssr: false }
// );

const LandingNav = () => {
  return (
    <div
      className="navbar-container absolute w-full p-6 flex items-center justify-between bg-opacity-75 top-0 left-0 z-10"
    >
      <div className="text-xl font-bold">SOLKEN</div>
      <div className="flex space-x-4">
        <Link
          href={"/home/track"}
          className="h-9 md:h-10 px-4 py-3 w-fit rounded-full text-base font-bold flex items-center gap-[2px] bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Track Wallet
        </Link>
        <Link
          href={"/home/create-token"}
          className="h-9 md:h-10 px-4 py-3 w-fit rounded-full text-base font-bold flex items-center gap-[2px] bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create Token
        </Link>
        <Link
          href={"/home/create-nft"}
          className="h-9 md:h-10 px-4 py-3 w-fit rounded-full text-base font-bold flex items-center gap-[2px] bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create NFT
        </Link>
      </div>
      <Link className="flex items-center space-x-4 navbar-button" href={"/home"}>
        Get Started
      </Link>
    </div>
  );
};

export default LandingNav;
