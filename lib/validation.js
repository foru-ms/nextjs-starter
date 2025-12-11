/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input) {
    if (typeof input !== 'string') return '';
    
    // Remove any HTML tags and trim whitespace
    return input
        .replace(/<[^>]*>/g, '')
        .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate username
 */
export function isValidUsername(username) {
    if (!username || typeof username !== 'string') return false;
    
    // Username: 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
    if (!password || typeof password !== 'string') return false;
    
    // Password: at least 8 characters, max 128
    return password.length >= 8 && password.length <= 128;
}

/**
 * Validate thread title
 */
export function isValidThreadTitle(title) {
    if (!title || typeof title !== 'string') return false;
    
    const sanitized = sanitizeString(title);
    return sanitized.length >= 3 && sanitized.length <= 200;
}

/**
 * Validate post/thread body
 */
export function isValidBody(body) {
    if (!body || typeof body !== 'string') return false;
    
    const sanitized = sanitizeString(body);
    return sanitized.length >= 1 && sanitized.length <= 10000;
}

/**
 * Validate pagination page number
 */
export function isValidPage(page) {
    const pageNum = parseInt(page, 10);
    return !isNaN(pageNum) && pageNum > 0 && pageNum <= 10000;
}

/**
 * Validate search query
 */
export function isValidSearchQuery(query) {
    if (!query || typeof query !== 'string') return false;
    
    const sanitized = sanitizeString(query);
    return sanitized.length >= 1 && sanitized.length <= 100;
}

/**
 * Validate search type
 */
export function isValidSearchType(type) {
    const validTypes = ['threads', 'posts', 'all'];
    return validTypes.includes(type);
}

/**
 * Comprehensive validation for registration
 */
export function validateRegistration(username, email, password) {
    const errors = [];

    if (!isValidUsername(username)) {
        errors.push('Username must be 3-30 characters and contain only letters, numbers, and underscores');
    }

    if (!isValidEmail(email)) {
        errors.push('Invalid email address');
    }

    if (!isValidPassword(password)) {
        errors.push('Password must be at least 8 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Comprehensive validation for login
 */
export function validateLogin(email, password) {
    const errors = [];

    if (!isValidEmail(email)) {
        errors.push('Invalid email address');
    }

    if (!password || password.length === 0) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Comprehensive validation for thread creation
 */
export function validateThread(title, body) {
    const errors = [];

    if (!isValidThreadTitle(title)) {
        errors.push('Title must be between 3 and 200 characters');
    }

    if (!isValidBody(body)) {
        errors.push('Body must be between 1 and 10000 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: {
            title: sanitizeString(title),
            body: sanitizeString(body),
        },
    };
}

/**
 * Comprehensive validation for post creation
 */
export function validatePost(body) {
    const errors = [];

    if (!isValidBody(body)) {
        errors.push('Post must be between 1 and 10000 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: {
            body: sanitizeString(body),
        },
    };
}
