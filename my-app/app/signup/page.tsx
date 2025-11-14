"use client";
import { useState } from "react";
import Firststep from "./components/first-step";
import SecondStep from "./components/second-step";
import ThirdStep from "./components/third-step";

export default function SignupPage() {
    const [step, setStep] = useState(0);
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        password: ""
    });
    return (
        <div className="min-h-screen bg-black text-white font-mono">
            {step === 0 &&
                <div className="flex flex-col items-center justify-center min-h-screen px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-6xl font-light tracking-wide mb-4">
                            Create your <span className="font-medium">AppInfra</span> account
                        </h1>
                        <p className="text-xl text-gray-400 font-light">
                            Start your journey with us
                        </p>
                        <button
                            onClick={() => setStep(1)}
                            className="mt-8 py-4 px-8 bg-white text-black font-medium tracking-wide transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                            GET STARTED
                        </button>
                    </div>
                </div>}
            {step === 1 &&
                <div className="min-h-screen p-8">
                    {/* Header with Go Back and Progress Indicator */}
                    <div className="flex justify-between items-start mb-12">
                        {/* Go Back Button - Top Left */}
                        <button
                            onClick={() => setStep(1)}
                            className="text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm tracking-wide"
                        >
                            ← GO BACK
                        </button>

                        {/* Progress Indicator - Top Right */}
                        <div className="flex flex-col gap-3">
                            <div className="w-2 h-2 bg-white rounded-full"></div> {/* Current step */}
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <Firststep setStep={setStep} userDetails={userDetails} setUserDetails={setUserDetails} />
                    </div>
                </div>}
            {step === 2 && <div className="min-h-screen p-8">
                {/* Header with Go Back and Progress Indicator */}
                <div className="flex justify-between items-start mb-12">
                    {/* Go Back Button - Top Left */}
                    <button
                        onClick={() => setStep(1)}
                        className="text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm tracking-wide"
                    >
                        ← GO BACK
                    </button>
                    {/* Progress Indicator - Top Right */}
                    <div className="flex flex-col gap-3">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <SecondStep setStep={setStep} userDetails={userDetails} setUserDetails={setUserDetails} />
                </div>
            </div>}
            {step === 3 && <div className="min-h-screen p-8">
                {/* Header with Go Back and Progress Indicator */}
                <div className="flex justify-between items-start mb-12">
                    {/* Go Back Button - Top Left */}
                    <button
                        onClick={() => setStep(2)}
                        className="text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm tracking-wide"
                    >
                        ← GO BACK
                    </button>
                    {/* Progress Indicator - Top Right */}
                    <div className="flex flex-col gap-3">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <ThirdStep setStep={setStep} userDetails={userDetails} setUserDetails={setUserDetails} />
                </div>
            </div>}


        </div>)
}