import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { useTheme } from "../context/ThemeContext";
import Widget from "../components/Widget";
import TopDonors from "../components/TopDonors";
import RecentProjects from "../components/RecentProjects";
import EthPriceChart from "../components/EthPriceChart";

const Dashboard = () => {
  const { getTotalDonations, contract, getCampaigns } = useStateContext();
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!contract) {
      console.warn("Contract not available. Skipping data fetch.");
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total donations
        const donations = await getTotalDonations();
        setTotalDonations(donations);

        // Fetch campaigns
        const campaigns = await getCampaigns(contract);
        setTotalCampaigns(campaigns.length);
        
        // Count active campaigns (deadline in the future)
        const now = new Date().getTime();
        const active = campaigns.filter(campaign => {
          const deadline = new Date(parseInt(campaign.deadline._hex) * 1000).getTime();
          return deadline > now;
        });
        setActiveCampaigns(active.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [contract]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`mt-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header section */}
      <div className={`px-6 py-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Project Dashboard
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Monitor your campaign metrics and funding performance
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Widget 
            title="Total Donations" 
            amount={totalDonations} 
            icon="💰" 
            trend={5}
          />
          <Widget 
            title="Total Campaigns" 
            amount={totalCampaigns} 
            icon="📊" 
            trend={12}
          />
          <Widget 
            title="Active Campaigns" 
            amount={activeCampaigns} 
            icon="🚀" 
            trend={-3}
          />
        </div>
        
        {/* ETH Price Chart */}
        <div className="mb-8">
          <EthPriceChart />
        </div>
        
        {/* Top Donors Table - Centered Section */}
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm overflow-hidden mb-8`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
            <span className="text-xl mr-2">🏆</span>
            <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Donors
            </h2>
          </div>
          <div className="p-4">
            <TopDonors />
          </div>
        </div>
        
        {/* Recent Projects Section */}
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
            <span className="text-xl mr-2">🔍</span>
            <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Campaigns
            </h2>
          </div>
          <div className="p-4">
            <RecentProjects />
          </div>
        </div>
        
        {/* Footer section */}
        <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p className="text-sm">
            Dashboard metrics last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





