import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { createBlog } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useStateContext } from '../context/index';

const CreateBlog = () => {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCampaignResults, setShowCampaignResults] = useState(false);
  const [campaignSearchResults, setCampaignSearchResults] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { contract, address } = useStateContext();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/create-blog');
    }
  }, [user, navigate]);

  // Search campaigns
  const searchCampaigns = async () => {
    if (!contract) return;
    setLoading(true);
    
    try {
      const allCampaigns = await contract.call('getCampaigns');
      
      const filteredCampaigns = allCampaigns.filter(campaign => 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const parsedCampaigns = filteredCampaigns.map((campaign, i) => ({
        id: i,
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: parseInt(campaign.target._hex) / 10**18,
        deadline: new Date(parseInt(campaign.deadline._hex) * 1000).toISOString(),
        collected_amount: parseInt(campaign.collected_amount._hex) / 10**18,
        image: campaign.image
      }));
      
      setCampaignSearchResults(parsedCampaigns);
      setShowCampaignResults(true);
    } catch (error) {
      console.error('Error searching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignResults(false);
  };

  const clearSelectedCampaign = () => {
    setSelectedCampaign(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create blog data
      const blogData = {
        title,
        content
      };
      
      // Add campaign data if selected
      if (selectedCampaign) {
        blogData.campaign = {
          campaignId: selectedCampaign.id.toString(),
          title: selectedCampaign.title
        };
      }
      
      // Create new blog
      const newBlog = await createBlog(blogData);
      
      // Redirect to the new blog
      navigate(`/blog/${newBlog._id}`);
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error.response?.data?.message || 'Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/blogs" 
          className={`flex items-center mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-[#00A86B] transition-colors`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Blogs
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-lg overflow-hidden shadow-lg relative ${
            isDarkMode ? 'bg-[#1c1c24] border border-gray-800' : 'bg-white border border-gray-100'
          } p-6`}
        >
          <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Create a New Blog Post
          </h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label 
                htmlFor="title" 
                className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none ${
                  isDarkMode 
                    ? 'bg-[#13131a] border border-gray-700 text-white' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
                placeholder="Enter a catchy title for your blog post"
              />
            </div>
            
            {/* Campaign Selection */}
            <div className="mb-5">
              <label 
                className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Tag a Campaign (Optional)
              </label>
              
              {selectedCampaign ? (
                <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                  isDarkMode ? 'bg-[#2c2c34] border border-gray-700' : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {selectedCampaign.title}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedCampaign.description.substring(0, 100)}...
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedCampaign}
                    className={`text-red-500 hover:text-red-600`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full px-4 py-3 rounded-l-lg focus:outline-none ${
                        isDarkMode 
                          ? 'bg-[#13131a] border border-gray-700 text-white' 
                          : 'bg-gray-50 border border-gray-200 text-gray-800'
                      }`}
                      placeholder="Search for a campaign"
                    />
                    <button
                      type="button"
                      onClick={searchCampaigns}
                      className="px-4 py-3 bg-[#00A86B] text-white rounded-r-lg"
                    >
                      Search
                    </button>
                  </div>
                  
                  {showCampaignResults && (
                    <div className={`absolute z-10 mt-1 w-full rounded-lg overflow-auto max-h-60 ${
                      isDarkMode ? 'bg-[#2c2c34] border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      {loading ? (
                        <p className={`p-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Searching...
                        </p>
                      ) : campaignSearchResults.length === 0 ? (
                        <p className={`p-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          No campaigns found
                        </p>
                      ) : (
                        campaignSearchResults.map((campaign) => (
                          <div
                            key={campaign.id}
                            className={`p-3 cursor-pointer hover:${isDarkMode ? 'bg-[#3c3c44]' : 'bg-gray-100'} transition-colors`}
                            onClick={() => handleCampaignSelect(campaign)}
                          >
                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {campaign.title}
                            </p>
                            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {campaign.description.substring(0, 100)}...
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-5">
              <label 
                htmlFor="content" 
                className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none min-h-[200px] ${
                  isDarkMode 
                    ? 'bg-[#13131a] border border-gray-700 text-white' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
                placeholder="Share your thoughts..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 bg-[#00A86B] text-white rounded-lg font-medium hover:bg-[#008c5a] transition-colors
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBlog; 