import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', {
        email,
        answer
      });

      if (response.data.success) {
        setSuccess(true);
        // Store the reset token in localStorage
        localStorage.setItem('resetToken', response.data.resetToken);
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password/' + response.data.resetToken);
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e1e2d] to-[#2a2d35] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-xl"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email and security answer to reset your password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71cab3] focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="answer" className="sr-only">
                Security Answer
              </label>
              <input
                id="answer"
                name="answer"
                type="text"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71cab3] focus:border-transparent"
                placeholder="Your favorite color"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">
              Reset token sent successfully! Redirecting...
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#71cab3] hover:bg-[#238d6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#71cab3] transition-colors duration-300"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 