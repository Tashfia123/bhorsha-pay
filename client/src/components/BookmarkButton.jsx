import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const BookmarkButton = ({ campaignId, title, image }) => {
  const { isDarkMode } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Check if campaign is already bookmarked on component mount
  useEffect(() => {
    const checkBookmarkStatus = () => {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedCampaigns')) || [];
      setIsBookmarked(bookmarks.some(bookmark => bookmark.id === campaignId));
    };
    
    checkBookmarkStatus();
  }, [campaignId]);
  
  const toggleBookmark = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to parent elements
    
    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedCampaigns')) || [];
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== campaignId);
      localStorage.setItem('bookmarkedCampaigns', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // Add to bookmarks
      const newBookmark = {
        id: campaignId,
        title,
        image,
        timestamp: new Date().toISOString()
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem('bookmarkedCampaigns', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleBookmark}
      className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill={isBookmarked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </motion.button>
  );
};

export default BookmarkButton; 