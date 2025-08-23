import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { CustomButton, CampaignFilters } from '../components';

const BookmarkedCampaigns = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  
  useEffect(() => {
    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedCampaigns')) || [];
      setBookmarks(savedBookmarks);
      setFilteredBookmarks(savedBookmarks);
    };
    
    loadBookmarks();
    
    // Add event listener to update bookmarks if they change in another tab/component
    window.addEventListener('storage', loadBookmarks);
    
    return () => {
      window.removeEventListener('storage', loadBookmarks);
    };
  }, []);
  
  // Apply sorting whenever bookmarks or sortOption changes
  useEffect(() => {
    if (bookmarks.length === 0) return;
    
    let result = [...bookmarks];
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // Sort by timestamp (newest first)
        result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'oldest':
        // Sort by timestamp (oldest first)
        result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'alphabetical':
        // Sort alphabetically by title
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredBookmarks(result);
  }, [bookmarks, sortOption]);
  
  const removeBookmark = (id) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    localStorage.setItem('bookmarkedCampaigns', JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };
  
  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks?')) {
      localStorage.removeItem('bookmarkedCampaigns');
      setBookmarks([]);
      setFilteredBookmarks([]);
    }
  };
  
  // Custom sort options for bookmarks
  const bookmarkSortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];
  
  return (
    <div className={`flex flex-col ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="font-epilogue font-semibold text-[18px] sm:text-[25px] mb-6">
        Your Bookmarked Campaigns
      </h1>
      
      {bookmarks.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`p-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-[#2c2f32] text-white border-[#3a3a43]' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-1 focus:ring-purple-500`}
              >
                {bookmarkSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={clearAllBookmarks}
              className={`px-4 py-2 rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-red-800 hover:bg-red-700 text-white' 
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              }`}
            >
              Clear All Bookmarks
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <div 
                key={bookmark.id}
                className={`rounded-lg overflow-hidden shadow-md ${
                  isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
                } transition-transform hover:scale-105 cursor-pointer`}
              >
                <div className="relative">
                  <img 
                    src={bookmark.image} 
                    alt={bookmark.title} 
                    className="w-full h-[160px] object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(bookmark.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
                    aria-label="Remove bookmark"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4" onClick={() => navigate(`/campaign-details/${bookmark.id}`)}>
                  <h3 className={`font-epilogue font-semibold text-[16px] ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  } truncate`}>
                    {bookmark.title}
                  </h3>
                  <p className={`mt-2 text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <CustomButton 
                      btnType="button"
                      title="View Details"
                      styles={isDarkMode ? "bg-[#8c6dfd]" : "bg-[#1dc071]"}
                      handleClick={() => navigate(`/campaign-details/${bookmark.id}`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={`flex flex-col items-center justify-center py-12 ${
          isDarkMode ? 'bg-[#1c1c24]' : 'bg-gray-50'
        } rounded-lg`}>
          <svg className={`w-16 h-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h2 className="text-xl font-medium mb-2">No bookmarked campaigns yet</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            Start bookmarking campaigns you're interested in to see them here.
          </p>
          <CustomButton 
            btnType="button"
            title="Browse Campaigns"
            styles={isDarkMode ? "bg-[#8c6dfd]" : "bg-[#1dc071]"}
            handleClick={() => navigate('/home')}
          />
        </div>
      )}
    </div>
  );
};

export default BookmarkedCampaigns; 