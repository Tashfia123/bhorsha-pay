import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../context"; 
import FundCard from "../components/FundCard";

const SearchResults = () => {
  const { getCampaignsByQuery } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    setSearchQuery(query);
    if (query) {
      fetchFilteredCampaigns(query);
    }
  }, [location.search]);

  const fetchFilteredCampaigns = async (query) => {
    try {
      const campaigns = await getCampaignsByQuery(query);
      setFilteredCampaigns(campaigns);
    } catch (err) {
      console.error("Error fetching filtered campaigns:", err);
      setFilteredCampaigns([]);
    }
  };

  // Handle navigate to campaign details page
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div className="text-white min-h-screen p-6">
      <header className="bg-[#301934] p-4 rounded-t-lg">
        <h1 className="text-3xl font-semibold">Search Results</h1>
      </header>
      <div className="mt-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full p-3 rounded-lg bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006400]"
        />
      </div>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => (
            <div
              key={campaign.pId}
              className="bg-[#1a1a1a] rounded-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate(campaign)} // Trigger navigation
            >
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold truncate">{campaign.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{campaign.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[#006400] font-semibold">{campaign.amountCollected}</span>
                  <span className="text-gray-500 text-sm">{campaign.deadline}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">No campaigns found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;





