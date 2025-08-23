import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getAllBlogs, getBlogsByCampaign } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BlogList = () => {
  const { isDarkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [campaignList, setCampaignList] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [selectedCampaignId]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      let fetchedBlogs;
      if (selectedCampaignId) {
        fetchedBlogs = await getBlogsByCampaign(selectedCampaignId);
      } else {
        fetchedBlogs = await getAllBlogs();
      }
      
      setBlogs(fetchedBlogs);
      
      // Extract unique campaigns from blogs for filter dropdown
      const uniqueCampaigns = [];
      const campaignSet = new Set();
      
      fetchedBlogs.forEach(blog => {
        if (blog.campaign && blog.campaign.campaignId && !campaignSet.has(blog.campaign.campaignId)) {
          campaignSet.add(blog.campaign.campaignId);
          uniqueCampaigns.push({
            id: blog.campaign.campaignId,
            title: blog.campaign.title
          });
        }
      });
      
      setCampaignList(uniqueCampaigns);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignFilterChange = (e) => {
    setSelectedCampaignId(e.target.value);
  };

  const resetFilters = () => {
    setSelectedCampaignId('');
    setSearchTerm('');
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCampaignClick = (campaignId) => {
    navigate(`/home?campaign=${campaignId}`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          >
            Community Blog
          </motion.h1>
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-blog')}
              className="px-4 py-2 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white rounded-lg font-medium"
            >
              Write a Blog
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login?redirect=/create-blog')}
              className="px-4 py-2 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white rounded-lg font-medium"
            >
              Login to Write
            </motion.button>
          )}
        </div>

        {/* Search and filters */}
        <div className={`mb-8 p-4 rounded-lg ${isDarkMode ? 'bg-[#1c1c24] border border-gray-800' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for blogs..."
                className={`w-full px-4 py-2 rounded-lg focus:outline-none ${
                  isDarkMode 
                    ? 'bg-[#13131a] border border-gray-700 text-white' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
              />
            </div>
            
            <div className="md:w-1/4">
              <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Filter by Campaign
              </label>
              <select
                value={selectedCampaignId}
                onChange={handleCampaignFilterChange}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none ${
                  isDarkMode 
                    ? 'bg-[#13131a] border border-gray-700 text-white' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
              >
                <option value="">All Campaigns</option>
                {campaignList.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
            </div>
            
            {(searchTerm || selectedCampaignId) && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto mb-4 opacity-50" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
              />
            </svg>
            <p className="text-lg font-medium mb-2">No blog posts found</p>
            <p>
              {selectedCampaignId ? 
                'No blogs found for this campaign filter.' : 
                searchTerm ? 
                  'Try adjusting your search term.' : 
                  'Be the first to write a blog post!'
              }
            </p>
            {user && (
              <Link to="/create-blog">
                <button className="mt-4 bg-[#00A86B] text-white px-4 py-2 rounded-lg font-medium">
                  Write New Post
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`rounded-lg overflow-hidden shadow-lg relative ${
                  isDarkMode ? 'bg-[#1c1c24] border border-gray-800' : 'bg-white border border-gray-100'
                }`}
              >
                <div className={`p-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={`w-5 h-5 ${isDarkMode ? 'text-[#00A86B]' : 'text-[#00A86B]'}`}
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {blog.author?.name || 'Anonymous'}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${blog._id}`}>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-[#00A86B] transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  {blog.campaign && blog.campaign.campaignId && (
                    <button 
                      onClick={() => handleCampaignClick(blog.campaign.campaignId)}
                      className="inline-flex items-center mb-2 bg-gradient-to-r from-[#00A86B] to-[#00805e] text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {blog.campaign.title}
                    </button>
                  )}
                  
                  <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {blog.content}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
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
                        className="text-red-500 mr-1"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {blog.likes}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
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
                        className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {blog.comments?.length || 0}
                      </span>
                    </div>
                    
                    <Link 
                      to={`/blog/${blog._id}`}
                      className="text-sm text-[#00A86B] hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList; 