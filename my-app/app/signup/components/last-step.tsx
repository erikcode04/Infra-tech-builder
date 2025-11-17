"use client";
import { useState } from "react";
import { SignupData } from "@/app/types/signup";
import axios from "axios";

interface AccountCreationResult {
    success: boolean;
    message: string;
    data?: {
        userId: string;
        username: string;
        email: string;
        createdAt: string;
    };
    errors?: string[];
}

export default function LastStep({
    setStep,
    userDetails
}: {
    setStep: (step: number) => void;
    userDetails: SignupData;
}) {
    const [showingPassword, setShowingPassword] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [creationResult, setCreationResult] = useState<AccountCreationResult | null>(null);

    const createAccount = async () => {
        setIsCreating(true);
        setCreationResult(null);

        try {
            console.log('🚀 Creating account with details:', {
                username: userDetails.username,
                email: userDetails.email,
                // Don't log password for security
            });

            const response = await axios.post('/api/account-building/create-account', {
                username: userDetails.username,
                email: userDetails.email,
                password: userDetails.password,
                confirmPassword: userDetails.confirmPassword
            });

            console.log('✅ Account creation successful:', response.data);
            setCreationResult(response.data);

        } catch (error) {
            console.error('❌ Account creation failed:', error);

            if (axios.isAxiosError(error) && error.response) {
                // Server responded with an error
                setCreationResult(error.response.data);
            } else {
                // Network or other error
                setCreationResult({
                    success: false,
                    message: 'Failed to create account',
                    errors: ['Network error. Please check your connection and try again.']
                });
            }
        } finally {
            setIsCreating(false);
        }
    };

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
                {/* Account Creation Results */}
                {creationResult && (
                    <div className={`p-4 border rounded font-mono text-sm ${creationResult.success
                            ? 'border-green-400 bg-green-400/10 text-green-400'
                            : 'border-red-400 bg-red-400/10 text-red-400'
                        }`}>
                        {creationResult.success ? (
                            <div>
                                <p className="flex items-center font-medium">
                                    <span className="mr-2">✅</span>
                                    {creationResult.message}
                                </p>
                                {creationResult.data && (
                                    <div className="mt-2 text-xs space-y-1">
                                        <p>User ID: {creationResult.data.userId}</p>
                                        <p>Created: {new Date(creationResult.data.createdAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p className="flex items-center font-medium">
                                    <span className="mr-2">❌</span>
                                    {creationResult.message}
                                </p>
                                {creationResult.errors && creationResult.errors.length > 0 && (
                                    <ul className="mt-2 text-xs space-y-1">
                                        {creationResult.errors.map((error, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{error}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {creationResult?.success ? (
                        // Account created successfully - show completion options
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-4 px-8 bg-white text-black font-medium font-mono tracking-wide hover:bg-gray-200 transition-all duration-200"
                            >
                                GO TO APP
                            </button>
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="w-full py-4 px-8 bg-transparent border border-white text-white font-medium font-mono tracking-wide hover:bg-white hover:text-black transition-all duration-200"
                            >
                                LOGIN NOW
                            </button>
                        </div>
                    ) : (
                        // Show create account button
                        <button
                            onClick={createAccount}
                            disabled={isCreating}
                            className={`w-full py-4 px-8 font-medium font-mono tracking-wide transition-all duration-200 ${isCreating
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                                }`}
                        >
                            {isCreating ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>
                    )}

                    {/* Retry button if there was an error */}
                    {creationResult && !creationResult.success && !isCreating && (
                        <button
                            onClick={() => setCreationResult(null)}
                            className="w-full py-2 px-4 bg-transparent border border-gray-600 text-gray-400 font-medium font-mono text-sm tracking-wide hover:border-white hover:text-white transition-all duration-200"
                        >
                            TRY AGAIN
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}