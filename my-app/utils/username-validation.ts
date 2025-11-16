// Username validation utility

export interface UsernameValidation {
    isValid: boolean;
    errors: string[];
    suggestions?: string[];
}

export interface UsernameRequirements {
    minLength?: number;
    maxLength?: number;
    allowNumbers?: boolean;
    allowUnderscores?: boolean;
    allowHyphens?: boolean;
    requireLetters?: boolean;
    forbiddenWords?: string[];
    caseSensitive?: boolean;
}

const DEFAULT_USERNAME_REQUIREMENTS: Required<UsernameRequirements> = {
    minLength: 3,
    maxLength: 20,
    allowNumbers: true,
    allowUnderscores: true,
    allowHyphens: true,
    requireLetters: true,
    forbiddenWords: ['admin', 'root', 'user', 'test', 'null', 'undefined', 'system', 'api'],
    caseSensitive: false
};

/**
 * Validates username with comprehensive checks
 * @param username - The username to validate
 * @param requirements - Custom requirements (optional)
 * @returns UsernameValidation object with results
 */
export function validateUsername(
    username: string,
    requirements: Partial<UsernameRequirements> = {}
): UsernameValidation {
    const reqs = { ...DEFAULT_USERNAME_REQUIREMENTS, ...requirements };
    const errors: string[] = [];
    const suggestions: string[] = [];

    if (!username) {
        errors.push('Username is required');
        return { isValid: false, errors, suggestions };
    }

    // Length validation
    if (username.length < reqs.minLength) {
        errors.push(`Username must be at least ${reqs.minLength} characters long`);
    }

    if (username.length > reqs.maxLength) {
        errors.push(`Username must not exceed ${reqs.maxLength} characters`);
    }

    // Character validation
    const hasLetters = /[a-zA-Z]/.test(username);
    const hasNumbers = /\d/.test(username);
    const hasUnderscores = /_/.test(username);
    const hasHyphens = /-/.test(username);

    // Must contain letters if required
    if (reqs.requireLetters && !hasLetters) {
        errors.push('Username must contain at least one letter');
    }

    // Build allowed character regex
    let allowedChars = 'a-zA-Z';
    if (reqs.allowNumbers) allowedChars += '0-9';
    if (reqs.allowUnderscores) allowedChars += '_';
    if (reqs.allowHyphens) allowedChars += '-';

    const allowedRegex = new RegExp(`^[${allowedChars}]+$`);
    if (!allowedRegex.test(username)) {
        const disallowedChars = [];
        if (!reqs.allowNumbers && hasNumbers) disallowedChars.push('numbers');
        if (!reqs.allowUnderscores && hasUnderscores) disallowedChars.push('underscores');
        if (!reqs.allowHyphens && hasHyphens) disallowedChars.push('hyphens');

        if (disallowedChars.length > 0) {
            errors.push(`Username cannot contain ${disallowedChars.join(', ')}`);
        } else {
            errors.push('Username contains invalid characters');
        }
    }

    // Starting/ending character validation
    if (username.startsWith('_') || username.startsWith('-')) {
        errors.push('Username cannot start with underscore or hyphen');
    }

    if (username.endsWith('_') || username.endsWith('-')) {
        errors.push('Username cannot end with underscore or hyphen');
    }

    // Consecutive special characters
    if (/__/.test(username) || /--/.test(username) || /_-/.test(username) || /-_/.test(username)) {
        errors.push('Username cannot contain consecutive special characters');
    }

    // Reserved words validation
    const usernameToCheck = reqs.caseSensitive ? username : username.toLowerCase();
    const forbiddenWords = reqs.caseSensitive ? reqs.forbiddenWords : reqs.forbiddenWords.map(w => w.toLowerCase());

    for (const word of forbiddenWords) {
        if (usernameToCheck.includes(word)) {
            errors.push(`Username cannot contain "${word}"`);
        }
    }

    // Common patterns to avoid
    if (/^\d+$/.test(username)) {
        errors.push('Username cannot be only numbers');
        suggestions.push('Try adding letters to your username');
    }

    // Sequential patterns
    if (/123|abc|qwe/i.test(username)) {
        errors.push('Username should not contain sequential patterns');
    }

    // Generate suggestions if invalid
    if (errors.length > 0 && username.length > 0) {
        // Suggest modifications
        if (username.length < reqs.minLength) {
            suggestions.push(`Add ${reqs.minLength - username.length} more characters`);
        }

        if (hasLetters && hasNumbers) {
            suggestions.push(`Try "${username}${Math.floor(Math.random() * 99)}"`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        suggestions: suggestions.length > 0 ? suggestions : undefined
    };
}

/**
 * Get username validation color for UI
 */
export function getUsernameValidationColor(isValid: boolean): string {
    return isValid ? 'text-green-400' : 'text-red-400';
}

/**
 * Get username requirements as user-friendly list
 */
export function getUsernameRequirementsList(requirements: Partial<UsernameRequirements> = {}): string[] {
    const reqs = { ...DEFAULT_USERNAME_REQUIREMENTS, ...requirements };
    const list: string[] = [];

    list.push(`${reqs.minLength}-${reqs.maxLength} characters long`);

    if (reqs.requireLetters) {
        list.push('Must contain at least one letter');
    }

    const allowed = ['letters'];
    if (reqs.allowNumbers) allowed.push('numbers');
    if (reqs.allowUnderscores) allowed.push('underscores');
    if (reqs.allowHyphens) allowed.push('hyphens');

    list.push(`Can contain: ${allowed.join(', ')}`);
    list.push('Cannot start or end with special characters');

    return list;
}