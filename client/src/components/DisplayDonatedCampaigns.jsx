import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { useStateContext } from '../context';

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
        const totalDonated = donations.reduce((acc, donation) => acc + parseFloat(donation.donation), 0);
        totals[campaign.pId] = totalDonated; // Store the total donations for each campaign
      }
      setDonationTotals(totals);
    };

    if (campaigns.length > 0) {
      fetchDonationTotals();
    }
  }, [campaigns, getDonations]);

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns found
          </p>
        )}

        {!isLoading && campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <div key={campaign.pId} className="relative">
              <FundCard
                {...campaign}
                handleClick={() => handleNavigate(campaign)}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#f5f5f5] rounded-b-lg">
                <p className="font-epilogue font-semibold text-[14px] text-left">
                  Total Donated: {donationTotals[campaign.pId] ? donationTotals[campaign.pId].toFixed(2) : 0} ETH
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DisplayDonatedCampaigns;
