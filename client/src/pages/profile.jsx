import React, { useState, useEffect } from "react";
import { DisplayCampaigns, CampaignFilters } from "../components";
import { useStateContext } from "../context";
import { Box, Typography, Paper, Grid, Divider } from "@mui/material";
import { Email, Campaign, AccountBalance, AccessTime } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    activeCampaigns: 0,
    completedCampaigns: 0
  });

  const { address, contract, getUserCampaigns } = useStateContext();
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    setIsLoadingCampaigns(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setFilteredCampaigns(data);
    
    // Calculate stats
    const now = new Date().getTime();
    const activeCampaigns = data.filter(campaign => {
      const deadline = new Date(parseInt(campaign.deadline._hex) * 1000).getTime();
      return deadline > now;
    });
    
    setStats({
      totalCampaigns: data.length,
      totalDonations: data.reduce((sum, campaign) => sum + parseFloat(campaign.amountCollected), 0),
      activeCampaigns: activeCampaigns.length,
      completedCampaigns: data.length - activeCampaigns.length
    });
    
    setIsLoadingCampaigns(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  // Apply sorting whenever campaigns or sortOption changes
  useEffect(() => {
    if (campaigns.length === 0) return;
    
    let result = [...campaigns];
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => parseInt(b.deadline) - parseInt(a.deadline));
        break;
      case 'endingSoon':
        result.sort((a, b) => parseInt(a.deadline) - parseInt(b.deadline));
        break;
      case 'mostFunded':
        result.sort((a, b) => parseFloat(b.amountCollected) - parseFloat(a.amountCollected));
        break;
      case 'leastFunded':
        result.sort((a, b) => parseFloat(a.amountCollected) - parseFloat(b.amountCollected));
        break;
      case 'percentFunded':
        result.sort((a, b) => {
          const percentA = (parseFloat(a.amountCollected) / parseFloat(a.target)) * 100;
          const percentB = (parseFloat(b.amountCollected) / parseFloat(b.target)) * 100;
          return percentB - percentA;
        });
        break;
      default:
        break;
    }
    
    setFilteredCampaigns(result);
  }, [campaigns, sortOption]);

  return (
    <Box sx={{ p: 4 }}>
      {/* Profile Section */}
      {user && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: "linear-gradient(135deg, #1c1c24, #2a2d35)",
            color: "white"
          }}
        >
          <Grid container spacing={4}>
            {/* Profile Image */}
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1dc071&color=fff`}
                  alt="Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "4px solid #1dc071",
                    objectFit: "cover"
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    bgcolor: "#1dc071",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      bgcolor: "white"
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Profile Info */}
            <Grid item xs={12} md={9}>
              <Typography variant="h4" sx={{ color: "#1dc071", mb: 2 }}>
                {user.name}
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email sx={{ mr: 1, color: "#1dc071" }} />
                <Typography>{user.email}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#b3b3c0" }}>
                  Wallet Address: {user.defaultWalletAddress || "Not connected"}
                </Typography>
              </Box>

              <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

              {/* Stats Grid */}
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: "center", bgcolor: "rgba(255,255,255,0.1)" }}>
                    <Campaign sx={{ color: "#1dc071", mb: 1 }} />
                    <Typography variant="h6">{stats.totalCampaigns}</Typography>
                    <Typography variant="body2" sx={{ color: "#b3b3c0" }}>Total Campaigns</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: "center", bgcolor: "rgba(255,255,255,0.1)" }}>
                    <AccountBalance sx={{ color: "#1dc071", mb: 1 }} />
                    <Typography variant="h6">${stats.totalDonations.toFixed(2)}</Typography>
                    <Typography variant="body2" sx={{ color: "#b3b3c0" }}>Total Donations</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: "center", bgcolor: "rgba(255,255,255,0.1)" }}>
                    <AccessTime sx={{ color: "#1dc071", mb: 1 }} />
                    <Typography variant="h6">{stats.activeCampaigns}</Typography>
                    <Typography variant="body2" sx={{ color: "#b3b3c0" }}>Active Campaigns</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{ p: 2, textAlign: "center", bgcolor: "rgba(255,255,255,0.1)" }}>
                    <Campaign sx={{ color: "#1dc071", mb: 1 }} />
                    <Typography variant="h6">{stats.completedCampaigns}</Typography>
                    <Typography variant="body2" sx={{ color: "#b3b3c0" }}>Completed Campaigns</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Campaigns Section */}
      <Box sx={{ mt: 4 }}>
        <CampaignFilters 
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        
        <DisplayCampaigns
          title="Your Campaigns"
          isLoading={isLoadingCampaigns}
          campaigns={filteredCampaigns}
        />
      </Box>
    </Box>
  );
};

export default Profile;
