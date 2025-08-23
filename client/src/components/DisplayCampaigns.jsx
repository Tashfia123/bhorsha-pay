import React from 'react'
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { useTheme } from '../context/ThemeContext';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const handleNavigate = (campaign) => {
        navigate(`/campaign-details/${campaign.title}`, { state: campaign })
      }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {title} 
          <span className={`ml-2 text-sm font-medium py-1 px-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            {campaigns.length}
          </span>
        </h2>
      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <div className="w-full flex justify-center items-center py-10">
            <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
          </div>
        )}

        {!isLoading && campaigns.length === 0 && (
          <div className={`w-full text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto mb-4 opacity-50" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
              />
            </svg>
            <p className="text-lg font-medium mb-2">No campaigns found</p>
            <p>Be the first to create a fundraising campaign!</p>
          </div>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <FundCard 
          key={campaign.id}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns
