import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activities, setActivities] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/admin/check-admin",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (!response.data.isAdmin) {
          navigate("/");
        }
      } catch (error) {
        console.error("Admin access check failed:", error);
        navigate("/login");
      }
    };

    if (token) {
      checkAdminAccess();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchAnalytics();
    fetchActivities();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/dashboard-stats",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/users?page=${currentPage}&status=${filterStatus}&search=${searchTerm}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/analytics",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/activities",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setActivities(response.data.activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchUsers();
      fetchDashboardStats();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleRejectUser = async (userId, reason) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/users/${userId}/reject`,
        { reason },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchUsers();
      fetchDashboardStats();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const exportData = async (format = "json") => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/export/users?format=${format}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (format === "csv") {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.csv";
        a.click();
      } else {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.json";
        a.click();
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // Refresh data when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterStatus, searchTerm]);

  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${
        isDarkMode
          ? "bg-gray-800/50 border border-gray-700/50"
          : "bg-white border border-gray-200"
      } backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
          {trend && (
            <p className={`text-xs ${color} mt-1`}>
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </motion.div>
  );

  const TabButton = ({ id, label, icon }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === id
          ? isDarkMode
            ? "bg-green-600 text-white"
            : "bg-green-500 text-white"
          : isDarkMode
          ? "text-gray-400 hover:text-white hover:bg-gray-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  );

  const UserModal = ({ user, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              User Details
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Full Name
                </label>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user.name}
                </p>
              </div>
              <div>
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Email
                </label>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user.email}
                </p>
              </div>
              <div>
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Phone
                </label>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user.phone}
                </p>
              </div>
              <div>
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  NID Number
                </label>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user.nidNumber}
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleApproveUser(user._id);
                  onClose();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Approve User
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleRejectUser(user._id, "Manual review required");
                  onClose();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Reject User
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon="👥"
          color="text-blue-500"
          trend={5}
        />
        <StatCard
          title="Pending Validation"
          value={stats.pendingUsers || 0}
          icon="⏳"
          color="text-yellow-500"
          trend={-2}
        />
        <StatCard
          title="Approved Today"
          value={stats.todayApprovals || 0}
          icon="✅"
          color="text-green-500"
          trend={12}
        />
        <StatCard
          title="Suspicious Accounts"
          value={stats.suspiciousUsers || 0}
          icon="⚠️"
          color="text-red-500"
          trend={-8}
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            isDarkMode
              ? "bg-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } backdrop-blur-sm`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Recent User Registrations
          </h3>
          <div className="space-y-3">
            {activities.recentUsers?.slice(0, 5).map((user, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.name}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : user.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            isDarkMode
              ? "bg-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } backdrop-blur-sm`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Quick Actions
          </h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("users")}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <span>👥</span>
              <span>Manage Users</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("analytics")}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <span>📊</span>
              <span>View Analytics</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportData("csv")}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span>📥</span>
              <span>Export Data</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl overflow-hidden ${
          isDarkMode
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white border border-gray-200"
        } backdrop-blur-sm`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
            >
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  User
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Contact
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Registration
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`hover:${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.name}
                        </div>
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          NID: {user.nidNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.email}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (user.status || "pending") === "approved"
                          ? "bg-green-100 text-green-800"
                          : (user.status || "pending") === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </motion.button>
                      {(user.status || "pending") === "pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApproveUser(user._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleRejectUser(user._id, "Manual review")
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </motion.button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`px-6 py-3 flex items-center justify-between border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              } ${
                isDarkMode
                  ? "text-gray-400 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              } ${
                isDarkMode
                  ? "text-gray-400 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${
          isDarkMode
            ? "bg-gray-800/50 border border-gray-700/50"
            : "bg-white border border-gray-200"
        } backdrop-blur-sm`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Registration Trends (Last 30 Days)
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Chart visualization would go here
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            isDarkMode
              ? "bg-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } backdrop-blur-sm`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Status Distribution
          </h3>
          <div className="space-y-3">
            {analytics.statusDistribution?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item._id || "Pending"}
                </span>
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            isDarkMode
              ? "bg-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } backdrop-blur-sm`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Top Suspicious Flags
          </h3>
          <div className="space-y-3">
            {analytics.suspiciousFlags?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item._id}
                </span>
                <span className={`font-semibold text-red-500`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (loading && activeTab === "dashboard") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          isDarkMode
            ? "bg-gray-800/50 border-b border-gray-700/50"
            : "bg-white/50 border-b border-gray-200/50"
        } backdrop-blur-sm sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Welcome, {user?.name}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-4 mb-8"
        >
          <TabButton id="dashboard" label="Dashboard" icon="📊" />
          <TabButton id="users" label="User Management" icon="👥" />
          <TabButton id="analytics" label="Analytics" icon="📈" />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "analytics" && renderAnalytics()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
