import React from "react";
import solana from "../Images/Solana.png";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div>
      <div className="max-w-3xl lg:max-w-7xl mx-auto p-6 flex items-center h-[75vh] justify-between">
        {/* Left Side: Text */}
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn Solana Frontend
          </h1>
          <p className="text-lg md:text-xl mb-4">
            Start from basics to advanced, not only code but also the demo of
            each and how it works.
          </p>
          <Link
            href={"/basics"}
            className="h-9 md:h-10 px-4 py-3 w-fit rounded-full text-sm font-medium flex items-center gap-[2px] text-black bg-white hover:bg-gray-200"
          >
            Get Started
          </Link>
        </div>

        {/* Right Side: Logo */}
        <div className="md:w-1/2 w-full flex justify-center md:justify-end md:mt-0">
          <Image src={solana} height={300} width={400} alt="Solana" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex justify-center items-center gap-10 max-w-3xl lg:max-w-7xl mx-auto mt-10">
        {/* Basics Card */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg h-auto w-[30%] text-center hover:shadow-xl transition-shadow">
          <h1 className="text-xl font-bold mb-4">Start from Basics</h1>
          <p className="text-md mb-4">
            Get started with the fundamentals of Solana, setting up your environment, and learning the basics of frontend integration.
          </p>
          <Link href="/basics" className="text-sm text-white underline">
            Learn Basics
          </Link>
        </div>

        {/* Intermediate Card */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg h-auto w-[30%] text-center hover:shadow-xl transition-shadow">
          <h1 className="text-xl font-bold mb-4">Learn Intermediate</h1>
          <p className="text-md mb-4">
            Move to the next level by diving deeper into wallet integration, transaction handling, and frontend dApp logic.
          </p>
          <Link href="/intermediate" className="text-sm text-white underline">
            Learn Intermediate
          </Link>
        </div>

        {/* Advanced Card */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg h-auto w-[30%] text-center hover:shadow-xl transition-shadow">
          <h1 className="text-xl font-bold mb-4">Be an Advanced Developer</h1>
          <p className="text-md mb-4">
            Master the art of building sophisticated dApps, optimize performance, and work with advanced Solana features.
          </p>
          <Link href="/advanced" className="text-sm text-white underline">
            Learn Advanced
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom pt-10 left-1/2 transform -translate-x-1/2 text-white">
        Contact me on{" "}
        <Link
          className="text-orange-300 underline"
          href={"https://x.com/shibu0x"}
        >
          Twitter
        </Link>
      </div>
    </div>
  );
};

export default Hero;
