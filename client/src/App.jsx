import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

import { Sidebar, Navbar } from "./components";
import WelcomePopup from "./components/WelcomePopup";
import {
  CampaignDetails,
  CreateCampaign,
  Home,
  Profile,
  DonatedCampaignsPage,
  Homepage,
  Chatbot_Assistant,
  Dashboard,
  Register,
  SearchResults,
  Login,
  ChatbotPage,
  BookmarkedCampaigns,
  CryptoRates,
  CryptoNews,
  ForgotPassword,
  ResetPassword,
  BlogList,
  BlogDetail,
  CreateBlog,
  CryptoDashboard,
} from "./pages";

const App = () => {
  const { user, loading, error } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Define routes that should not have sidebar/navbar
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith("/reset-password/")
  );

  // Redirects to login if user is not authenticated
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return (
        <div
          className={`flex items-center justify-center min-h-screen ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    return user ? children : <Navigate to="/login" />;
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render auth pages without sidebar/navbar
  if (isAuthRoute) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-[#13131a]" : "bg-gray-100"
        }`}
      >
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    );
  }

  // Render main app with sidebar/navbar for all other routes
  return (
    <div
      className={`relative sm:-8 p-4 ${
        isDarkMode ? "bg-[#13131a]" : "bg-gray-100"
      } min-h-screen flex flex-row`}
    >
      {/* Welcome Popup */}
      <WelcomePopup />

      {/* Sidebar */}
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-sm:w-full max-w-[1600px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ai" element={<ChatbotPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donated-campaigns" element={<DonatedCampaignsPage />} />
          <Route path="/bookmarks" element={<BookmarkedCampaigns />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/chatbot" element={<Chatbot_Assistant />} />
          <Route path="/crypto-rates" element={<CryptoRates />} />
          <Route path="/crypto-news" element={<CryptoNews />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route
            path="/create-blog"
            element={
              <PrivateRoute>
                <CreateBlog />
              </PrivateRoute>
            }
          />
          {/* Redirect any unmatched routes to login if not authenticated */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
