import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, target }) => {
  const { isDarkMode } = useTheme();
  
  // Calculate percentage with a maximum of 100%
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between mb-1">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {percentage.toFixed(0)}% Funded
        </span>
        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Goal: {target} ETH
        </span>
      </div>
      <div className={`w-full h-2.5 rounded-full ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-200/50'} overflow-hidden`}>
        <motion.div 
          className="h-2.5 rounded-full bg-gradient-to-r from-[#00A86B] to-[#008F5B]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar; 