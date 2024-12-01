import React from "react";
import img from "../Images/x.png"; // Assuming you have the image imported
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="hero-container overflow-hidden">
      {/* Gradient Background */}
      <div
        className="w-full min-h-screen flex flex-col justify-center"
        style={{
          background: "linear-gradient(180deg, #240d3f, #18092a, black, black)",
        }}
      >
        {/* Hero Content */}
        <div className="container mx-auto pt-40 md:pt-60 p-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative">
          {/* Left Side - Text */}
          <div className="md:w-1/2 space-y-4 text-white z-10 p-4 md:pl-16">
            <h1
              className="font-extrabold text-4xl md:text-5xl lg:text-6xl"
              style={{ fontWeight: 1000 }}
            >
              The Ultimate Tracker of Solana
            </h1>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ fontWeight: 600 }}
            >
              Track your wallet, Create tokens and NFTs, Swap easily between tokens.
            </h2>
            <p className="text-base md:text-lg">
              Solken helps you easily track your wallet and all transactions. You can create your own tokens and NFTs from here. Transfer any type of token from one wallet to another. Swap between tokens easily. Close all the token accounts and get some free money.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <a
                href="/home"
                className="inline-block px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary/90 navbar-button"
              >
                Track Wallet
              </a>
              <a
                href="https://x.com/shibu0x"
                className="inline-block px-6 py-3 text-white rounded-full text-lg font-semibold hover:text-gray-300"
              >
                Contact Me →
              </a>
            </div>
          </div>

          {/* Right Side - Image with Shadow */}
          <div className="md:w-1/2 flex justify-center md:absolute md:right-[-200px] lg:right-[-400px]">
            <div className="w-3/4 md:w-full overflow-hidden">
              <Image
                src={img}
                alt="Solana Feature"
                width={1200}
                height={1200}
                className="rounded-lg shadow-2xl"
                priority={true} // Optimize loading
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
