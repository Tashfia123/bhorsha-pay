// AI-powered NID fraud detection system
export const aiNIDValidator = {
  // 1. FORMAT VALIDATION
  checkFormat: (nidNumber) => {
    if (!nidNumber || typeof nidNumber !== 'string') {
      return { isValid: false, reason: 'Invalid input' };
    }

    const patterns = {
      // Bangladesh NID format: 10-13 digits
      validFormat: /^\d{10,13}$/,
      
      // Suspicious patterns
      sequential: /1234567890|9876543210|0123456789/,
      repeated: /(\d)\1{9,}/, // Same digit repeated 10+ times
      suspicious: /0000000000|1111111111|9999999999/,
      
      // Common fake patterns
      fakePatterns: /123123123|456456456|789789789|1111111111|0000000000/,
      
      // Additional suspicious patterns
      palindrome: /^(\d)(\d)(\d)(\d)(\d)\5\4\3\2\1$/, // 12345654321
      mirror: /^(\d)(\d)(\d)(\d)(\d)\5\4\3\2\1$/, // Mirror pattern
      alternating: /^(0[1-9]){5,6}$/, // Alternating 0 and other digits
      grouped: /^(\d{2})\1{4,5}$/, // Repeated 2-digit groups
      incremental: /^(0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]){5,6}$/ // Incremental pattern
    };
    
    const results = {
      isValid: patterns.validFormat.test(nidNumber),
      isSequential: patterns.sequential.test(nidNumber),
      isRepeated: patterns.repeated.test(nidNumber),
      isSuspicious: patterns.suspicious.test(nidNumber),
      isFakePattern: patterns.fakePatterns.test(nidNumber),
      isPalindrome: patterns.palindrome.test(nidNumber),
      isMirror: patterns.mirror.test(nidNumber),
      isAlternating: patterns.alternating.test(nidNumber),
      isGrouped: patterns.grouped.test(nidNumber),
      isIncremental: patterns.incremental.test(nidNumber),
      length: nidNumber.length
    };
    
    // Generate specific, detailed messages
    if (!results.isValid) {
      if (nidNumber.length < 10) {
        results.reason = `NID too short: ${nidNumber.length} digits (minimum 10 required)`;
        results.detail = 'Bangladesh NID numbers must be at least 10 digits long';
      } else if (nidNumber.length > 13) {
        results.reason = `NID too long: ${nidNumber.length} digits (maximum 13 allowed)`;
        results.detail = 'Bangladesh NID numbers cannot exceed 13 digits';
      } else {
        results.reason = 'NID contains non-digit characters';
        results.detail = 'Only numbers 0-9 are allowed in NID';
      }
    } else if (results.isSequential) {
      results.reason = 'Sequential pattern detected';
      results.detail = 'Numbers like 1234567890 are commonly used in fake IDs';
      results.riskLevel = 'HIGH';
    } else if (results.isRepeated) {
      results.reason = 'Repeated digit pattern detected';
      results.detail = `Digit "${nidNumber[0]}" repeated ${nidNumber.length} times - highly suspicious`;
      results.riskLevel = 'HIGH';
    } else if (results.isSuspicious) {
      results.reason = 'Suspicious uniform pattern detected';
      results.detail = 'All digits are the same - this is a common fake ID pattern';
      results.riskLevel = 'HIGH';
    } else if (results.isFakePattern) {
      results.reason = 'Common fake ID pattern detected';
      results.detail = 'This pattern matches known fake ID sequences';
      results.riskLevel = 'HIGH';
    } else if (results.isPalindrome) {
      results.reason = 'Palindrome pattern detected';
      results.detail = 'Numbers that read the same forwards and backwards are suspicious';
      results.riskLevel = 'MEDIUM';
    } else if (results.isMirror) {
      results.reason = 'Mirror pattern detected';
      results.detail = 'Symmetrical number patterns are rarely genuine';
      results.riskLevel = 'MEDIUM';
    } else if (results.isAlternating) {
      results.reason = 'Alternating pattern detected';
      results.detail = 'Regular alternating between 0 and other digits is suspicious';
      results.riskLevel = 'MEDIUM';
    } else if (results.isGrouped) {
      results.reason = 'Repeated group pattern detected';
      results.detail = 'Same 2-digit group repeated multiple times is suspicious';
      results.riskLevel = 'MEDIUM';
    } else if (results.isIncremental) {
      results.reason = 'Incremental pattern detected';
      results.detail = 'Regular incremental sequences are rarely genuine';
      results.riskLevel = 'MEDIUM';
    } else {
      results.reason = 'Format appears valid';
      results.detail = 'NID number format meets basic requirements';
      results.riskLevel = 'LOW';
    }
    
    return results;
  },

  // 2. MATHEMATICAL VALIDATION
  checkMathematics: (nidNumber) => {
    const digits = nidNumber.split('').map(Number);
    
    // Luhn algorithm adapted for NID
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    const checksumValid = sum % 10 === 0;
    const checksumRemainder = sum % 10;
    
    // Additional mathematical checks
    const digitSum = digits.reduce((acc, digit) => acc + digit, 0);
    const averageDigit = digitSum / digits.length;
    const hasConsecutive = digits.some((digit, index) => 
      index > 0 && Math.abs(digit - digits[index - 1]) === 1
    );
    
    return {
      isValidChecksum: checksumValid,
      checksumScore: checksumRemainder,
      totalSum: sum,
      digitSum: digitSum,
      averageDigit: Math.round(averageDigit * 100) / 100,
      hasConsecutive: hasConsecutive,
      reason: checksumValid ? 'Valid checksum' : `Failed mathematical validation (remainder: ${checksumRemainder})`,
      detail: checksumValid ? 
        'NID passes mathematical validation algorithm' : 
        `Checksum calculation failed. Expected remainder 0, got ${checksumRemainder}`,
      riskLevel: checksumValid ? 'LOW' : 'HIGH'
    };
  },

  // 3. STATISTICAL ANALYSIS
  checkStatistics: (nidNumber) => {
    const digits = nidNumber.split('').map(Number);
    
    // Check digit distribution
    const digitCounts = {};
    digits.forEach(digit => {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    });
    
    // Calculate entropy (randomness)
    const entropy = -Object.values(digitCounts).reduce((sum, count) => {
      const probability = count / digits.length;
      return sum + probability * Math.log2(probability);
    }, 0);
    
    // Check for balanced distribution
    const uniqueDigits = Object.keys(digitCounts).length;
    const isBalanced = uniqueDigits >= 6; // At least 6 different digits
    const maxFrequency = Math.max(...Object.values(digitCounts));
    const minFrequency = Math.min(...Object.values(digitCounts));
    const frequencyRatio = maxFrequency / minFrequency;
    
    // Additional statistical checks
    const hasEvenOddPattern = digits.every((digit, index) => 
      index === 0 || (digit % 2) !== (digits[index - 1] % 2)
    );
    const hasAscendingPattern = digits.every((digit, index) => 
      index === 0 || digit >= digits[index - 1]
    );
    const hasDescendingPattern = digits.every((digit, index) => 
      index === 0 || digit <= digits[index - 1]
    );
    
    let reason = 'Good randomness';
    let detail = 'Digit distribution appears natural';
    let riskLevel = 'LOW';
    
    if (entropy < 1.5) {
      reason = 'Too predictable pattern';
      detail = 'Low entropy indicates artificial number generation';
      riskLevel = 'HIGH';
    } else if (!isBalanced) {
      reason = 'Unbalanced digit distribution';
      detail = `Only ${uniqueDigits} unique digits out of ${digits.length} total`;
      riskLevel = 'MEDIUM';
    } else if (frequencyRatio > 3) {
      reason = 'Uneven digit frequency';
      detail = `Most common digit appears ${maxFrequency} times, least common ${minFrequency} times`;
      riskLevel = 'MEDIUM';
    } else if (hasEvenOddPattern) {
      reason = 'Perfect even-odd alternation';
      detail = 'Regular alternation between even and odd digits is suspicious';
      riskLevel = 'MEDIUM';
    } else if (hasAscendingPattern) {
      reason = 'Perfect ascending sequence';
      detail = 'All digits in ascending order is highly suspicious';
      riskLevel = 'HIGH';
    } else if (hasDescendingPattern) {
      reason = 'Perfect descending sequence';
      detail = 'All digits in descending order is highly suspicious';
      riskLevel = 'HIGH';
    }
    
    return {
      digitDistribution: digitCounts,
      entropy: Math.round(entropy * 100) / 100,
      uniqueDigits: uniqueDigits,
      maxFrequency: maxFrequency,
      minFrequency: minFrequency,
      frequencyRatio: Math.round(frequencyRatio * 100) / 100,
      isRandom: entropy > 2.5,
      isBalanced: isBalanced,
      isSuspicious: entropy < 1.5,
      hasEvenOddPattern: hasEvenOddPattern,
      hasAscendingPattern: hasAscendingPattern,
      hasDescendingPattern: hasDescendingPattern,
      reason: reason,
      detail: detail,
      riskLevel: riskLevel
    };
  },

  // 4. COMPREHENSIVE VALIDATION
  validateAll: async (nidNumber) => {
    try {
      // Step 1: Basic format check
      const formatCheck = aiNIDValidator.checkFormat(nidNumber);
      if (!formatCheck.isValid) {
        return {
          overallRisk: 'HIGH',
          riskScore: 0.9,
          isValid: false,
          reason: formatCheck.reason,
          detail: formatCheck.detail,
          riskLevel: formatCheck.riskLevel || 'HIGH',
          details: { formatCheck }
        };
      }

      // Step 2: Mathematical validation
      const mathCheck = aiNIDValidator.checkMathematics(nidNumber);
      
      // Step 3: Statistical analysis
      const statsCheck = aiNIDValidator.checkStatistics(nidNumber);
      
      // Step 4: Calculate risk factors with weighted scoring
      let riskFactors = 0;
      let totalChecks = 0;
      let riskDetails = [];
      
      // Format risk (weight: 0.4)
      if (formatCheck.riskLevel === 'HIGH') {
        riskFactors += 0.4;
        riskDetails.push(`Format: ${formatCheck.reason}`);
      } else if (formatCheck.riskLevel === 'MEDIUM') {
        riskFactors += 0.2;
        riskDetails.push(`Format: ${formatCheck.reason}`);
      }
      totalChecks += 0.4;
      
      // Math risk (weight: 0.3)
      if (mathCheck.riskLevel === 'HIGH') {
        riskFactors += 0.3;
        riskDetails.push(`Math: ${mathCheck.reason}`);
      } else if (mathCheck.riskLevel === 'MEDIUM') {
        riskFactors += 0.15;
        riskDetails.push(`Math: ${mathCheck.reason}`);
      }
      totalChecks += 0.3;
      
      // Stats risk (weight: 0.3)
      if (statsCheck.riskLevel === 'HIGH') {
        riskFactors += 0.3;
        riskDetails.push(`Stats: ${statsCheck.reason}`);
      } else if (statsCheck.riskLevel === 'MEDIUM') {
        riskFactors += 0.15;
        riskDetails.push(`Stats: ${statsCheck.reason}`);
      }
      totalChecks += 0.3;
      
      // Calculate overall risk
      const riskScore = riskFactors / totalChecks;
      const overallRisk = riskScore > 0.6 ? 'HIGH' : 
                         riskScore > 0.3 ? 'MEDIUM' : 'LOW';
      
      // Generate comprehensive reason and detail
      let reason, detail;
      if (overallRisk === 'LOW') {
        reason = 'NID appears valid';
        detail = 'All validation checks passed successfully';
      } else if (overallRisk === 'MEDIUM') {
        reason = 'Some concerns detected';
        detail = `Issues found: ${riskDetails.slice(0, 2).join(', ')}`;
      } else {
        reason = 'Multiple fraud indicators detected';
        detail = `High-risk issues: ${riskDetails.join(', ')}`;
      }
      
      return {
        overallRisk,
        riskScore: Math.round(riskScore * 100) / 100,
        isValid: overallRisk === 'LOW',
        reason: reason,
        detail: detail,
        riskDetails: riskDetails,
        details: {
          formatCheck,
          mathCheck,
          statsCheck
        }
      };
      
    } catch (error) {
      console.error('AI validation error:', error);
      return {
        overallRisk: 'ERROR',
        riskScore: 1,
        isValid: false,
        reason: 'Validation failed due to error',
        detail: 'System error occurred during validation',
        error: error.message
      };
    }
  }
};

