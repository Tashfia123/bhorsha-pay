/**
 * Utility functions for validating data in the application
 */

/**
 * Checks if a string is a valid email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a string is empty or only contains whitespace
 * @param {string} str - The string to check
 * @returns {boolean} - True if empty/whitespace, false otherwise
 */
export const isEmpty = (str) => {
  if (str === null || str === undefined) return true;
  
  return str.trim() === '';
};

/**
 * Validates a password strength
 * @param {string} password - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 8)
 * @param {boolean} options.requireUppercase - Require uppercase letter (default: true)
 * @param {boolean} options.requireLowercase - Require lowercase letter (default: true)
 * @param {boolean} options.requireNumbers - Require number (default: true)
 * @param {boolean} options.requireSpecialChars - Require special character (default: true)
 * @returns {Object} - Result with isValid flag and reasons
 */
export const validatePassword = (password, options = {}) => {
  const config = {
    minLength: options.minLength || 8,
    requireUppercase: options.requireUppercase !== false,
    requireLowercase: options.requireLowercase !== false,
    requireNumbers: options.requireNumbers !== false,
    requireSpecialChars: options.requireSpecialChars !== false
  };
  
  const result = {
    isValid: true,
    reasons: []
  };
  
  if (!password || password.length < config.minLength) {
    result.isValid = false;
    result.reasons.push(`Password must be at least ${config.minLength} characters long`);
  }
  
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    result.isValid = false;
    result.reasons.push('Password must contain at least one uppercase letter');
  }
  
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    result.isValid = false;
    result.reasons.push('Password must contain at least one lowercase letter');
  }
  
  if (config.requireNumbers && !/\d/.test(password)) {
    result.isValid = false;
    result.reasons.push('Password must contain at least one number');
  }
  
  if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.isValid = false;
    result.reasons.push('Password must contain at least one special character');
  }
  
  return result;
};

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @param {boolean} requireProtocol - Whether to require protocol (http/https) (default: false)
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidUrl = (url, requireProtocol = false) => {
  if (!url) return false;
  
  let pattern;
  if (requireProtocol) {
    pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  } else {
    pattern = /^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?)?$/;
  }
  
  return pattern.test(url);
};

/**
 * Validates an Ethereum address
 * @param {string} address - The Ethereum address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEthereumAddress = (address) => {
  if (!address) return false;
  
  // Ethereum address is 42 characters long including 0x prefix
  // and contains only hex characters after the prefix
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Validates a phone number
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} countryCode - Country code (default: 'US')
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber, countryCode = 'US') => {
  if (!phoneNumber) return false;
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // For US numbers, should be 10 digits
  if (countryCode === 'US') {
    return cleaned.length === 10;
  }
  
  // For international numbers, should be at least 8 digits
  return cleaned.length >= 8;
};

/**
 * Validates a date is within a given range
 * @param {Date|string|number} date - The date to validate
 * @param {Date|string|number} minDate - Minimum allowed date (optional)
 * @param {Date|string|number} maxDate - Maximum allowed date (optional)
 * @returns {boolean} - True if valid, false otherwise
 */
export const isDateInRange = (date, minDate = null, maxDate = null) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return false;
  
  if (minDate !== null) {
    const minDateObj = new Date(minDate);
    if (dateObj < minDateObj) return false;
  }
  
  if (maxDate !== null) {
    const maxDateObj = new Date(maxDate);
    if (dateObj > maxDateObj) return false;
  }
  
  return true;
};

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 3)
 * @param {number} options.maxLength - Maximum length (default: 20)
 * @param {boolean} options.allowSpaces - Allow spaces (default: false)
 * @param {boolean} options.allowSpecialChars - Allow special characters (default: false)
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidUsername = (username, options = {}) => {
  if (!username) return false;
  
  const config = {
    minLength: options.minLength || 3,
    maxLength: options.maxLength || 20,
    allowSpaces: options.allowSpaces || false,
    allowSpecialChars: options.allowSpecialChars || false
  };
  
  if (username.length < config.minLength || username.length > config.maxLength) {
    return false;
  }
  
  let pattern;
  if (config.allowSpaces && config.allowSpecialChars) {
    pattern = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  } else if (config.allowSpaces) {
    pattern = /^[a-zA-Z0-9\s]*$/;
  } else if (config.allowSpecialChars) {
    pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  } else {
    pattern = /^[a-zA-Z0-9]*$/;
  }
  
  return pattern.test(username);
};

/**
 * Validates if a number is within a range
 * @param {number} value - The number to validate
 * @param {number} min - Minimum value (default: Number.MIN_SAFE_INTEGER)
 * @param {number} max - Maximum value (default: Number.MAX_SAFE_INTEGER)
 * @returns {boolean} - True if valid, false otherwise
 */
export const isNumberInRange = (value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return false;
  }
  
  const numValue = Number(value);
  return numValue >= min && numValue <= max;
};

/**
 * Validates a credit card number using Luhn algorithm
 * @param {string} cardNumber - The credit card number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber) return false;
  
  // Remove all non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Check if the number has at least 13 digits (minimum for credit cards)
  if (cleaned.length < 13) return false;
  
  // Luhn algorithm (mod 10)
  let sum = 0;
  let shouldDouble = false;
  
  // Start from the rightmost digit and move left
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates if a value is a valid hex color
 * @param {string} color - The color value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidHexColor = (color) => {
  if (!color) return false;
  
  return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
};

/**
 * Validates if a file has an allowed extension
 * @param {string} fileName - The file name to check
 * @param {Array<string>} allowedExtensions - Array of allowed extensions (e.g., ['.jpg', '.png'])
 * @returns {boolean} - True if valid, false otherwise
 */
export const hasValidFileExtension = (fileName, allowedExtensions = []) => {
  if (!fileName || !allowedExtensions.length) return false;
  
  const ext = '.' + fileName.split('.').pop().toLowerCase();
  return allowedExtensions.includes(ext);
};

/**
 * Validates if an object has all required properties
 * @param {Object} obj - The object to validate
 * @param {Array<string>} requiredProps - Array of required property names
 * @returns {boolean} - True if valid, false otherwise
 */
export const hasRequiredProperties = (obj, requiredProps = []) => {
  if (!obj || !requiredProps.length) return false;
  
  return requiredProps.every(prop => 
    Object.prototype.hasOwnProperty.call(obj, prop) && 
    obj[prop] !== null && 
    obj[prop] !== undefined
  );
};

/**
 * Validates if a password meets security requirements
 * @param {string} password - The password to check
 * @returns {Object} - Validation result with score and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      feedback: 'Password is required',
      isStrong: false
    };
  }
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password is too short (minimum 8 characters)');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  else feedback.push('Add special characters');
  
  // Bonus for combination of character types
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if ((hasUpper && hasLower && hasDigit) || 
      (hasUpper && hasLower && hasSpecial) || 
      (hasUpper && hasDigit && hasSpecial) || 
      (hasLower && hasDigit && hasSpecial)) {
    score += 1;
  }
  
  // Check for common patterns
  if (/^123|password|qwerty|abc|admin|user|login|welcome/i.test(password)) {
    score -= 2;
    feedback.push('Avoid common words and patterns');
  }
  
  // Determine if password is strong enough
  const isStrong = score >= 4;
  
  return {
    score,
    feedback: feedback.length ? feedback.join(', ') : 'Password is strong',
    isStrong
  };
}; 