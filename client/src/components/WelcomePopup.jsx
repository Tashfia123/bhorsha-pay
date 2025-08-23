import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaRocket, FaHandshake, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const WelcomePopup = ({ show: externalShow, onClose: externalOnClose }) => {
  const [show, setShow] = useState(false);
  const { isDarkMode } = useTheme();

  // Store popup state in localStorage to prevent showing it again
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    if (hasSeenPopup) {
      setShow(false);
    }
  }, []);

  // Update internal state when external show prop changes
  useEffect(() => {
    if (externalShow !== undefined) {
      setShow(externalShow);
    }
  }, [externalShow]);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
    if (externalOnClose) {
      externalOnClose();
    }
  };

  // Method to show popup (can be called from parent)
  const showPopup = () => {
    setShow(true);
  };

  // Expose showPopup method to parent
  if (typeof window !== 'undefined') {
    window.showWelcomePopup = showPopup;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full max-w-2xl rounded-2xl p-8 ${
              isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
            } shadow-2xl`}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <FaTimes className={`text-xl ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full ${
                  isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <FaRocket className="text-4xl text-purple-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                👋 Welcome to BlockFunder! 🚀
              </h1>

              {/* Description */}
              <p className={`text-lg mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Bangladesh's premier blockchain-based crowdfunding platform
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-50'
                }`}>
                  <FaHandshake className="text-2xl text-purple-500 mb-2" />
                  <h3 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Decentralized
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Built on blockchain technology for transparency and security
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-50'
                }`}>
                  <FaRocket className="text-2xl text-purple-500 mb-2" />
                  <h3 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Easy to Use
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Simple and intuitive interface for seamless crowdfunding
                  </p>
                </div>
              </div>

              {/* Get Started Button */}
              <button
                onClick={handleClose}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup; 