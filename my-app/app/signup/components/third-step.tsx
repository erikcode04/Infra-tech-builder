"use client"
import { useState } from "react";


export default function ThirdStep({ setStep, userDetails, setUserDetails }: any) {
    return (
        <div className="w-full max-w-lg">
            <h2 className="text-4xl font-light mb-12 text-center font-mono">
                Set your password
            </h2>
            {/* Input Form with Next Button */}
            <div className="flex flex-col gap-4">
                <input
                    value={userDetails.password}
                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                    type="password"
                    placeholder="Password"
                    className="w-full p-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-200 font-mono"
                />
                <input
                    value={userDetails.confirmPassword}
                    onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value })}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-200 font-mono"
                />
                <button onClick={() => setStep(4)} className="py-4 px-8 bg-white text-black font-medium font-mono tracking-wide hover:bg-gray-200 transition-all duration-200">
                    NEXT
                </button>
            </div>
        </div>
    )
}