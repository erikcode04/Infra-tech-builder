// Email validation utility

export interface EmailValidation {
    isValid: boolean;
    errors: string[];
    suggestions?: string[];
}

/**
 * Validates email address with comprehensive checks
 * @param email - The email to validate
 * @returns EmailValidation object with results
 */
export function validateEmail(email: string): EmailValidation {
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!email) {
        errors.push('Email is required');
        return { isValid: false, errors, suggestions };
    }

    // Basic format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }

    // Length validation
    if (email.length > 254) {
        errors.push('Email address is too long (maximum 254 characters)');
    }

    // Local part (before @) validation
    const [localPart, domain] = email.split('@');

    if (localPart && localPart.length > 64) {
        errors.push('Email local part is too long (maximum 64 characters)');
    }

    // Domain validation
    if (domain) {
        // Check for valid domain format
        if (domain.length < 2) {
            errors.push('Domain must be at least 2 characters long');
        }

        if (domain.startsWith('.') || domain.endsWith('.')) {
            errors.push('Domain cannot start or end with a dot');
        }

        if (domain.includes('..')) {
            errors.push('Domain cannot contain consecutive dots');
        }

        // Common domain suggestions
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
        const domainLower = domain.toLowerCase();

        // Suggest corrections for common typos
        if (domainLower.includes('gmial') || domainLower.includes('gmai')) {
            suggestions.push('Did you mean gmail.com?');
        } else if (domainLower.includes('yahooo') || domainLower.includes('yaho')) {
            suggestions.push('Did you mean yahoo.com?');
        } else if (domainLower.includes('hotmial') || domainLower.includes('hotmai')) {
            suggestions.push('Did you mean hotmail.com?');
        }
    }

    // Suspicious patterns
    if (email.includes('..')) {
        errors.push('Email cannot contain consecutive dots');
    }

    if (email.startsWith('.') || email.endsWith('.')) {
        errors.push('Email cannot start or end with a dot');
    }

    // Temporary email detection (basic)
    const tempDomains = ['10minutemail', 'tempmail', 'guerrillamail', 'mailinator'];
    if (domain && tempDomains.some(temp => domain.toLowerCase().includes(temp))) {
        errors.push('Temporary email addresses are not allowed');
    }

    return {
        isValid: errors.length === 0,
        errors,
        suggestions: suggestions.length > 0 ? suggestions : undefined
    };
}

/**
 * Get email validation color for UI
 */
export function getEmailValidationColor(isValid: boolean): string {
    return isValid ? 'text-green-400' : 'text-red-400';
}