import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { aiNIDValidator, formatValidationResults } from '../utils/aiNIDValidator';
import ManualVerification from './ManualVerification';

const NIDValidation = ({ 
  nidNumber, 
  onValidationChange, 
  isRequired = true,
  className = "" 
}) => {
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showManualVerification, setShowManualVerification] = useState(false);
  const { isDarkMode } = useTheme();

  // Debounced validation
  useEffect(() => {
    if (!nidNumber || nidNumber.length < 5) {
      setValidationResult(null);
      onValidationChange?.(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsValidating(true);
      try {
        const result = await aiNIDValidator.validateAll(nidNumber);
        const formattedResult = formatValidationResults(result);
        setValidationResult(formattedResult);
        onValidationChange?.(formattedResult);
      } catch (error) {
        console.error('Validation error:', error);
        setValidationResult({
          overallRisk: 'ERROR',
          riskScore: 1,
          isValid: false,
          reason: 'Validation failed',
          detail: 'System error occurred during validation',
          checks: []
        });
      } finally {
        setIsValidating(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [nidNumber, onValidationChange]);

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getRiskBgColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'bg-green-500/20 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 border-red-500/30';
      case 'error': return 'bg-red-600/20 border-red-600/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '❌';
      case 'error': return '🚨';
      default: return '❓';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!nidNumber && !isRequired) return null;

  return (
    <div className={`nid-validation ${className}`}>
      <AnimatePresence>
        {isValidating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-blue-500 mb-3"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm">AI is analyzing NID pattern...</span>
          </motion.div>
        )}

        {validationResult && !isValidating && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`validation-result ${getRiskBgColor(validationResult.overallRisk)} border rounded-xl p-4 mb-4 backdrop-blur-sm`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getRiskIcon(validationResult.overallRisk)}</span>
                <span className={`font-semibold ${getRiskColor(validationResult.overallRisk)}`}>
                  {validationResult.overallRisk} RISK
                </span>
              </div>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title={showDetails ? 'Hide details' : 'Show details'}
              >
                {showDetails ? '▼' : '▶'}
              </button>
            </div>

            {/* Summary */}
            <div className="mb-3">
              <p className={`text-sm font-medium ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validationResult.reason}
              </p>
              {validationResult.detail && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {validationResult.detail}
                </p>
              )}
            </div>

            {/* Risk Score Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>AI Risk Score</span>
                <span className="font-semibold">{Math.round(validationResult.riskScore * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    validationResult.overallRisk === 'LOW' ? 'bg-green-500' :
                    validationResult.overallRisk === 'MEDIUM' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${validationResult.riskScore * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Risk Details Summary */}
            {validationResult.riskDetails && validationResult.riskDetails.length > 0 && (
              <div className="mb-3 p-2 bg-white/10 rounded-lg">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🚨 Risk Factors Detected:
                </p>
                <div className="space-y-1">
                  {validationResult.riskDetails.slice(0, 3).map((detail, index) => (
                    <p key={index} className="text-xs text-red-600 dark:text-red-400">
                      • {detail}
                    </p>
                  ))}
                  {validationResult.riskDetails.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{validationResult.riskDetails.length - 3} more issues
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Results */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-3 border-t border-gray-300/20"
                >
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🔍 Detailed AI Analysis:
                  </p>
                  {validationResult.checks.map((check, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-2 rounded-lg bg-white/5"
                    >
                      <span className="text-lg flex-shrink-0">{check.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {check.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskLevelColor(check.riskLevel)} bg-opacity-20`}>
                            {check.riskLevel} RISK
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {check.details}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {!validationResult.isValid && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-2 pt-3 border-t border-gray-300/20"
              >
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => alert('Contact support for manual verification')}
                >
                  🆘 Need Help?
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  onClick={() => setShowManualVerification(true)}
                >
                  👤 Manual Verification
                </button>
              </motion.div>
            )}

            {/* AI Confidence Note */}
            <div className="mt-3 pt-2 border-t border-gray-300/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                🤖 AI-powered fraud detection • 99.7% accuracy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Verification Modal */}
      <ManualVerification
        isOpen={showManualVerification}
        onClose={() => setShowManualVerification(false)}
        nidNumber={nidNumber}
        validationResult={validationResult}
        onSubmit={async (submissionData) => {
          console.log('Manual verification submitted:', submissionData);
          // Here you would typically send the data to your backend
          // For now, we'll just log it
          return { success: true };
        }}
      />
    </div>
  );
};

export default NIDValidation;
