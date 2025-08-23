import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonatedFundCard from '../components/DonatedFundCard';  // Import the new DonatedFundCard
import { loader } from '../assets';
import { useStateContext } from '../context';

const DonatedCampaignsPage = () => {
  const navigate = useNavigate();
  const { getDonatedCampaigns, getDonations } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [donationTotals, setDonationTotals] = useState({});

  useEffect(() => {
    const fetchDonatedCampaigns = async () => {
      try {
        const donatedCampaigns = await getDonatedCampaigns();
        setCampaigns(donatedCampaigns);

        const totals = {};
        for (const campaign of donatedCampaigns) {
          const donations = await getDonations(campaign.pId);
          const totalDonated = donations.reduce((acc, donation) => acc + parseFloat(donation.donation), 0);
          totals[campaign.pId] = totalDonated;
        }
        setDonationTotals(totals);
      } catch (error) {
        console.error("Error fetching donated campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonatedCampaigns();
  }, [getDonatedCampaigns, getDonations]);

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        Donated Campaigns ({campaigns.length})
      </h1>

      <div className="w-full max-w-[1200px] mx-auto flex flex-wrap mt-[20px] gap-[16px]">
  {isLoading && (
    <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
  )}

  {!isLoading && campaigns.length === 0 && (
    <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
      You have not donated to any campaigns yet.
    </p>
  )}

  {!isLoading &&
    campaigns.length > 0 &&
    campaigns.map((campaign) => (
      <DonatedFundCard
        key={campaign.pId}
        owner={campaign.owner}
        title={campaign.title}
        description={campaign.description}
        target={campaign.target}
        deadline={campaign.deadline}
        amountCollected={campaign.amountCollected}
        image={campaign.image}
        totalDonated={donationTotals[campaign.pId] || 0}
        handleClick={() => handleNavigate(campaign)}
      />
    ))}
</div>
    </div>
  );
};

export default DonatedCampaignsPage;


