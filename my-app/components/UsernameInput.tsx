"use client";

import { useState, useEffect } from 'react';
import {
    validateUsername,
    getUsernameValidationColor,
    getUsernameRequirementsList,
    UsernameValidation,
    UsernameRequirements
} from '@/utils/username-validation';

interface UsernameInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showValidation?: boolean;
    showRequirements?: boolean;
    requirements?: Partial<UsernameRequirements>;
}

export default function UsernameInput({
    value,
    onChange,
    placeholder = "Username",
    showValidation = true,
    showRequirements = true,
    requirements = {}
}: UsernameInputProps) {
    const [validation, setValidation] = useState<UsernameValidation | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (value) {
            setValidation(validateUsername(value, requirements));
        } else {
            setValidation(null);
        }
    }, [value, requirements]);

    const requirementsList = getUsernameRequirementsList(requirements);

    return (
        <div className="w-full">
            {/* Username Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className={`w-full p-4 bg-transparent border text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 font-mono ${validation && !validation.isValid && value
                        ? 'border-red-400 focus:border-red-400'
                        : validation && validation.isValid && value
                            ? 'border-green-400 focus:border-green-400'
                            : 'border-gray-600 focus:border-white'
                    }`}
            />

            {/* Validation Messages */}
            {showValidation && validation && value && (
                <div className="mt-3">
                    {validation.isValid ? (
                        <p className="text-green-400 text-sm font-mono flex items-center">
                            <span className="mr-2">✓</span>
                            Username is available
                        </p>
                    ) : (
                        <div>
                            {/* Error Messages */}
                            <ul className="space-y-1">
                                {validation.errors.map((error, index) => (
                                    <li key={index} className="text-red-400 text-sm font-mono flex items-start">
                                        <span className="mr-2">×</span>
                                        <span>{error}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Suggestions */}
                            {validation.suggestions && validation.suggestions.length > 0 && (
                                <div className="mt-2">
                                    {validation.suggestions.map((suggestion, index) => (
                                        <p key={index} className="text-yellow-400 text-sm font-mono flex items-start">
                                            <span className="mr-2">💡</span>
                                            <span>{suggestion}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Requirements List */}
            {showRequirements && (!value || (validation && !validation.isValid)) && (
                <div className="mt-4">
                    <p className="text-gray-400 text-sm font-mono mb-2">Username requirements:</p>
                    <ul className="space-y-1">
                        {requirementsList.map((requirement, index) => {
                            // Simple check to see if this requirement is met
                            const isMet = validation ? !validation.errors.some(error =>
                                error.toLowerCase().includes(requirement.toLowerCase().split(' ').slice(-1)[0]) ||
                                error.toLowerCase().includes('character') && requirement.includes('character') ||
                                error.toLowerCase().includes('length') && requirement.includes('character')
                            ) : false;

                            return (
                                <li key={index} className={`text-xs font-mono flex items-start ${isMet && value ? 'text-green-400' : 'text-gray-500'
                                    }`}>
                                    <span className="mr-2">
                                        {isMet && value ? '✓' : '○'}
                                    </span>
                                    <span>{requirement}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Helper text when focused and empty */}
            {isFocused && !value && (
                <p className="mt-2 text-gray-500 text-sm font-mono">
                    Choose a unique username that represents you
                </p>
            )}
        </div>
    );
}