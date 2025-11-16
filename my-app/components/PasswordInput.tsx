"use client";

import { useState, useEffect } from 'react';
import { validatePassword, getPasswordStrengthColor, getPasswordRequirementsList, PasswordValidation } from '@/utils/password-validation';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showStrength?: boolean;
    showRequirements?: boolean;
}

export default function PasswordInput({
    value,
    onChange,
    placeholder = "Password",
    showStrength = true,
    showRequirements = true
}: PasswordInputProps) {
    const [validation, setValidation] = useState<PasswordValidation | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (value) {
            setValidation(validatePassword(value));
        } else {
            setValidation(null);
        }
    }, [value]);

    const requirements = getPasswordRequirementsList();

    return (
        <div className="w-full">
            {/* Password Input */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-4 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-200 font-mono pr-12"
                />

                {/* Toggle Password Visibility */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 font-mono text-sm"
                >
                    {showPassword ? 'HIDE' : 'SHOW'}
                </button>
            </div>

            {/* Password Strength Indicator */}
            {showStrength && validation && value && (
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-gray-400">
                            Strength
                        </span>
                        <span className={`text-sm font-mono font-medium ${getPasswordStrengthColor(validation.strength)}`}>
                            {validation.strength.toUpperCase()} ({validation.score}/100)
                        </span>
                    </div>

                    {/* Strength Bar */}
                    <div className="w-full bg-gray-700 h-1 rounded">
                        <div
                            className={`h-1 rounded transition-all duration-300 ${validation.strength === 'weak' ? 'bg-red-400' :
                                    validation.strength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                                }`}
                            style={{ width: `${validation.score}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error Messages */}
            {validation && validation.errors.length > 0 && (
                <div className="mt-4">
                    <p className="text-red-400 text-sm font-mono mb-2">Password requirements not met:</p>
                    <ul className="space-y-1">
                        {validation.errors.map((error, index) => (
                            <li key={index} className="text-red-400 text-xs font-mono flex items-start">
                                <span className="mr-2">×</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Requirements List */}
            {showRequirements && (!value || (validation && !validation.isValid)) && (
                <div className="mt-4">
                    <p className="text-gray-400 text-sm font-mono mb-2">Password requirements:</p>
                    <ul className="space-y-1">
                        {requirements.map((requirement, index) => {
                            const isMet = validation ? !validation.errors.some(error =>
                                error.toLowerCase().includes(requirement.toLowerCase().split(' ').slice(-1)[0])
                            ) : false;

                            return (
                                <li key={index} className={`text-xs font-mono flex items-start ${isMet ? 'text-green-400' : 'text-gray-500'
                                    }`}>
                                    <span className="mr-2">
                                        {isMet ? '✓' : '○'}
                                    </span>
                                    <span>{requirement}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Success Message */}
            {validation && validation.isValid && (
                <div className="mt-4">
                    <p className="text-green-400 text-sm font-mono flex items-center">
                        <span className="mr-2">✓</span>
                        Password meets all requirements
                    </p>
                </div>
            )}
        </div>
    );
}