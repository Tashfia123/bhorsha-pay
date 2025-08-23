import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { DisplayCampaigns, CampaignFilters } from '../components';
import { useStateContext } from '../context'
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns(contract);
    
    setCampaigns(data);
  
    // Ensure the newest campaigns (highest pId) come first
    setFilteredCampaigns([...data].sort((a, b) => b.pId - a.pId));
  
    setIsLoading(false);
    
    // Check if there's a campaign parameter in the URL
    const campaignId = searchParams.get('campaign');
    if (campaignId && data.length > 0) {
      // Find the campaign by ID
      const selectedCampaign = data.find(campaign => campaign.pId === parseInt(campaignId));
      
      if (selectedCampaign) {
        // Navigate to campaign details with the campaign data
        navigate(`/campaign-details/${selectedCampaign.title}`, { state: selectedCampaign });
      }
    }
  };
  
  

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  // Apply sorting whenever campaigns or sortOption changes
  useEffect(() => {
    if (campaigns.length === 0) return;
  
    let sortedCampaigns = [...campaigns];
  
    switch (sortOption) {
      case 'newest':
        sortedCampaigns.sort((a, b) => b.pId - a.pId); // Sort by index (newest first)
        break;
      case 'mostFunded':
        sortedCampaigns.sort((a, b) => parseFloat(b.amountCollected) - parseFloat(a.amountCollected));
        break;
      case 'leastFunded':
        sortedCampaigns.sort((a, b) => parseFloat(a.amountCollected) - parseFloat(b.amountCollected));
        break;
      case 'percentFunded':
        sortedCampaigns.sort((a, b) => {
          const percentA = (parseFloat(a.amountCollected) / parseFloat(a.target)) * 100;
          const percentB = (parseFloat(b.amountCollected) / parseFloat(b.target)) * 100;
          return percentB - percentA;
        });
        break;
      default:
        break;
    }
  
    setFilteredCampaigns(sortedCampaigns);
  }, [campaigns, sortOption]); // Runs every time campaigns change
  

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Discover Campaigns
        </h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Support innovative blockchain projects and make a difference with your contributions
        </p>
      </motion.div>
      
      <CampaignFilters 
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DisplayCampaigns 
          title="All Campaigns"
          isLoading={isLoading}
          campaigns={filteredCampaigns}
        />
      </motion.div>
    </div>
  )
}

export default Home