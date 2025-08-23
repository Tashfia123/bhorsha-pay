import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";

// Create a new blog
export const createBlogController = async (req, res) => {
  try {
    const { title, content, campaign } = req.body;
    
    // Validations
    if (!title) {
      return res.status(400).send({ success: false, message: "Title is required" });
    }
    if (!content) {
      return res.status(400).send({ success: false, message: "Content is required" });
    }
    
    // Get author from authenticated user
    const userId = req.user._id;
    
    // Verify user exists
    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(404).send({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Create blog data object
    const blogData = {
      title,
      content,
      author: userId
    };

    // Add campaign data if provided
    if (campaign && campaign.campaignId) {
      blogData.campaign = {
        campaignId: campaign.campaignId,
        title: campaign.title
      };
    }
    
    // Create and save the blog
    const blog = await new blogModel(blogData).save();
    
    // Populate author details
    const populatedBlog = await blogModel.findById(blog._id).populate('author', 'name email profilePicture');
    
    res.status(201).send({
      success: true,
      message: "Blog created successfully",
      blog: populatedBlog
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in blog creation",
      error
    });
  }
};

// Get all blogs
export const getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({})
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).send({
      success: true,
      message: "All blogs fetched successfully",
      blogs
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching blogs",
      error
    });
  }
};

// Get single blog
export const getSingleBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await blogModel.findById(id)
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture');
    
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found"
      });
    }
    
    res.status(200).send({
      success: true,
      message: "Blog fetched successfully",
      blog
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching blog",
      error
    });
  }
};

// Update blog
export const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Find blog
    const blog = await blogModel.findById(id);
    
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found"
      });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized. You are not the author of this blog"
      });
    }
    
    // Update and save
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();
    
    // Return updated blog
    const updatedBlog = await blogModel.findById(id)
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture');
    
    res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating blog",
      error
    });
  }
};

// Delete blog
export const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find blog
    const blog = await blogModel.findById(id);
    
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found"
      });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized. You are not the author of this blog"
      });
    }
    
    // Delete blog
    await blogModel.findByIdAndDelete(id);
    
    res.status(200).send({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting blog",
      error
    });
  }
};

// Add comment to blog
export const addCommentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).send({
        success: false,
        message: "Comment content is required"
      });
    }
    
    // Find blog
    const blog = await blogModel.findById(id);
    
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found"
      });
    }
    
    // Add comment
    const comment = {
      user: req.user._id,
      content
    };
    
    blog.comments.push(comment);
    await blog.save();
    
    // Return updated blog with populated data
    const updatedBlog = await blogModel.findById(id)
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture');
    
    res.status(200).send({
      success: true,
      message: "Comment added successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in adding comment",
      error
    });
  }
};

// Like blog
export const likeBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find blog
    const blog = await blogModel.findById(id);
    
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found"
      });
    }
    
    // Increment like count
    blog.likes = blog.likes + 1;
    await blog.save();
    
    res.status(200).send({
      success: true,
      message: "Blog liked successfully",
      likes: blog.likes
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in liking blog",
      error
    });
  }
};

// Get user blogs
export const getUserBlogsController = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const blogs = await blogModel.find({ author: userId })
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).send({
      success: true,
      message: "User blogs fetched successfully",
      blogs
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching user blogs",
      error
    });
  }
};

// Get blogs by campaign ID
export const getBlogsByCampaignController = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!campaignId) {
      return res.status(400).send({
        success: false,
        message: "Campaign ID is required"
      });
    }
    
    const blogs = await blogModel.find({'campaign.campaignId': campaignId})
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).send({
      success: true,
      message: "Blogs for campaign fetched successfully",
      blogs
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching blogs by campaign",
      error
    });
  }
}; 