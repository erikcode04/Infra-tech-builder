"use client";

import { useState, useEffect } from 'react';
import { validateEmail, getEmailValidationColor, EmailValidation } from '@/utils/email-validation';

interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showValidation?: boolean;
}

export default function EmailInput({
    value,
    onChange,
    placeholder = "Email",
    showValidation = true
}: EmailInputProps) {
    const [validation, setValidation] = useState<EmailValidation | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (value) {
            setValidation(validateEmail(value));
        } else {
            setValidation(null);
        }
    }, [value]);

    return (
        <div className="w-full">
            {/* Email Input */}
            <input
                type="email"
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
                            Valid email address
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

            {/* Helper text when focused and empty */}
            {isFocused && !value && (
                <p className="mt-2 text-gray-500 text-sm font-mono">
                    Enter a valid email address (e.g., user@example.com)
                </p>
            )}
        </div>
    );
}