"use client";
import { SignupData } from "@/app/types/signup";
import { useState, useEffect } from "react";
import inspectAllInformation from "../utils/key-to-last";
import { userDetailGuard } from "../utils/userdetail-guard";
import { validateEmail } from "@/utils/email-validation";
import EmailInput from "@/components/EmailInput";

export default function SecondStep({
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
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'taken' | null>(null);

    const checkEmailAvailability = async () => {
        if (!userDetails.email) {
            setHasAllSteps(false);
            setAvailabilityStatus(null);
            return;
        }

        // First check local validation
        const localValidation = validateEmail(userDetails.email);
        if (!localValidation.isValid) {
            setHasAllSteps(false);
            setAvailabilityStatus(null);
            return;
        }

        // Then check server availability
        setIsCheckingAvailability(true);
        try {
            const details = { email: userDetails.email };
            const isAvailable = await userDetailGuard(details);

            if (isAvailable) {
                setAvailabilityStatus('available');
                const allInfoPresent = inspectAllInformation({ ...userDetails, email: userDetails.email });
                setHasAllSteps(allInfoPresent);
            } else {
                setAvailabilityStatus('taken');
                setHasAllSteps(false);
            }
        } catch (error) {
            console.error('Error checking email availability:', error);
            setAvailabilityStatus(null);
            setHasAllSteps(false);
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            checkEmailAvailability();
        }, 500); // Debounce API calls

        return () => clearTimeout(timeoutId);
    }, [userDetails.email]);


    return (
        <div className="w-full max-w-lg">
            <h2 className="text-4xl font-light mb-12 text-center font-mono">
                Enter your email
            </h2>

            <div className="space-y-6">
                {/* Email Input with Validation */}
                <div>
                    <EmailInput
                        value={userDetails.email}
                        onChange={(value) => setUserDetails({ ...userDetails, email: value })}
                        placeholder="Email"
                        showValidation={true}
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
                            Email is already registered
                        </p>
                    )}

                    {availabilityStatus === 'available' && (
                        <p className="mt-2 text-green-400 text-sm font-mono flex items-center">
                            <span className="mr-2">✓</span>
                            Email is available
                        </p>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => hasAllSteps ? setStep(4) : setStep(3)}
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