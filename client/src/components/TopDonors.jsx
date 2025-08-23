import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { useTheme } from "../context/ThemeContext";
import { Card, CardContent, Chip, Tooltip } from "@mui/material";
import { FaTrophy, FaMedal, FaEthereum, FaUserAstronaut, FaChartLine } from "react-icons/fa";

const getAvatar = (address) => {
  return `https://robohash.org/${address}?set=set5&size=150x150`;
};

const TopDonors = () => {
  const { getTopDonors } = useStateContext();
  const [topDonors, setTopDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchTopDonors = async () => {
      setIsLoading(true);
      try {
        const donors = await getTopDonors();
        setTopDonors(donors);
      } catch (error) {
        console.error("Error fetching top donors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopDonors();
  }, [getTopDonors]);

  const maxDonation = topDonors.length > 0 ? Math.max(...topDonors.map(d => parseFloat(d.total))) : 1;

  // Format ETH with commas and fixed decimals
  const formatEth = (value) => {
    return parseFloat(value).toFixed(4);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card sx={{ backgroundColor: "#1a1e2e", color: "white", borderRadius: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <div className="w-12 h-12 border-4 border-t-transparent border-[#ff5252] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading top donors...</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (topDonors.length === 0) {
    return (
      <Card sx={{ backgroundColor: "#1a1e2e", color: "white", borderRadius: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <div className="text-[#ff5252] text-6xl mb-4">
            <FaUserAstronaut />
          </div>
          <h3 className="text-xl font-bold mb-2">No Donors Yet</h3>
          <p className="text-gray-400 text-center">Be the first to donate to a campaign!</p>
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
            <div className="bg-gradient-to-r from-amber-500 to-yellow-300 p-2 rounded-lg mr-3">
              <FaTrophy className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Top Donors
            </h2>
          </div>
          <Chip 
            label={`${topDonors.length} Donors`} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255, 193, 7, 0.1)', 
              color: '#ffc107',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 193, 7, 0.2)'
            }} 
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left" style={{ color: "#8f97b2" }}>
                <th className="px-3 py-3 text-xs font-medium uppercase tracking-wider">Rank</th>
                <th className="px-3 py-3 text-xs font-medium uppercase tracking-wider">Donor</th>
                <th className="px-3 py-3 text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-3 py-3 text-xs font-medium uppercase tracking-wider">Donation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {topDonors.map((donor, index) => {
                const percentage = (parseFloat(donor.total) / maxDonation) * 100;
                
                // Get rank medal components
                let rankComponent;
                if (index === 0) {
                  rankComponent = (
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/20">
                      <FaTrophy className="text-white" />
                    </div>
                  );
                } else if (index === 1) {
                  rankComponent = (
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-400 to-gray-300 shadow-lg shadow-gray-400/20">
                      <FaMedal className="text-white" />
                    </div>
                  );
                } else if (index === 2) {
                  rankComponent = (
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-700 to-amber-500 shadow-lg shadow-amber-700/20">
                      <FaMedal className="text-white" />
                    </div>
                  );
                } else {
                  rankComponent = (
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  );
                }
                
                return (
                  <tr 
                    key={index} 
                    className={`
                      transition-colors hover:bg-gray-800/30
                    `}
                  >
                    {/* Rank Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      {rankComponent}
                    </td>
                    
                    {/* Donor Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-opacity-30 ring-offset-gray-800 shadow-lg"
                            src={getAvatar(donor.donor)} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <Tooltip title={donor.donor} arrow placement="top">
                            <div className="text-sm font-medium text-white">
                              {donor.donor.substring(0, 6)}...{donor.donor.slice(-4)}
                            </div>
                          </Tooltip>
                          <div className="text-xs text-gray-400">
                            {donor.campaigns} Campaign{donor.campaigns !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Amount Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2 text-[#ffc107]">
                          <FaEthereum size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {formatEth(donor.total)} ETH
                          </div>
                          <div className="text-xs text-gray-400">
                            {index === 0 ? 'Top Donor 🏆' : `${percentage.toFixed(0)}% of Top`}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Progress Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="w-full flex items-center">
                        <div className="flex-1">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-300' 
                                  : index === 1 
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-300' 
                                    : index === 2 
                                      ? 'bg-gradient-to-r from-amber-700 to-amber-500'
                                      : 'bg-blue-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-2">
                          <FaChartLine className={`
                            ${index < 3 ? 'text-[#ffc107]' : 'text-blue-500'}
                          `} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDonors;


