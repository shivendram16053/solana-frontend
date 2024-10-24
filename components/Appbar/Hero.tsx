import React from "react";
import img from "../Images/x.png"; // Assuming you have the image imported
import Image from "next/image";

const Hero = () => {
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
        <div className="container mx-auto pt-60 p-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative">
          {/* Left Side - Text */}
          <div className="md:w-1/2 pl-16 space-y-4 text-white z-10">
            <h1
              className="font-extrabold"
              style={{ fontSize: "4.5rem", fontWeight: 1000 }}
            >
              The Front Page of Solana
            </h1>
            <h2
              className="text-3xl"
              style={{ fontSize: "1.7rem", fontWeight: 600 }}
            >
              Manage your portfolio, DeFi positions, NFTs, and monitor key Solana Analytics.
            </h2>
            <p className="text-lg">
              Step Finance empowers individuals, businesses, and developers with the tools to manage portfolios,
              analyze data, and foster innovation. We support 95% of Solana protocols, enabling you to track assets,
              make data-driven decisions, and engage with the growing Solana ecosystem.
            </p>
            <div className="flex space-x-4">
              <a
                href="/home/start"
                className="inline-block px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary/90 navbar-button"
              >
                View Your Portfolio
              </a>
              <a
                href="#"
                className="inline-block px-6 py-3 text-white rounded-full text-lg font-semibold hover:text-gray-300"
              >
                Partner With Us →
              </a>
            </div>
          </div>

          {/* Right Side - Image with Shadow */}
          <div className=" absolute right-[-600px]">
            <div className="overflow-hidden">
              <Image
                src={img}
                alt="Solana Feature"
                width={1200}
                height={1200}
                className="rounded-lg shadow-2xl"
                priority={true} // Optimize loading
              ></Image>
            </div>
          </div>
        </div>
      </div>

      <div>
        hello
      </div>
    </div>
  );
};

export default Hero;
