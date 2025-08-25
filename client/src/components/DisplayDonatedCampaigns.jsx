import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FundCard from "./FundCard";
import { loader } from "../assets";
import { useStateContext } from "../context";

const DisplayDonatedCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const { getDonations } = useStateContext(); // Get the function to fetch donations
  const [donationTotals, setDonationTotals] = useState({}); // Store total donations for each campaign

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  useEffect(() => {
    // Fetch total donations for each campaign
    const fetchDonationTotals = async () => {
      const totals = {};
      for (const campaign of campaigns) {
        const donations = await getDonations(campaign.pId); // Get donations for each campaign
        const totalDonated = donations.reduce(
          (acc, donation) => acc + parseFloat(donation.donation),
          0
        );
        totals[campaign.pId] = totalDonated; // Store the total donations for each campaign
      }
      setDonationTotals(totals);
    };

    if (campaigns.length > 0) {
      fetchDonationTotals();
    }
  }, [campaigns, getDonations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="font-epilogue font-semibold text-2xl text-white mb-4 text-center">
          {title} ({campaigns.length})
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {isLoading && (
          <div className="flex justify-center w-full py-10">
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>
        )}

        {!isLoading && campaigns.length === 0 && (
          <div className="text-center py-12 w-full">
            <p className="font-epilogue font-semibold text-lg text-[#818183]">
              No campaigns found
            </p>
          </div>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <div key={campaign.pId} className="relative w-full sm:w-[288px]">
              <FundCard
                {...campaign}
                handleClick={() => handleNavigate(campaign)}
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#1c1c24]/90 backdrop-blur-sm rounded-b-lg border-t border-[#00A86B]/20">
                <p className="font-epilogue font-semibold text-[14px] text-center text-white">
                  Total Donated:{" "}
                  {donationTotals[campaign.pId]
                    ? donationTotals[campaign.pId].toFixed(2)
                    : 0}{" "}
                  ETH
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DisplayDonatedCampaigns;
