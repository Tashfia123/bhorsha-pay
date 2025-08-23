/**
 * Utility functions for formatting data in the application
 */

/**
 * Formats a number as currency with the specified currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency symbol to use (default: '$')
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '$', decimals = 2) => {
  if (amount === null || amount === undefined) return `${currency}0.00`;
  
  return `${currency}${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

/**
 * Formats a number with commas for thousands separators
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0';
  
  return parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a date object or timestamp to a readable string
 * @param {Date|number|string} date - Date object, timestamp or date string
 * @param {string} format - Format type ('short', 'long', 'full', 'relative')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  switch (format) {
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'relative':
      return formatRelativeTime(dateObj);
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
  }
};

/**
 * Formats a date as a relative time string (e.g., "3 days ago")
 * @param {Date} date - The date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Formats an Ethereum address to a shorter version
 * @param {string} address - Ethereum address
 * @param {number} prefixLength - Number of characters to show at the beginning (default: 6)
 * @param {number} suffixLength - Number of characters to show at the end (default: 4)
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address || address.length < (prefixLength + suffixLength + 3)) {
    return address || '';
  }
  
  return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Formats a number as a percentage
 * @param {number} value - The value to format (0-1)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length before truncation (default: 30)
 * @returns {string} - Truncated string
 */
export const truncateString = (str, length = 30) => {
  if (!str) return '';
  
  if (str.length <= length) return str;
  
  return `${str.substring(0, length)}...`;
};

/**
 * Formats a phone number with proper formatting
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number has the expected length
  if (cleaned.length < 10) return phoneNumber;
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // For international numbers
  if (cleaned.length > 10) {
    return `+${cleaned.substring(0, cleaned.length - 10)} (${cleaned.substring(cleaned.length - 10, cleaned.length - 7)}) ${cleaned.substring(cleaned.length - 7, cleaned.length - 4)}-${cleaned.substring(cleaned.length - 4)}`;
  }
  
  return phoneNumber;
};

/**
 * Formats a URL for display (removes protocol and trailing slash)
 * @param {string} url - The URL to format
 * @returns {string} - Formatted URL
 */
export const formatUrl = (url) => {
  if (!url) return '';
  
  return url
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/$/, '');
};

/**
 * Converts a hex color to RGBA format
 * @param {string} hex - Hex color code
 * @param {number} alpha - Alpha channel value (0-1)
 * @returns {string} - RGBA color string
 */
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return '';
  
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
  }
  
  return hex;
};

/**
 * Formats a decimal number as ETH with proper units
 * @param {number|string} value - The value in ETH
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} - Formatted ETH value
 */
export const formatEth = (value, decimals = 4) => {
  if (value === null || value === undefined) return '0 ETH';
  
  return `${parseFloat(value).toFixed(decimals)} ETH`;
}; 