import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const CountdownTimer = ({ deadline }) => {
  const { isDarkMode } = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline * 1000) - new Date();
      
      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [deadline]);
  
  return (
    <div className={`mt-2 ${isExpired ? 'text-red-500' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {isExpired ? (
        <div className="text-center font-medium">Campaign Ended</div>
      ) : (
        <div className="flex justify-center space-x-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{timeLeft.days}</span>
            <span className="text-xs">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{timeLeft.hours}</span>
            <span className="text-xs">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{timeLeft.minutes}</span>
            <span className="text-xs">Mins</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{timeLeft.seconds}</span>
            <span className="text-xs">Secs</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer; 