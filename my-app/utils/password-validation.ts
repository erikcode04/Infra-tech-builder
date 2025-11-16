// Password validation utility with comprehensive checks

export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
    score: number; // 0-100
}

export interface PasswordRequirements {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    forbiddenPatterns?: string[];
    minStrengthScore?: number;
}

const DEFAULT_REQUIREMENTS: Required<PasswordRequirements> = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPatterns: ['password', '123456', 'qwerty', 'admin'],
    minStrengthScore: 60
};

/**
 * Validates password against security requirements
 * @param password - The password to validate
 * @param requirements - Custom requirements (optional)
 * @returns PasswordValidation object with results
 */
export function validatePassword(
    password: string,
    requirements: Partial<PasswordRequirements> = {}
): PasswordValidation {
    const reqs = { ...DEFAULT_REQUIREMENTS, ...requirements };
    const errors: string[] = [];
    let score = 0;

    // Length validation
    if (password.length < reqs.minLength) {
        errors.push(`Password must be at least ${reqs.minLength} characters long`);
    } else {
        score += Math.min(25, (password.length / reqs.minLength) * 15);
    }

    if (password.length > reqs.maxLength) {
        errors.push(`Password must not exceed ${reqs.maxLength} characters`);
    }

    // Character type validations
    if (reqs.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
        score += 15;
    }

    if (reqs.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
        score += 15;
    }

    if (reqs.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
        score += 15;
    }

    if (reqs.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&* etc.)');
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
        score += 15;
    }

    // Pattern validation
    for (const pattern of reqs.forbiddenPatterns) {
        if (password.toLowerCase().includes(pattern.toLowerCase())) {
            errors.push(`Password cannot contain "${pattern}"`);
            score -= 20;
        }
    }

    // Additional strength checks
    // Bonus for mixed case
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
        score += 5;
    }

    // Bonus for variety
    const charTypes = [
        /[a-z]/.test(password), // lowercase
        /[A-Z]/.test(password), // uppercase  
        /\d/.test(password),    // numbers
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) // special
    ].filter(Boolean).length;

    score += charTypes * 5;

    // Penalty for repetitive patterns
    if (/(.)\1{2,}/.test(password)) { // 3+ repeated characters
        score -= 15;
        errors.push('Password should not contain repeated characters (e.g., "aaa")');
    }

    if (/012|123|234|345|456|567|678|789|890/.test(password)) {
        score -= 10;
        errors.push('Password should not contain sequential patterns (e.g., "123")');
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong';
    if (score < 40) strength = 'weak';
    else if (score < 70) strength = 'medium';
    else strength = 'strong';

    return {
        isValid: errors.length === 0 && score >= reqs.minStrengthScore,
        errors,
        strength,
        score
    };
}

/**
 * Get password strength color for UI
 */
export function getPasswordStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
    switch (strength) {
        case 'weak': return 'text-red-400';
        case 'medium': return 'text-yellow-400';
        case 'strong': return 'text-green-400';
    }
}

/**
 * Get password requirements as user-friendly list
 */
export function getPasswordRequirementsList(requirements: Partial<PasswordRequirements> = {}): string[] {
    const reqs = { ...DEFAULT_REQUIREMENTS, ...requirements };
    const list: string[] = [];

    if (reqs.minLength) {
        list.push(`At least ${reqs.minLength} characters long`);
    }
    if (reqs.requireUppercase) {
        list.push('At least one uppercase letter (A-Z)');
    }
    if (reqs.requireLowercase) {
        list.push('At least one lowercase letter (a-z)');
    }
    if (reqs.requireNumbers) {
        list.push('At least one number (0-9)');
    }
    if (reqs.requireSpecialChars) {
        list.push('At least one special character (!@#$%^&* etc.)');
    }

    return list;
}