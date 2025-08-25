import React, { useContext, createContext } from 'react';
import { prepareContractCall,defineChain } from "thirdweb"
import { useSendTransaction,useReadContract } from "thirdweb/react";

import { useAddress, useContract, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const ChainId=defineChain(11155111);
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {


    const { contract } = useContract("0x641aC3E371eA7b8847E5117D3a82b712D0FbA8c7");
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'create_campaign');

    const address = useAddress();
  const connect = () => window.ethereum.request({ method: 'eth_requestAccounts' });

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					ethers.utils.parseEther(form.target.toString()),
					Math.floor(new Date(form.deadline).getTime() / 1000), // deadline in seconds
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }
  const donate = async (pId, amount) => {
    const data = await contract.call('donate_to_campaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }
  const getCampaignsByQuery = async (query) => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }
  
    try {
      // Fetch all campaigns using getAllCampaigns
      const allCampaigns = await getAllCampaigns(contract);
  
      // Trim the query and split into words for partial matching
      const queryWords = query.trim().toLowerCase().split(/\s+/);
  
      // Filter campaigns based on matching the query words in the title
      const filteredCampaigns = allCampaigns.filter((campaign) => {
        const titleWords = campaign.title.toLowerCase().split(/\s+/);
        
        // Check if all query words appear in the campaign title
        return queryWords.every(queryWord => titleWords.includes(queryWord));
      });
  
      return filteredCampaigns;
    } catch (err) {
      console.error("Error in getCampaignsByQuery function:", err);
      return [];
    }
  };
  const getTotalDonations = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }
  
    try {
      const allCampaigns = await getAllCampaigns(contract);
  
      let totalDonations = 0;
  
      for (const campaign of allCampaigns) {
        const donations = await getDonations(campaign.pId);
  
        for (const donation of donations) {
          totalDonations += parseFloat(donation.donation);
        }
      }
  
      return totalDonations.toFixed(2);
    } catch (err) {
      console.error("Error in getTotalDonations:", err);
      return 0;
    }
  };
  
  const getTotalMonthlyDonations = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }
  
    try {
      const allCampaigns = await getAllCampaigns(contract);
  
      let totalDonations = 0;
  
      for (const campaign of allCampaigns) {
        const donations = await getDonations(campaign.pId);
  
        for (const donation of donations) {
          totalDonations += parseFloat(donation.donation);
        }
      }
  
      return totalDonations.toFixed(2);
    } catch (err) {
      console.error("Error in getTotalDonations:", err);
      return 0;
    }
  };
 
  const getTotalCampaigns = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }
  
    try {
      // Use getAllCampaigns to fetch all campaigns
      const allCampaigns = await getAllCampaigns(contract);
      
      // Return the count of campaigns
      return allCampaigns.length;
    } catch (err) {
      console.error("Error in getTotalCampaigns:", err);
      return 0;
    }
  };
  const getTopCampaign = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return null;
    }
  
    try {
      const allCampaigns = await getAllCampaigns(contract);
      const topCampaign = allCampaigns.reduce((max, campaign) =>
        parseFloat(campaign.amountCollected) > parseFloat(max.amountCollected) ? campaign : max
      );
      return topCampaign;
    } catch (err) {
      console.error("Error in getTopCampaign:", err);
      return null;
    }
  };
  const getRecentDonations = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }
  
    try {
      const allCampaigns = await getAllCampaigns(contract);
      const recentDonations = [];
  
      for (const campaign of allCampaigns) {
        const donations = await getDonations(campaign.pId);
        donations.forEach((donation, index) => {
          recentDonations.push({
            campaignTitle: campaign.title,
            donor: donation.donator,
            amount: parseFloat(donation.donation),
          });
        });
      }
  
      // Sort by amount or add timestamp for sorting if available
      recentDonations.sort((a, b) => b.amount - a.amount);
      return recentDonations.slice(0, 5); // Show top 5 recent donations
    } catch (err) {
      console.error("Error in getRecentDonations:", err);
      return [];
    }
  };

  const getTopDonors = async () => {
    if (!contract) {
      console.error("Contract is not available.");
      return [];
    }
  
    try {
      const allCampaigns = await getAllCampaigns(contract);
      console.log("🔍 getTopDonors: Found", allCampaigns.length, "campaigns");
      
      const donorMap = new Map(); // Map to aggregate donations by donor
  
      // Collect all donations from all campaigns
      for (const campaign of allCampaigns) {
        const donations = await getDonations(campaign.pId);
        console.log(`🔍 Campaign "${campaign.title}" has ${donations.length} donations:`, donations);
        
        donations.forEach((donation) => {
          const donorAddress = donation.donator.toLowerCase();
          const amount = parseFloat(donation.donation);
          
          if (donorMap.has(donorAddress)) {
            const existing = donorMap.get(donorAddress);
            existing.total += amount;
            existing.campaigns.add(campaign.title); // Track unique campaigns
          } else {
            donorMap.set(donorAddress, {
              donor: donation.donator, // Keep original case for display
              total: amount,
              campaigns: new Set([campaign.title])
            });
          }
        });
      }
  
      // Convert to array and sort by total donations
      const topDonors = Array.from(donorMap.values()).map(donor => ({
        donor: donor.donor,
        total: donor.total,
        campaigns: donor.campaigns.size
      }));
  
      console.log("🔍 getTopDonors: Found", topDonors.length, "unique donors:", topDonors);
      
      // Sort by total donations (highest first) and return top 10
      topDonors.sort((a, b) => b.total - a.total);
      return topDonors.slice(0, 10);
    } catch (err) {
      console.error("Error in getTopDonors:", err);
      return [];
    }
  };
 // Define the getCampaigns function
 const getDonations = async (pId) => {
  const donations = await contract.call('get_donators', [pId]);
  const numberOfDonations = donations[0].length;

  const parsedDonations = [];

  for(let i = 0; i < numberOfDonations; i++) {
    parsedDonations.push({
      donator: donations[0][i],
      donation: ethers.utils.formatEther(donations[1][i].toString())
    })
  }

  return parsedDonations;
}
const getDonatedCampaigns = async () => {
  try {
    // Fetch all campaigns using getCampaigns
    const allCampaigns = await getAllCampaigns(contract);

    // Initialize an array to store donated campaigns
    const donatedCampaigns = [];

    // Loop through all campaigns and check donations
    for (let i = 0; i < allCampaigns.length; i++) {
      const donations = await getDonations(i); // Get donations for the campaign

      // Check if the current wallet address is a donator
      const hasDonated = donations.some((donation) => donation.donator.toLowerCase() === address.toLowerCase());

      if (hasDonated) {
        donatedCampaigns.push(allCampaigns[i]); // Add to donated campaigns
      }
    }

    return donatedCampaigns;
  } catch (err) {
    console.error("Error in getDonatedCampaigns function:", err);
    return [];
  }
};