// Helper function to format validation results for display
export const formatValidationResults = (results) => {
  if (!results) return null;
  
  return {
    overallRisk: results.overallRisk,
    riskScore: results.riskScore,
    isValid: results.isValid,
    reason: results.reason,
    detail: results.detail,
    riskDetails: results.riskDetails || [],
    checks: [
      {
        name: 'Format Validation',
        status: results.details?.formatCheck?.isValid ? 'pass' : 'fail',
        details: results.details?.formatCheck?.detail || 'Format check passed',
        icon: results.details?.formatCheck?.isValid ? '✅' : '❌',
        riskLevel: results.details?.formatCheck?.riskLevel || 'LOW'
      },
      {
        name: 'Mathematical Validation',
        status: results.details?.mathCheck?.isValidChecksum ? 'pass' : 'fail',
        details: results.details?.mathCheck?.detail || 'Checksum validation passed',
        icon: results.details?.mathCheck?.isValidChecksum ? '✅' : '❌',
        riskLevel: results.details?.mathCheck?.riskLevel || 'LOW'
      },
      {
        name: 'Pattern Analysis',
        status: results.details?.statsCheck?.isRandom && results.details?.statsCheck?.isBalanced ? 'pass' : 'fail',
        details: results.details?.statsCheck?.detail || 'Pattern analysis passed',
        icon: results.details?.statsCheck?.isRandom && results.details?.statsCheck?.isBalanced ? '✅' : '❌',
        riskLevel: results.details?.statsCheck?.riskLevel || 'LOW'
      }
    ]
  };
};
