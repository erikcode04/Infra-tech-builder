"use client";
import { useState } from "react";
import { SignupData } from "@/app/types/signup";
export default function LastStep({
    setStep,
    userDetails
}: {
    setStep: (step: number) => void;
    userDetails: SignupData;
}) {
    const [showingPassword, setShowingPassword] = useState(false);

    return (
        <div className="w-full max-w-lg">
            <h2 className="text-4xl font-light mb-12 text-center font-mono">
                Confirm your details
            </h2>
            {/* Display user details and Confirm Button */}
            <div className="flex flex-col gap-4">
                <div className="p-4 bg-transparent border border-gray-600 text-white font-mono">
                    <p><span className="font-medium">Username:</span> {userDetails.username}</p>
                    <button onClick={() => setStep(1)} className="mt-2 text-sm text-gray-400 hover:text-white">
                        Edit
                    </button>
                </div>
                <div className="p-4 bg-transparent border border-gray-600 text-white font-mono">

                    <p><span className="font-medium">Email:</span> {userDetails.email}</p>
                    <button onClick={() => setStep(2)} className="mt-2 text-sm text-gray-400 hover:text-white">
                        Edit
                    </button>
                </div>
                <div className="p-4 bg-transparent border border-gray-600 text-white font-mono">
                    <p>
                        <span className="font-medium">Password:</span>
                        {showingPassword ? userDetails.password : "********"}
                        <button onClick={() => setShowingPassword(!showingPassword)} className="ml-2 text-sm text-gray-400 hover:text-white">
                            {showingPassword ? "Hide" : "Show"}
                        </button>
                    </p>
                    <button onClick={() => setStep(3)} className="mt-2 text-sm text-gray-400 hover:text-white">
                        Edit
                    </button>
                </div>
                <button onClick={() => alert("Signup Complete!")} className="py-4 px-8 bg-white text-black font-medium font-mono tracking-wide hover:bg-gray-200 transition-all duration-200">
                    CONFIRM
                </button>
            </div>
        </div>
    )
}