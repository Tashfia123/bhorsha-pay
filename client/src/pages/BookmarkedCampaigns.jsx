import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

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
    
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'alphabetical':
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
  
  const bookmarkSortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-[#13131a] via-[#1c1c24] to-[#13131a]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} opacity-90`}></div>
        <div className="absolute inset-0 bg-[url('/src/assets/grid.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,168,107,0.1),transparent_70%)] blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="absolute -z-10 w-full h-full blur-3xl opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at center, rgba(87, 235, 163, 0.3) 0%, transparent 70%)",
                "radial-gradient(circle at center, rgba(155, 115, 211, 0.3) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00A86B] to-[#00d68b] ${isDarkMode ? 'drop-shadow-[0_0_10px_rgba(0,168,107,0.3)]' : ''}`}>
            Your Bookmarked Campaigns
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            All your saved campaigns in one place. Keep track of the projects that matter to you.
          </p>
        </motion.div>

        {/* ✅ Corrected Conditional Rendering */}
        {filteredBookmarks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium appearance-none cursor-pointer transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-[#1c1c24]/80 backdrop-blur-sm text-white border border-white/10 hover:border-white/20 focus:border-[#00A86B]' 
                        : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 hover:border-gray-300 focus:border-[#00A86B]'
                    } focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 pr-10`}
                  >
                    {bookmarkSortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-[#1c1c24]/60 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllBookmarks}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 hover:border-red-500/50' 
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </div>
              </motion.button>
            </div>

            {/* Bookmark Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBookmarks.map((bookmark, index) => (
                <motion.div 
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group relative rounded-2xl overflow-hidden ${
                    isDarkMode 
                      ? 'bg-[#1c1c24]/80 backdrop-blur-sm border border-white/5' 
                      : 'bg-white/90 backdrop-blur-sm border border-gray-200/50'
                  } cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00A86B] via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`absolute inset-[1px] rounded-2xl ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'} group-hover:bg-opacity-95 transition-colors duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img 
                        src={bookmark.image} 
                        alt={bookmark.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 transition-colors duration-200"
                        aria-label="Remove bookmark"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                      <div className="absolute top-3 left-3 p-2 rounded-full bg-yellow-500/90 backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="p-6" onClick={() => navigate(`/campaign-details/${bookmark.title}`)}>
                      <h3 className={`font-bold text-lg mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      } line-clamp-2 group-hover:text-[#00A86B] transition-colors duration-200`}>
                        {bookmark.title}
                      </h3>
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-[#00A86B] hover:bg-[#00d68b] text-white shadow-lg hover:shadow-xl"
                        onClick={() => navigate(`/campaign-details/${bookmark.title}`)}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`flex flex-col items-center justify-center py-20 px-8 ${
              isDarkMode 
                ? 'bg-[#1c1c24]/60 backdrop-blur-sm border border-white/5' 
                : 'bg-white/60 backdrop-blur-sm border border-gray-200/50'
            } rounded-3xl shadow-xl`}
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                  : 'bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-200'
              }`}>
                <svg className={`w-12 h-12 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </motion.div>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              No bookmarked campaigns yet
            </h2>
            <p className={`text-lg text-center max-w-md mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start bookmarking campaigns you're interested in to see them here. Your saved projects will appear in this beautiful collection.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-medium transition-all duration-200 bg-[#00A86B] hover:bg-[#00d68b] text-white shadow-lg hover:shadow-xl"
              onClick={() => navigate('/home')}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Campaigns
              </div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookmarkedCampaigns;
