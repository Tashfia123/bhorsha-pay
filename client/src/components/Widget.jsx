import React, { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';

const Widget = ({ title, amount, icon, trend = null }) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const { isDarkMode } = useTheme();

  // Function to animate the amount
  useEffect(() => {
    if (amount === 0) {
      setAnimatedAmount(0);
      return;
    }
    
    const duration = 1500; // Animation duration in ms
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        // Easing function for smooth animation
        const progress = elapsed / duration;
        const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setAnimatedAmount(Math.floor(easedProgress * amount));
        requestAnimationFrame(animate);
      } else {
        setAnimatedAmount(amount);
      }
    };
    
    requestAnimationFrame(animate);
  }, [amount]);

  // Format the amount with commas for thousands
  const formatAmount = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Determine the trend indicator
  const renderTrend = () => {
    if (trend === null) return null;
    
    const isPositive = trend >= 0;
    
    return (
      <div className={`flex items-center ml-2 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        <span className="text-xs font-medium ml-1">{Math.abs(trend)}%</span>
      </div>
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700 shadow-lg' 
        : 'bg-white border border-gray-100 shadow-md'
    }`}>
      <div className="px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-medium uppercase tracking-wider ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {title}
          </span>
          <div className={`flex items-center justify-center p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
        
        <div className="flex items-baseline">
          <span className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title.toLowerCase().includes('donation') ? '$' : ''}
            {formatAmount(animatedAmount)}
          </span>
          {renderTrend()}
        </div>
      </div>
      
      {/* Subtle gradient accent at the bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

export default Widget;


