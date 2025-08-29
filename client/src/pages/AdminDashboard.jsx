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

    // Check if we have saved data in localStorage
    const savedUsers = localStorage.getItem('adminUsers');
    const savedStats = localStorage.getItem('adminStats');
    
    if (savedUsers && savedStats) {
      // Load saved data
      setUsers(JSON.parse(savedUsers));
      setStats(JSON.parse(savedStats));
    } else {
      // Set initial mock data
      const initialUsers = [
        {
          _id: "1",
          name: "Tashfia",
          email: "tashfiahassan77@gmail.com",
          phone: "01911958513",
          nidNumber: "2353780837728",
          status: "pending",
          createdAt: new Date("2025-08-29").toISOString()
        },
        {
          _id: "2", 
          name: "jkkk",
          email: "tashfia123@admin.com",
          phone: "",
          nidNumber: "12333",
          status: "pending",
          createdAt: new Date("2025-08-28").toISOString()
        },
        {
          _id: "3",
          name: "Shefayat E Shams Adib",
          email: "shefadib@gmail.com", 
          phone: "+8801776292492",
          nidNumber: "01776292490",
          status: "pending",
          createdAt: new Date("2025-08-28").toISOString()
        },
        {
          _id: "4",
          name: "tt",
          email: "tashfia@admin.com",
          phone: "tash@gmail.com",
          nidNumber: "",
          status: "pending",
          createdAt: new Date("2025-08-24").toISOString()
        }
      ];
      
      const initialStats = {
        totalUsers: 4,
        pendingUsers: 4,
        todayApprovals: 0,
        suspiciousUsers: 0
      };
      
      setUsers(initialUsers);
      setStats(initialStats);
      
      // Save to localStorage
      localStorage.setItem('adminUsers', JSON.stringify(initialUsers));
      localStorage.setItem('adminStats', JSON.stringify(initialStats));
    }
    
    setLoading(false);
    
    // Try to fetch from API if available
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
      // Update local state immediately for better UX
      const updatedUsers = users.map(user => 
        user._id === userId 
          ? { ...user, status: "approved" }
          : user
      );
      
      const updatedStats = {
        ...stats,
        pendingUsers: Math.max(0, (stats.pendingUsers || 0) - 1),
        todayApprovals: (stats.todayApprovals || 0) + 1
      };
      
      setUsers(updatedUsers);
      setStats(updatedStats);
      
      // Save to localStorage
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('adminStats', JSON.stringify(updatedStats));

      // Show success message
      alert("User approved successfully!");
      
      // Optional: Make API call if backend is available
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

      } catch (apiError) {
        console.log("Backend API not available, using local state only");
      }
    } catch (error) {

      console.error("Error approving user:", error);

      alert("Error approving user. Please try again.");
    }

  };



  const handleRejectUser = async (userId, reason) => {

    try {
      // Update local state immediately for better UX
      const updatedUsers = users.map(user => 
        user._id === userId 
          ? { ...user, status: "rejected" }
          : user
      );
      
      const updatedStats = {
        ...stats,
        pendingUsers: Math.max(0, (stats.pendingUsers || 0) - 1)
      };
      
      setUsers(updatedUsers);
      setStats(updatedStats);
      
      // Save to localStorage
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('adminStats', JSON.stringify(updatedStats));

      // Show success message
      alert("User rejected successfully!");
      
      // Optional: Make API call if backend is available
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

      } catch (apiError) {
        console.log("Backend API not available, using local state only");
      }
    } catch (error) {

      console.error("Error rejecting user:", error);

      alert("Error rejecting user. Please try again.");
    }
  };

  // Filter users based on status and search term
  const filteredUsers = users.filter(user => {
    // Search filtering
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
                         user.name.toLowerCase().includes(searchLower) ||
                         user.email.toLowerCase().includes(searchLower) ||
                         (user.nidNumber && user.nidNumber.toLowerCase().includes(searchLower));
    
    // Status filtering
    const userStatus = user.status || "pending";
    const matchesStatus = filterStatus === "all" || userStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Reset function to clear localStorage and reset to initial state
  const resetToInitialState = () => {
    localStorage.removeItem('adminUsers');
    localStorage.removeItem('adminStats');
    window.location.reload();
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

            placeholder="Search users by name, email, or NID..."
            value={searchTerm}

            onChange={(e) => setSearchTerm(e.target.value)}

            className={`w-full px-4 py-2 rounded-lg border ${

              isDarkMode

                ? "bg-gray-800 border-gray-700 text-white"

                : "bg-white border-gray-300 text-gray-900"

            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}

          />

        </div>

        <div className="flex items-center gap-2">
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

          {filterStatus !== "all" && (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                filterStatus === "approved"
                  ? isDarkMode 
                    ? "bg-green-900/30 text-green-400 border border-green-500/30"
                    : "bg-green-100 text-green-800"
                  : filterStatus === "rejected"
                  ? isDarkMode
                    ? "bg-red-900/30 text-red-400 border border-red-500/30"
                    : "bg-red-100 text-red-800"
                  : isDarkMode
                    ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {filterStatus}
            </span>
          )}
        </div>
      </div>

      
      {/* Filter Results Summary */}
      {(searchTerm || filterStatus !== "all") && (
        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && ` matching "${searchTerm}"`}
          {filterStatus !== "all" && ` with status "${filterStatus}"`}
        </div>
      )}


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

              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-lg font-medium mb-2">No users found</p>
                      <p className="text-sm">
                        {searchTerm 
                          ? `No users match "${searchTerm}"`
                          : filterStatus !== "all"
                          ? `No users with status "${filterStatus}"`
                          : "No users available"
                        }
                      </p>
                      {(searchTerm || filterStatus !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setFilterStatus("all");
                          }}
                          className={`mt-3 px-4 py-2 rounded-lg text-sm ${
                            isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          } transition-colors`}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
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

                           ? isDarkMode 
                             ? "bg-green-900/30 text-green-400 border border-green-500/30"
                             : "bg-green-100 text-green-800"
                          : (user.status || "pending") === "rejected"

                           ? isDarkMode
                             ? "bg-red-900/30 text-red-400 border border-red-500/30"
                             : "bg-red-100 text-red-800"
                           : isDarkMode
                             ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
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

               ))
             )}
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



  const renderAnalytics = () => {
    // Mock data for charts
    const registrationData = [
      { date: '2025-01-01', count: 12 },
      { date: '2025-01-02', count: 19 },
      { date: '2025-01-03', count: 15 },
      { date: '2025-01-04', count: 25 },
      { date: '2025-01-05', count: 22 },
      { date: '2025-01-06', count: 30 },
      { date: '2025-01-07', count: 28 },
      { date: '2025-01-08', count: 35 },
      { date: '2025-01-09', count: 32 },
      { date: '2025-01-10', count: 40 },
      { date: '2025-01-11', count: 38 },
      { date: '2025-01-12', count: 45 },
      { date: '2025-01-13', count: 42 },
      { date: '2025-01-14', count: 50 },
      { date: '2025-01-15', count: 48 },
      { date: '2025-01-16', count: 55 },
      { date: '2025-01-17', count: 52 },
      { date: '2025-01-18', count: 60 },
      { date: '2025-01-19', count: 58 },
      { date: '2025-01-20', count: 65 },
      { date: '2025-01-21', count: 62 },
      { date: '2025-01-22', count: 70 },
      { date: '2025-01-23', count: 68 },
      { date: '2025-01-24', count: 75 },
      { date: '2025-01-25', count: 72 },
      { date: '2025-01-26', count: 80 },
      { date: '2025-01-27', count: 78 },
      { date: '2025-01-28', count: 85 },
      { date: '2025-01-29', count: 82 },
      { date: '2025-01-30', count: 90 }
    ];

    const statusData = [
      { status: 'Pending', count: 45, color: '#fbbf24' },
      { status: 'Approved', count: 120, color: '#10b981' },
      { status: 'Rejected', count: 15, color: '#ef4444' }
    ];

    const monthlyData = [
      { month: 'Jan', registrations: 120, approvals: 95, rejections: 8 },
      { month: 'Feb', registrations: 150, approvals: 120, rejections: 12 },
      { month: 'Mar', registrations: 180, approvals: 145, rejections: 15 },
      { month: 'Apr', registrations: 200, approvals: 170, rejections: 18 },
      { month: 'May', registrations: 220, approvals: 190, rejections: 20 },
      { month: 'Jun', registrations: 250, approvals: 220, rejections: 22 }
    ];

    const suspiciousData = [
      { flag: 'Duplicate NID', count: 8, color: '#ef4444' },
      { flag: 'Invalid Email', count: 12, color: '#f97316' },
      { flag: 'Suspicious IP', count: 5, color: '#eab308' },
      { flag: 'Multiple Accounts', count: 3, color: '#8b5cf6' }
    ];

    return (
    <div className="space-y-6">

        {/* Registration Trends Chart */}
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

                     <div className="h-80 relative">
             <svg width="100%" height="100%" className="overflow-visible" viewBox="0 0 800 320">
               {/* Grid lines */}
               {[...Array(6)].map((_, i) => (
                 <line
                   key={i}
                   x1="0"
                   y1={((i + 1) * 320) / 6}
                   x2="800"
                   y2={((i + 1) * 320) / 6}
                   stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                   strokeWidth="1"
                   opacity="0.5"
                 />
               ))}
               
               {/* Chart line */}
               <polyline
                 fill="none"
                 stroke={isDarkMode ? "#10b981" : "#059669"}
                 strokeWidth="3"
                 points={registrationData.map((d, i) => {
                   const x = (i / (registrationData.length - 1)) * 800;
                   const y = 320 - (d.count / 90) * 320;
                   return `${x},${y}`;
                 }).join(' ')}
               />
               
               {/* Data points */}
               {registrationData.map((d, i) => {
                 const x = (i / (registrationData.length - 1)) * 800;
                 const y = 320 - (d.count / 90) * 320;
                 return (
                   <circle
                     key={i}
                     cx={x}
                     cy={y}
                     r="6"
                     fill={isDarkMode ? "#10b981" : "#059669"}
                     className="hover:r-8 transition-all duration-200"
                     stroke={isDarkMode ? "#ffffff" : "#ffffff"}
                     strokeWidth="2"
                   />
                 );
               })}
             </svg>
             
             {/* Y-axis labels */}
             <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
               <span>90</span>
               <span>75</span>
               <span>60</span>
               <span>45</span>
               <span>30</span>
               <span>15</span>
               <span>0</span>
             </div>
             
             {/* X-axis labels */}
             <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
               <span>Jan 1</span>
               <span>Jan 10</span>
               <span>Jan 20</span>
               <span>Jan 30</span>
             </div>
           </div>
        </motion.div>

                 {/* Weekly Activity Mini Chart */}
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
             Weekly Activity
           </h3>
           <div className="h-32 relative">
             <svg width="100%" height="100%" className="overflow-visible" viewBox="0 0 400 128">
               {/* Grid lines */}
               {[...Array(4)].map((_, i) => (
                 <line
                   key={i}
                   x1="0"
                   y1={((i + 1) * 128) / 4}
                   x2="400"
                   y2={((i + 1) * 128) / 4}
                   stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                   strokeWidth="1"
                   opacity="0.3"
                 />
               ))}
               
               {/* Activity line */}
               <polyline
                 fill="none"
                 stroke={isDarkMode ? "#3b82f6" : "#2563eb"}
                 strokeWidth="2"
                 points={[
                   "0,100", "50,80", "100,60", "150,40", 
                   "200,70", "250,50", "300,30", "350,20", "400,10"
                 ].join(' ')}
               />
               
               {/* Data points */}
               {[
                 { x: 0, y: 100 }, { x: 50, y: 80 }, { x: 100, y: 60 }, { x: 150, y: 40 },
                 { x: 200, y: 70 }, { x: 250, y: 50 }, { x: 300, y: 30 }, { x: 350, y: 20 }, { x: 400, y: 10 }
               ].map((point, i) => (
                 <circle
                   key={i}
                   cx={point.x}
                   cy={point.y}
                   r="3"
                   fill={isDarkMode ? "#3b82f6" : "#2563eb"}
                   className="hover:r-4 transition-all duration-200"
                   stroke={isDarkMode ? "#ffffff" : "#ffffff"}
                   strokeWidth="1"
                 />
               ))}
             </svg>
             
             {/* X-axis labels */}
             <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
             </div>
           </div>
           
           {/* Stats summary */}
           <div className="flex justify-between mt-4 text-sm">
             <div className="text-center">
               <div className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>156</div>
               <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>This Week</div>
             </div>
             <div className="text-center">
               <div className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>+12%</div>
               <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>vs Last Week</div>
             </div>
             <div className="text-center">
               <div className={`font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>22</div>
               <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Avg/Day</div>
             </div>
        </div>

      </motion.div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Status Distribution Pie Chart */}
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

                         <div className="flex items-center justify-center">
               <div className="relative w-64 h-64">
                 {/* Pie Chart */}
                 <svg width="256" height="256" className="transform -rotate-90">
                  {(() => {
                    const total = statusData.reduce((sum, d) => sum + d.count, 0);
                    let currentAngle = 0;
                    
                                         return statusData.map((data, index) => {
                       const percentage = (data.count / total) * 100;
                       const angle = (percentage / 100) * 360;
                       const x1 = 128 + 100 * Math.cos((currentAngle * Math.PI) / 180);
                       const y1 = 128 + 100 * Math.sin((currentAngle * Math.PI) / 180);
                       const x2 = 128 + 100 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                       const y2 = 128 + 100 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                       
                       const largeArcFlag = angle > 180 ? 1 : 0;
                       
                       const pathData = [
                         `M 128 128`,
                         `L ${x1} ${y1}`,
                         `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                         'Z'
                       ].join(' ');
                      
                      currentAngle += angle;
                      
                      return (
                        <path
                          key={index}
                          d={pathData}
                          fill={data.color}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      );
                    });
                  })()}
                </svg>
                
                                 {/* Center text */}
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center">
                     <div className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                       {statusData.reduce((sum, d) => sum + d.count, 0)}
                     </div>
                     <div className={`text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                       Total Users
                     </div>
                   </div>
                 </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {statusData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">

                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {data.status}
                </span>

                  </div>
                  <span className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {data.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Suspicious Flags Bar Chart */}
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

              Suspicious Activity Flags
            </h3>
                         <div className="space-y-4">
               {suspiciousData.map((data, index) => (
                 <div key={index} className="space-y-2">
                   <div className="flex justify-between items-center">
                     <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                       {data.flag}
                     </span>
                     <span className="font-semibold text-red-500 text-lg">
                       {data.count}
                </span>

                   </div>
                   <div className={`w-full rounded-full h-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                     <div
                       className="h-3 rounded-full transition-all duration-500 shadow-sm"
                       style={{
                         width: `${(data.count / Math.max(...suspiciousData.map(d => d.count))) * 100}%`,
                         backgroundColor: data.color
                       }}
                     ></div>
                   </div>
              </div>

            ))}

          </div>

        </motion.div>

        </div>


        {/* Real-time Activity Feed */}
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

            Recent Activity Feed
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              { time: '2 min ago', action: 'User approved', user: 'Tashfia', type: 'approval' },
              { time: '5 min ago', action: 'New registration', user: 'John Doe', type: 'registration' },
              { time: '8 min ago', action: 'User rejected', user: 'Jane Smith', type: 'rejection' },
              { time: '12 min ago', action: 'Suspicious activity detected', user: 'Unknown IP', type: 'suspicious' },
              { time: '15 min ago', action: 'User approved', user: 'Mike Johnson', type: 'approval' },
              { time: '20 min ago', action: 'New registration', user: 'Sarah Wilson', type: 'registration' },
              { time: '25 min ago', action: 'User rejected', user: 'Tom Brown', type: 'rejection' },
              { time: '30 min ago', action: 'User approved', user: 'Lisa Davis', type: 'approval' }
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'approval' ? 'bg-green-500' :
                  activity.type === 'rejection' ? 'bg-red-500' :
                  activity.type === 'registration' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {activity.user}
                  </p>
                </div>
                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {activity.time}
                </span>

              </div>

            ))}

          </div>

        </motion.div>

    </div>

  );

  };


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

               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={resetToInitialState}
                 className={`px-3 py-1 text-xs rounded-lg ${
                   isDarkMode 
                     ? "bg-red-600 hover:bg-red-700 text-white" 
                     : "bg-red-500 hover:bg-red-600 text-white"
                 } transition-colors`}
                 title="Reset to initial state"
               >
                 Reset
               </motion.button>
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

