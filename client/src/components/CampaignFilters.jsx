import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CampaignFilters = ({ 
  sortOption,
  setSortOption
}) => {
  const { isDarkMode } = useTheme();
  
  // Available sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'endingSoon', label: 'Ending Soon' },
    { value: 'mostFunded', label: 'Most Funded' },
    { value: 'leastFunded', label: 'Least Funded' },
    { value: 'percentFunded', label: 'Highest % Funded' }
  ];
  
  return (
    <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-white border border-gray-200'}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Sort Campaigns
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={`w-full p-2 rounded-md ${
              isDarkMode 
                ? 'bg-[#2c2f32] text-white border-[#3a3a43]' 
                : 'bg-gray-50 text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-1 focus:ring-purple-500`}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CampaignFilters; 