import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getBlogById, addComment, likeBlog, deleteBlog } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load blog from API
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const blogData = await getBlogById(id);
        setBlog(blogData);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Blog not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      navigate('/login?redirect=/blog/' + id);
      return;
    }
    
    if (!comment.trim()) {
      return;
    }
    
    try {
      setCommentLoading(true);
      // Add comment to blog
      const updatedBlog = await addComment(id, comment);
      
      // Update blog state
      setBlog(updatedBlog);
      // Clear comment input
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (!token) {
      navigate('/login?redirect=/blog/' + id);
      return;
    }
    
    try {
      setLikeLoading(true);
      const newLikes = await likeBlog(id);
      
      // Update blog likes
      setBlog(prev => ({
        ...prev,
        likes: newLikes
      }));
    } catch (error) {
      console.error('Error liking blog:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteBlog(id);
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleCampaignClick = (campaignId) => {
    navigate(`/home?campaign=${campaignId}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'} flex justify-center items-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#13131a]' : 'bg-gray-50'} p-4`}>
        <div className="max-w-4xl mx-auto">
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
          
          <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-[#1c1c24] text-white' : 'bg-white text-gray-800'} shadow-lg`}>
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p>{error || 'Blog not found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user is the author
  const isAuthor = user?._id === blog.author?._id;

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
          } p-6 md:p-8`}
        >
          <header className="mb-8">
            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
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
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </div>
              
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
                    className={`px-3 py-1 rounded ${
                      isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </header>
          
          <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''} mb-8`}>
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="flex items-center justify-between py-4 border-t border-b mb-8 
            border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-red-500' : 'text-gray-700 hover:text-red-500'} transition-colors`}
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{blog.likes} {blog.likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            
            <div className="flex items-center">
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
                className={`mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {blog.comments?.length || 0} {blog.comments?.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Comments
            </h3>
            
            {!token ? (
              <div className={`p-4 rounded-lg mb-6 ${
                isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                <p>Please <Link to={`/login?redirect=/blog/${id}`} className="text-[#00A86B] hover:underline">login</Link> to leave a comment.</p>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg mb-3 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white border-gray-700 focus:border-[#00A86B]' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-[#00A86B]'
                  } border focus:ring-2 focus:ring-[#00A86B]/50 outline-none transition-colors`}
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={commentLoading}
                  className={`px-4 py-2 bg-gradient-to-r from-[#00A86B] to-[#008F5B] text-white rounded-lg ${
                    commentLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            )}
            
            {blog.comments && blog.comments.length > 0 ? (
              <div className="space-y-4">
                {blog.comments.map((comment) => (
                  <div 
                    key={comment._id}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`w-4 h-4 ${isDarkMode ? 'text-[#00A86B]' : 'text-[#00A86B]'}`}
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div className="ml-2">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {comment.user?.name || 'Anonymous'}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Display campaign link if available */}
          {blog.campaign && blog.campaign.campaignId && (
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Related Campaign:</p>
                  <button 
                    onClick={() => handleCampaignClick(blog.campaign.campaignId)}
                    className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    {blog.campaign.title}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail; 