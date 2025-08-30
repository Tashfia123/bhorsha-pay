import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 5000 }) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaCheckCircle className="text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return isDarkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200';
      case 'error':
        return isDarkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200';
      case 'info':
        return isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200';
      case 'warning':
        return isDarkMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200';
      default:
        return isDarkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return isDarkMode ? 'text-green-400' : 'text-green-800';
      case 'error':
        return isDarkMode ? 'text-red-400' : 'text-red-800';
      case 'info':
        return isDarkMode ? 'text-blue-400' : 'text-blue-800';
      case 'warning':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-800';
      default:
        return isDarkMode ? 'text-green-400' : 'text-green-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${getTextColor()}`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`flex-shrink-0 ml-2 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                isDarkMode ? 'hover:bg-white' : 'hover:bg-gray-900'
              }`}
            >
              <FaTimesCircle className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
