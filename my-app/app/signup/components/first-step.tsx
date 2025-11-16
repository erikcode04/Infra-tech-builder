"use client";
import { SignupData } from "@/app/types/signup";
import { useState, useEffect } from "react";
import { userDetailGuard } from "../utils/userdetail-guard";
import { validateUsername } from "@/utils/username-validation";
import inspectAllInformation from "../utils/key-to-last";
import UsernameInput from "@/components/UsernameInput";

export default function Firststep({
    setStep,
    userDetails,
    setUserDetails,
    hasAllSteps,
    setHasAllSteps
}: {
    setStep: (step: number) => void;
    userDetails: SignupData;
    setUserDetails: (data: SignupData) => void;
    hasAllSteps: boolean;
    setHasAllSteps: (hasAll: boolean) => void;
}) {
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'taken' | null>(null);

    const checkUsernameAvailability = async () => {
        if (!userDetails.username) {
            setHasAllSteps(false);
            setAvailabilityStatus(null);
            return;
        }

        // First check local validation
        const localValidation = validateUsername(userDetails.username);
        if (!localValidation.isValid) {
            setHasAllSteps(false);
            setAvailabilityStatus(null);
            return;
        }

        // Then check server availability
        setIsCheckingAvailability(true);
        try {
            const details = { username: userDetails.username };
            const isAvailable = await userDetailGuard(details);

            if (isAvailable) {
                setAvailabilityStatus('available');
                const allInfoPresent = inspectAllInformation({ ...userDetails, username: userDetails.username });
                setHasAllSteps(allInfoPresent);
            } else {
                setAvailabilityStatus('taken');
                setHasAllSteps(false);
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
            setAvailabilityStatus(null);
            setHasAllSteps(false);
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            checkUsernameAvailability();
        }, 500); // Debounce API calls

        return () => clearTimeout(timeoutId);
    }, [userDetails.username]);



    return (
        <div className="w-full max-w-lg">
            <h2 className="text-4xl font-light mb-12 text-center font-mono">
                Choose a username
            </h2>

            <div className="space-y-6">
                {/* Username Input with Validation */}
                <div>
                    <UsernameInput
                        value={userDetails.username}
                        onChange={(value) => setUserDetails({ ...userDetails, username: value })}
                        placeholder="Username"
                        showValidation={true}
                        showRequirements={true}
                    />

                    {/* Availability Status */}
                    {isCheckingAvailability && (
                        <p className="mt-2 text-yellow-400 text-sm font-mono flex items-center">
                            <span className="mr-2">⏳</span>
                            Checking availability...
                        </p>
                    )}

                    {availabilityStatus === 'taken' && (
                        <p className="mt-2 text-red-400 text-sm font-mono flex items-center">
                            <span className="mr-2">×</span>
                            Username is already taken
                        </p>
                    )}

                    {availabilityStatus === 'available' && (
                        <p className="mt-2 text-green-400 text-sm font-mono flex items-center">
                            <span className="mr-2">✓</span>
                            Username is available
                        </p>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => hasAllSteps ? setStep(4) : setStep(2)}
                    disabled={!hasAllSteps || isCheckingAvailability}
                    className={`w-full py-4 px-8 font-medium font-mono tracking-wide transition-all duration-200 ${hasAllSteps && !isCheckingAvailability
                            ? 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isCheckingAvailability ? 'CHECKING...' : 'NEXT'}
                </button>
            </div>
        </div>
    )
}
