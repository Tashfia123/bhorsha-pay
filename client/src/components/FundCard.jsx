import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';
import { ProgressBar, BookmarkButton } from './index';
import { motion } from 'framer-motion';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick, pId }) => {
  const remainingDays = daysLeft(deadline);
  const { isDarkMode } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  useEffect(() => {
    const likedCampaigns = JSON.parse(localStorage.getItem('likedCampaigns') || '{}');
    if (likedCampaigns[pId]) {
      setIsLiked(true);
      setLikeCount(likedCampaigns[pId].count || 0);
    } else {
      const randomLikes = Math.floor(Math.random() * (156 - 18 + 1)) + 18;
      setLikeCount(randomLikes);
    }
  }, [pId]);
  
  const handleLike = (e) => {
    e.stopPropagation();
    
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    
    const newCount = newLikeStatus ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount);
    
    const likedCampaigns = JSON.parse(localStorage.getItem('likedCampaigns') || '{}');
    if (newLikeStatus) {
      likedCampaigns[pId] = { liked: true, count: newCount };
    } else {
      likedCampaigns[pId] = { liked: false, count: newCount };
    }
    localStorage.setItem('likedCampaigns', JSON.stringify(likedCampaigns));
  };
  
  const percentRaised = (parseFloat(amountCollected) / parseFloat(target)) * 100;
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`sm:w-[288px] w-full rounded-[15px] overflow-hidden ${
        isDarkMode 
          ? 'bg-[#1c1c24]/80 backdrop-blur-sm border border-white/5' 
          : 'bg-white/90 backdrop-blur-sm border border-gray-200/50'
      } cursor-pointer shadow-lg hover:shadow-xl relative group`} 
      onClick={handleClick}
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00A86B] via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-[1px] rounded-[14px] bg-[#1c1c24] group-hover:bg-[#1c1c24]/90 transition-colors duration-300"></div>
      
      {/* Top Actions */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          onClick={handleLike}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isLiked ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </motion.button>
        <BookmarkButton campaignId={pId} title={title} image={image} />
      </div>
      
      {/* Like Count */}
      <div className="absolute top-2 left-2 z-10 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
        <span className="text-xs text-white">{likeCount}</span>
      </div>
      
      {/* Campaign Image */}
      <div className="relative h-[158px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img src={image} alt="fund" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="flex flex-col p-4 relative z-10">
        {/* Campaign Title and Description */}
        <div className="block mb-3">
          <h3 className={`font-epilogue font-semibold text-[16px] ${isDarkMode ? 'text-white' : 'text-gray-800'} text-left leading-[26px] truncate`}>{title}</h3>
          <p className={`mt-[5px] font-epilogue font-normal ${isDarkMode ? 'text-[#808191]' : 'text-gray-600'} text-left leading-[18px] truncate`}>{description}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200/20 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#00A86B] to-[#008F5B]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentRaised, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>

        {/* Campaign Stats */}
        <div className="flex justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`${isDarkMode ? 'text-[#00A86B]' : 'text-green-500'}`}
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <div className="flex flex-col">
              <h4 className={`font-epilogue font-semibold text-[14px] ${isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'} leading-[22px]`}>{amountCollected}</h4>
              <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-500'} sm:max-w-[120px] truncate`}>Raised of {target}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`${isDarkMode ? 'text-[#00A86B]' : 'text-green-500'}`}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div className="flex flex-col">
              <h4 className={`font-epilogue font-semibold text-[14px] ${isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'} leading-[22px]`}>{remainingDays}</h4>
              <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-500'} sm:max-w-[120px] truncate`}>Days Left</p>
            </div>
          </div>
        </div>

        {/* Campaign Owner */}
        <div className="flex items-center gap-[12px] border-t border-gray-200/20 pt-3">
          <div className={`w-[30px] h-[30px] rounded-full flex justify-center items-center ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-100'}`}>
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
          </div>
          <p className={`flex-1 font-epilogue font-normal text-[12px] ${isDarkMode ? 'text-[#808191]' : 'text-gray-500'} truncate`}>by <span className={isDarkMode ? 'text-[#b2b3bd]' : 'text-gray-700'}>{owner}</span></p>
        </div>
      </div>
    </motion.div>
  )
}

export default FundCard