const getCampaigns = async (contract) => {
  if (!contract) {
    console.error("Contract is not available.");
    return [];
  }

  try {
    const currentTime = new Date().getTime(); // Get the current timestamp

    // Fetch all campaigns
    const campaigns = await contract.call("getCampaigns");

    // Filter campaigns where the deadline has not passed
    const validCampaigns = campaigns?.filter((campaign) => {
      return campaign.deadline.toNumber() > currentTime; // Only include campaigns with a future deadline
    });

    // Parse the filtered valid campaigns
    const parsedCampaigns = validCampaigns?.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber() * 1000, // Convert seconds to milliseconds
      amountCollected: ethers.utils.formatEther(campaign.collected_amount.toString()),
      image: campaign.image,
      pId: i,
    })) || [];

    return parsedCampaigns;

  } catch (err) {
    console.error("Error in getCampaigns function:", err);
    return [];
  }
};
const getAllCampaigns = async (contract) => {
  if (!contract) {
    console.error("Contract is not available.");
    return [];
  }

  try {
    // Fetch all campaigns without filtering by deadline
    const campaigns = await contract.call("getCampaigns");

    // Parse the campaigns data
    const parsedCampaigns = campaigns?.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber() * 1000, // Convert seconds to milliseconds
      amountCollected: ethers.utils.formatEther(campaign.collected_amount.toString()),
      image: campaign.image,
      pId: i,
    })) || [];

    return parsedCampaigns;

  } catch (err) {
    console.error("Error in getAllCampaigns function:", err);
    return [];
  }
};
// Define the getUserCampaigns function
const getUserCampaigns = async () => {
  try {
    // Fetch all campaigns using getAllCampaigns (not getCampaigns)
    const allCampaigns = await getAllCampaigns(contract);

    // Filter campaigns where the owner matches the current user's address
    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner.toLowerCase() === address.toLowerCase());

    return filteredCampaigns;
  } catch (err) {
    console.error("Error in getUserCampaigns function:", err);
    return [];
  }
};

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns: () => getCampaigns(contract),
        getUserCampaigns,
        getAllCampaigns,
        getDonations,
        getCampaignsByQuery,
        getDonatedCampaigns,
        getTotalMonthlyDonations,
        donate,
        getTotalDonations,       // Retrieves the total donations
        getTotalCampaigns,       // Retrieves the total campaigns count
        getTopCampaign,          // Retrieves the campaign with the highest donations
        getRecentDonations,      // Retrieves the most recent donations
        getTopDonors             // Retrieves the top donors by total donations
        
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
export const useStateContext = () => useContext(StateContext);


