"use client"
import { useState, useEffect } from "react";
import { SignupData } from "@/app/types/signup";
import { validatePassword } from "@/utils/password-validation";
import PasswordInput from "@/components/PasswordInput";

export default function ThirdStep({
    setStep,
    userDetails,
    setUserDetails,
    hasAllSteps,
    setHasAllSteps
}: {
    setStep: (step: number) => void;
    userDetails: SignupData;
    setUserDetails: (details: SignupData) => void;
    hasAllSteps: boolean;
    setHasAllSteps: (hasAll: boolean) => void;
}) {
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

    useEffect(() => {
        // Check if passwords match
        const match = userDetails.password === userDetails.confirmPassword;
        setPasswordsMatch(match);

        // Check overall validity
        const passwordValidation = validatePassword(userDetails.password);
        const isValid = passwordValidation.isValid && match && userDetails.password.length > 0;

        // Update parent component about validation status
        if (hasAllSteps !== isValid) {
            setHasAllSteps(isValid);
        }
    }, [userDetails.password, userDetails.confirmPassword]);

    return (
        <div className="w-full max-w-lg">
            <h2 className="text-4xl font-light mb-12 text-center font-mono">
                Set your password
            </h2>

            <div className="flex flex-col gap-6">
                {/* Password Input with Validation */}
                <div>
                    <PasswordInput
                        value={userDetails.password}
                        onChange={(value) => setUserDetails({ ...userDetails, password: value })}
                        placeholder="Password"
                        showStrength={true}
                        showRequirements={true}
                    />
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <input
                        value={userDetails.confirmPassword}
                        onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value })}
                        type="password"
                        placeholder="Confirm Password"
                        className={`w-full p-4 bg-transparent border text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 font-mono ${userDetails.confirmPassword && !passwordsMatch
                                ? 'border-red-400 focus:border-red-400'
                                : 'border-gray-600 focus:border-white'
                            }`}
                    />

                    {/* Password Match Indicator */}
                    {userDetails.confirmPassword && (
                        <div className="mt-2">
                            {passwordsMatch ? (
                                <p className="text-green-400 text-sm font-mono flex items-center">
                                    <span className="mr-2">✓</span>
                                    Passwords match
                                </p>
                            ) : (
                                <p className="text-red-400 text-sm font-mono flex items-center">
                                    <span className="mr-2">×</span>
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => hasAllSteps ? setStep(4) : null}
                    disabled={!hasAllSteps}
                    className={`py-4 px-8 font-medium font-mono tracking-wide transition-all duration-200 ${hasAllSteps
                            ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    NEXT
                </button>
            </div>
        </div>
    )
}