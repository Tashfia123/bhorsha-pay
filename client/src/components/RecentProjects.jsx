import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, LinearProgress, Tooltip } from "@mui/material";
import { daysLeft } from "../utils";
import { FaFire, FaCrown, FaCalendarAlt, FaCoins, FaBullseye } from "react-icons/fa";

const RecentProjects = () => {
  const { contract, getCampaigns } = useStateContext();
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract) return;

      setIsLoading(true);
      try {
        const campaigns = await getCampaigns(contract);
        // Sort campaigns by newest first (highest pId)
        const sortedCampaigns = [...campaigns].sort((a, b) => b.pId - a.pId);
        // Take the first 5 campaigns (most recent)
        setRecentCampaigns(sortedCampaigns.slice(0, 5));
      } catch (error) {
        console.error("❌ Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract]); // Fetch campaigns when contract is available

  // Handle Navigation to Campaign Details Page
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  // Calculate progress percentage
  const calculateProgress = (amountCollected, target) => {
    return Math.min(100, (parseFloat(amountCollected) / parseFloat(target)) * 100);
  };

  // Format the amount with max 4 decimal places
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(4);
  };

  // Get status of campaign
  const getCampaignStatus = (deadline) => {
    const remaining = daysLeft(deadline);
    if (remaining <= 0) return "Ended";
    if (remaining <= 3) return "Ending Soon";
    return "Active";
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case "Ended": return "#f44336";
      case "Ending Soon": return "#ff9800";
      case "Active": return "#4caf50";
      default: return "#4caf50";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card sx={{ backgroundColor: "#1a1e2e", color: "white", borderRadius: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <div className="w-12 h-12 border-4 border-t-transparent border-[#ff5252] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading recent projects...</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (recentCampaigns.length === 0) {
    return (
      <Card sx={{ backgroundColor: "#1a1e2e", color: "white", borderRadius: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <div className="text-[#ff5252] text-6xl mb-4">
            <FaFire />
          </div>
          <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
          <p className="text-gray-400 text-center">Be the first to start a crowdfunding campaign!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      backgroundColor: "#1a1e2e", 
      color: "white", 
      borderRadius: 2, 
      p: 2, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      },
    }}>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg mr-3">
              <FaCrown className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Recent Projects
            </h2>
          </div>
          <Chip 
            label={`${recentCampaigns.length} Projects`} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255, 82, 82, 0.1)', 
              color: '#ff5252',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 82, 82, 0.2)'
            }} 
          />
        </div>

        <TableContainer sx={{ borderRadius: 1, overflow: 'hidden' }}>
          <Table>
            {/* Table Head */}
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: "rgba(26, 32, 53, 0.7)",
                '& th': { 
                  borderBottom: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '12px 16px',
                },
              }}>
                <TableCell sx={{ color: "#8f97b2" }}>Project</TableCell>
                <TableCell sx={{ color: "#8f97b2" }}>Target</TableCell>
                <TableCell sx={{ color: "#8f97b2" }}>Progress</TableCell>
                <TableCell sx={{ color: "#8f97b2" }}>Status</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {recentCampaigns.map((project, index) => {
                const progress = calculateProgress(project.amountCollected, project.target);
                const status = getCampaignStatus(project.deadline);
                return (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s',
                      "&:hover": { 
                        backgroundColor: "rgba(41, 43, 62, 0.5)", 
                        cursor: "pointer",
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      },
                      "&:last-child": {
                        borderBottom: 'none',
                      },
                    }}
                    onClick={() => handleNavigate(project)}
                  >
                    {/* Project */}
                    <TableCell sx={{ py: 2 }}>
                      <div className="flex items-center">
                        <Avatar 
                          src={project.image} 
                          sx={{ 
                            width: 44, 
                            height: 44, 
                            border: '2px solid rgba(255, 82, 82, 0.7)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            mr: 2,
                          }} 
                          variant="rounded"
                        />
                        <div>
                          <div className="font-bold text-[#f1c40f]">
                            {project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center">
                            <FaCalendarAlt className="mr-1" /> {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Target */}
                    <TableCell>
                      <div className="flex flex-col">
                        <Tooltip title="Target amount" arrow placement="top">
                          <div className="flex items-center text-white font-bold">
                            <FaBullseye className="mr-2 text-[#f1c40f]" />
                            {formatAmount(project.target)} ETH
                          </div>
                        </Tooltip>
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <FaCoins className="mr-1" /> {formatAmount(project.amountCollected)} ETH raised
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Progress */}
                    <TableCell>
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white font-bold">{progress.toFixed(0)}%</span>
                        </div>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: progress >= 100 
                                ? '#4caf50' 
                                : progress > 60 
                                  ? '#2196f3' 
                                  : '#ff9800',
                              borderRadius: 4,
                              backgroundImage: progress >= 100 
                                ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
                                : progress > 60 
                                  ? 'linear-gradient(90deg, #2196f3, #03a9f4)' 
                                  : 'linear-gradient(90deg, #ff9800, #ffeb3b)',
                            },
                          }}
                        />
                      </div>
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell>
                      <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${getStatusColor(status)}20`, 
                          color: getStatusColor(status),
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          border: `1px solid ${getStatusColor(status)}40`,
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentProjects;

