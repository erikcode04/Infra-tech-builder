"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-wide mb-4">
            Welcome to <span className="font-medium">AppInfra</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Infrastructure automation platform
          </p>
        </div>

        {/* Authentication Section */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          {/* Login Button */}
          <button className="flex-1 py-4 px-8 bg-transparent border border-white text-white font-medium tracking-wide transition-all duration-200 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black">
            LOGIN
          </button>

          {/* Signup Button */}
          <Link href="/signup" className="flex-1 py-4 px-8 bg-white text-black font-medium tracking-wide transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black">
            SIGN UP
          </Link>
        </div>

        {/* Footer text */}
        <div className="mt-24 text-center">
          <p className="text-sm text-gray-500 font-light">
            Build. Deploy. Scale.
          </p>
        </div>
      </div>
    </div>
  );
}
