import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-center items-center h-20">
        <h1 className="text-3xl font-bold">Welcome to Solana Wallet App</h1>
      </header>

      <main className="flex flex-col gap-8 items-center sm:items-start">
        <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition duration-200">
          <Link href={"/createWalletandAirdrop"}>Go to Create Wallet</Link>
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition duration-200">
          <Link href={"/sendSol"}>Send SOL to Another Wallet</Link>
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition duration-200">
          <Link href={"/createTokenandtransfer"}>Create Token and Transfer</Link>
        </button>
      </main>

      <footer className="flex justify-center items-center h-20">
        <p className="text-sm">&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
}
