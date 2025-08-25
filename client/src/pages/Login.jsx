import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Floating particles animation
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitted(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.toString());
      setIsSubmitted(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`min-h-screen flex relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${
              isDarkMode ? "bg-blue-400/20" : "bg-blue-500/10"
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Left Side - Enhanced Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-600 to-purple-700"
              : "bg-gradient-to-br from-blue-600 to-purple-600"
          }`}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          {/* Animated geometric shapes */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white/20 rounded-lg"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              </motion.div>
              <motion.h1
                className="text-4xl font-bold mb-4"
                variants={floatingVariants}
                animate="animate"
              >
                Bhorsha Pay
              </motion.h1>
              <motion.p
                className="text-xl text-blue-100 mb-8"
                variants={itemVariants}
              >
                Secure Digital Payments Platform
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-4 text-blue-100"
              variants={containerVariants}
            >
              {[
                {
                  icon: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                  text: "Bank-level security",
                },
                {
                  icon: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                  text: "Instant transactions",
                },
                {
                  icon: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                  text: "24/7 support",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  variants={itemVariants}
                  whileHover={{
                    x: 10,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <motion.svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      fillRule="evenodd"
                      d={feature.icon}
                      clipRule="evenodd"
                    />
                  </motion.svg>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className={`w-full max-w-md space-y-8 ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-xl"
              : "bg-white/90 backdrop-blur-xl"
          } p-10 rounded-3xl shadow-2xl border ${
            isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
          } relative overflow-hidden`}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `linear-gradient(45deg, ${
                isDarkMode ? "#3B82F6" : "#6366F1"
              }, ${isDarkMode ? "#8B5CF6" : "#8B5CF6"}, ${
                isDarkMode ? "#3B82F6" : "#6366F1"
              })`,
              padding: "2px",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div
              className={`w-full h-full rounded-3xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            />
          </motion.div>

          <div className="relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.h2
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Welcome Back
                </motion.h2>
                <motion.p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Sign in to your account to continue
                </motion.p>
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative"
                  role="alert"
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    animate={{ x: [-2, 2, -2, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                    <span className="text-sm">{error}</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 transition-colors duration-200`}
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      animate={{
                        scale: focusedField === "email" ? 1.1 : 1,
                        color: focusedField === "email" ? "#3B82F6" : undefined,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className={`h-5 w-5 transition-colors duration-200 ${
                          focusedField === "email"
                            ? "text-blue-500"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </motion.div>
                    <motion.input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`block w-full pl-10 pr-3 py-3 border transition-all duration-300 ${
                        isDarkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-400`}
                      placeholder="Enter your email"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2 transition-colors duration-200`}
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      animate={{
                        scale: focusedField === "password" ? 1.1 : 1,
                        color:
                          focusedField === "password" ? "#3B82F6" : undefined,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className={`h-5 w-5 transition-colors duration-200 ${
                          focusedField === "password"
                            ? "text-blue-500"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </motion.div>
                    <motion.input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`block w-full pl-10 pr-10 py-3 border transition-all duration-300 ${
                        isDarkMode
                          ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-400`}
                      placeholder="Enter your password"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <motion.button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={{ rotate: showPassword ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {showPassword ? (
                          <svg
                            className={`h-5 w-5 ${
                              isDarkMode
                                ? "text-gray-400 hover:text-gray-300"
                                : "text-gray-400 hover:text-gray-600"
                            } transition-colors duration-200`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className={`h-5 w-5 ${
                              isDarkMode
                                ? "text-gray-400 hover:text-gray-300"
                                : "text-gray-400 hover:text-gray-600"
                            } transition-colors duration-200`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={authLoading}
                  className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                    authLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  } overflow-hidden`}
                >
                  {/* Button ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0.3 }}
                    animate={isSubmitted ? { scale: 2, opacity: 0 } : {}}
                    transition={{ duration: 0.6 }}
                  />

                  <AnimatePresence mode="wait">
                    {authLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <motion.svg
                          className="h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </motion.svg>
                        <span>Signing in...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="signin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10"
                      >
                        Sign In
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              {/* Register Link */}
              <motion.div className="text-center" variants={itemVariants}>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Don't have an account?{" "}
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 relative"
                    >
                      <motion.span
                        className="relative z-10"
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.2 }}
                      >
                        Create account
                      </motion.span>
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
