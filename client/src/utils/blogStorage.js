// Utility functions for managing blogs in localStorage

// Get all blogs
export const getAllBlogs = () => {
  const blogs = localStorage.getItem('communityBlogs');
  return blogs ? JSON.parse(blogs) : [];
};

// Add a new blog
export const addBlog = (blog) => {
  const blogs = getAllBlogs();
  const newBlog = {
    ...blog,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  
  const updatedBlogs = [newBlog, ...blogs];
  localStorage.setItem('communityBlogs', JSON.stringify(updatedBlogs));
  return newBlog;
};

// Get a single blog by ID
export const getBlogById = (id) => {
  const blogs = getAllBlogs();
  return blogs.find(blog => blog.id === id);
};

// Update a blog
export const updateBlog = (id, updatedData) => {
  const blogs = getAllBlogs();
  const updatedBlogs = blogs.map(blog => 
    blog.id === id ? { ...blog, ...updatedData } : blog
  );
  
  localStorage.setItem('communityBlogs', JSON.stringify(updatedBlogs));
  return getBlogById(id);
};

// Delete a blog
export const deleteBlog = (id) => {
  const blogs = getAllBlogs();
  const updatedBlogs = blogs.filter(blog => blog.id !== id);
  localStorage.setItem('communityBlogs', JSON.stringify(updatedBlogs));
};

// Add a comment to a blog
export const addComment = (blogId, comment) => {
  const blog = getBlogById(blogId);
  if (!blog) return null;
  
  const newComment = {
    id: Date.now().toString(),
    ...comment,
    createdAt: new Date().toISOString()
  };
  
  const updatedComments = [...blog.comments, newComment];
  updateBlog(blogId, { comments: updatedComments });
  return newComment;
};

// Like a blog
export const likeBlog = (blogId) => {
  const blog = getBlogById(blogId);
  if (!blog) return null;
  
  const updatedLikes = blog.likes + 1;
  updateBlog(blogId, { likes: updatedLikes });
  return updatedLikes;
};

// Get user's blogs
export const getUserBlogs = (username) => {
  const blogs = getAllBlogs();
  return blogs.filter(blog => blog.author === username);
};

// Generate sample blogs if none exist
export const generateSampleBlogs = () => {
  const blogs = getAllBlogs();
  if (blogs.length === 0) {
    const sampleBlogs = [
      {
        id: '1',
        title: 'Getting Started with Blockchain Crowdfunding',
        content: 'Blockchain technology has revolutionized the way we think about crowdfunding. With its transparent and secure nature, it provides a trustworthy platform for fundraising. In this blog, I\'ll share my experience with blockchain crowdfunding and how it can benefit your projects.',
        author: 'blockchain_enthusiast',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        comments: [
          {
            id: '101',
            author: 'crypto_lover',
            content: 'Great insights! I\'ve been looking into blockchain crowdfunding for my startup.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: '2',
        title: 'How I Funded My Startup Using BlockFunder',
        content: 'Last year, I had an idea but no capital. Traditional funding routes seemed closed to me, but then I discovered BlockFunder. Within three months, I had raised enough to launch my MVP. Here\'s my journey and the lessons I learned along the way.',
        author: 'startup_founder',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 42,
        comments: [
          {
            id: '201',
            author: 'investor123',
            content: 'I\'ve been following your project since the beginning. Amazing progress!',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '202',
            author: 'newbie_entrepreneur',
            content: 'This is inspiring! Would love to hear more about how you structured your campaign.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: '3',
        title: 'The Future of Decentralized Finance',
        content: 'DeFi is changing the landscape of financial services. From lending platforms to decentralized exchanges, the possibilities are endless. In this post, I explore the current state of DeFi and make predictions about where it\'s headed in the next five years.',
        author: 'defi_analyst',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 37,
        comments: []
      }
    ];
    
    localStorage.setItem('communityBlogs', JSON.stringify(sampleBlogs));
    return sampleBlogs;
  }
  
  return blogs;
}; 