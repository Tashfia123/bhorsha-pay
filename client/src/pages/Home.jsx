import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { DisplayCampaigns, CampaignFilters } from "../components";
import { useStateContext } from "../context";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
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
    const campaignId = searchParams.get("campaign");
    if (campaignId && data.length > 0) {
      // Find the campaign by ID
      const selectedCampaign = data.find(
        (campaign) => campaign.pId === parseInt(campaignId)
      );

      if (selectedCampaign) {
        // Navigate to campaign details with the campaign data
        navigate(`/campaign-details/${selectedCampaign.title}`, {
          state: selectedCampaign,
        });
      }
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  // Apply sorting whenever campaigns or sortOption changes
  useEffect(() => {
    if (campaigns.length === 0) return;

    let sortedCampaigns = [...campaigns];

    switch (sortOption) {
      case "newest":
        sortedCampaigns.sort((a, b) => b.pId - a.pId); // Sort by index (newest first)
        break;
      case "mostFunded":
        sortedCampaigns.sort(
          (a, b) =>
            parseFloat(b.amountCollected) - parseFloat(a.amountCollected)
        );
        break;
      case "leastFunded":
        sortedCampaigns.sort(
          (a, b) =>
            parseFloat(a.amountCollected) - parseFloat(b.amountCollected)
        );
        break;
      case "percentFunded":
        sortedCampaigns.sort((a, b) => {
          const percentA =
            (parseFloat(a.amountCollected) / parseFloat(a.target)) * 100;
          const percentB =
            (parseFloat(b.amountCollected) / parseFloat(b.target)) * 100;
          return percentB - percentA;
        });
        break;
      default:
        break;
    }

    setFilteredCampaigns(sortedCampaigns);
  }, [campaigns, sortOption]); // Runs every time campaigns change

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#13131a]">
      {/* Enhanced Background Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#13131a] via-[#1c1c24] to-[#13131a] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/grid.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,168,107,0.15),transparent_70%)] blur-2xl"></div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center relative"
        >
          <motion.div
            className="absolute -z-10 w-full h-full blur-3xl opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at center, rgba(87, 235, 163, 0.3) 0%, transparent 70%)",
                "radial-gradient(circle at center, rgba(155, 115, 211, 0.3) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <h1
            className={`text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00A86B] to-[#00d68b] ${
              isDarkMode ? "drop-shadow-[0_0_10px_rgba(0,168,107,0.3)]" : ""
            }`}
          >
            Discover Campaigns
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Support innovative blockchain projects and make a difference with
            your contributions
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <CampaignFilters
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <DisplayCampaigns
            title="All Campaigns"
            isLoading={isLoading}
            campaigns={filteredCampaigns}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
