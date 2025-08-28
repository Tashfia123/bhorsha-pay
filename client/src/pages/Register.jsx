import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import NIDValidation from "../components/NIDValidation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nidNumber: "",
    nid: "",
    address: "",
    answer: "",
  });
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Animation variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.nidNumber,
        formData.nid,
        formData.address,
        formData.answer
      );

      if (result.success) {
        alert(result.message || "Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.toString());
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.password;
      case 2:
        return formData.phone && formData.nidNumber && formData.nid;
      case 3:
        return formData.address && formData.answer;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
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
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
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
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className={`h-5 w-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
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
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
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
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="phone"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nidNumber"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                NID Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <input
                  id="nidNumber"
                  name="nidNumber"
                  type="text"
                  autoComplete="off"
                  required
                  value={formData.nidNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your NID number (10-13 digits)"
                  maxLength="13"
                />
              </div>

              <NIDValidation
                nidNumber={formData.nidNumber}
                onValidationChange={(result) => {
                  if (result && !result.isValid) {
                    setError(`NID Validation: ${result.reason}`);
                  } else {
                    setError("");
                  }
                }}
                className="mt-2"
              />
            </div>

            <div>
              <label
                htmlFor="nid"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                NID Picture
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700/30"
                    : "border-gray-300 bg-gray-50"
                } hover:border-blue-400 transition-colors duration-200`}
              >
                <div className="space-y-2 text-center">
                  <svg
                    className={`mx-auto h-12 w-12 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div
                    className={`flex text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <label
                      htmlFor="nid"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors duration-200"
                    >
                      <span>Upload NID Picture</span>
                      <input
                        id="nid"
                        name="nid"
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
              {formData.nid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-green-700">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      File selected: {formData.nid.name}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="address"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Complete Address
              </label>
              <div className="relative group">
                <motion.div
                  className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none"
                  animate={{
                    scale: focusedField === "address" ? 1.1 : 1,
                    color: focusedField === "address" ? "#3B82F6" : undefined,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className={`h-5 w-5 ${
                      focusedField === "address"
                        ? "text-blue-500"
                        : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-400"
                    } transition-colors duration-200`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 00-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </motion.div>
                <motion.textarea
                  id="address"
                  name="address"
                  rows={3}
                  autoComplete="street-address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField("")}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800/70"
                      : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none backdrop-blur-sm group-hover:shadow-lg`}
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            {/* Security Question */}
            <motion.div
              custom={1}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="answer"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2 transition-colors duration-200`}
              >
                Security Question: What is your favorite color?
              </label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  animate={{
                    scale: focusedField === "answer" ? 1.1 : 1,
                    color: focusedField === "answer" ? "#3B82F6" : undefined,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className={`h-5 w-5 ${
                      focusedField === "answer"
                        ? "text-blue-500"
                        : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-400"
                    } transition-colors duration-200`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </motion.div>
                <motion.input
                  id="answer"
                  name="answer"
                  type="text"
                  required
                  value={formData.answer}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("answer")}
                  onBlur={() => setFocusedField("")}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800/70"
                      : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg`}
                  placeholder="Enter your favorite color"
                />
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Floating particles component
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${
            isDarkMode ? "bg-blue-400/20" : "bg-blue-500/20"
          } rounded-full`}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
          : "bg-gradient-to-br from-purple-50 via-white to-blue-50"
      }`}
    >
      <FloatingParticles />

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute top-1/4 left-1/4 w-32 h-32 ${
            isDarkMode ? "border-blue-500/10" : "border-purple-300/20"
          } border-2 rounded-full`}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-1/4 right-1/4 w-24 h-24 ${
            isDarkMode ? "border-purple-500/10" : "border-blue-300/20"
          } border-2 rotate-45`}
        />
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen relative z-10">
        {/* Left Side - Centered Branding & Progress */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md space-y-8 text-center"
          >
            {/* Centered Logo and Branding */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 ${
                    isDarkMode ? "bg-blue-600" : "bg-blue-600"
                  } rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Bhorsha Pay
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                Join our secure payment platform and experience seamless
                transactions
              </motion.p>
            </motion.div>

            {/* Animated Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-6"
            >
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-4`}
              >
                Registration Progress
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Personal Information",
                    desc: "Basic details",
                  },
                  {
                    step: 2,
                    title: "Identity Verification",
                    desc: "NID & Contact",
                  },
                  {
                    step: 3,
                    title: "Security Setup",
                    desc: "Address & Security",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <motion.div
                      animate={{
                        scale: currentStep >= item.step ? [1, 1.2, 1] : 1,
                        backgroundColor:
                          currentStep >= item.step ? "#3B82F6" : undefined,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        currentStep >= item.step
                          ? "bg-blue-600 text-white shadow-lg"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > item.step ? (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      ) : (
                        item.step
                      )}
                    </motion.div>
                    <div className="text-left">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          currentStep >= item.step
                            ? isDarkMode
                              ? "text-white"
                              : "text-gray-900"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`text-xs ${
                          currentStep >= item.step
                            ? isDarkMode
                              ? "text-gray-300"
                              : "text-gray-600"
                            : isDarkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className={`w-full max-w-md mx-auto space-y-8 ${
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
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.h2
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Create Account
                </motion.h2>
                <motion.p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Step {currentStep} of 3
                </motion.p>
              </motion.div>

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
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex space-x-3 pt-4"
                >
                  {currentStep > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={prevStep}
                      className={`flex-1 py-3 px-4 border ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                      } text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 backdrop-blur-sm`}
                    >
                      Previous
                    </motion.button>
                  )}

                  {currentStep < 3 ? (
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={`flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 relative overflow-hidden ${
                        !isStepValid()
                          ? "opacity-50 cursor-not-allowed"
                          : "shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <motion.div
                        animate={{
                          x: isStepValid() ? ["-100%", "100%"] : "-100%",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isStepValid() ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      <span className="relative z-10">Next Step</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={authLoading || !isStepValid()}
                      className={`flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 relative overflow-hidden ${
                        authLoading || !isStepValid()
                          ? "opacity-50 cursor-not-allowed"
                          : "shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {authLoading ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <motion.svg
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </motion.svg>
                          <span>Creating...</span>
                        </motion.div>
                      ) : (
                        <span className="relative z-10">Create Account</span>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-8"
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 relative group"
                  >
                    <span className="relative z-10">Sign in</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
