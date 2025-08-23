import React from 'react';
import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';

const DonatedFundCard = ({ owner, title, description, target, deadline, amountCollected, image, totalDonated, handleClick }) => {
  const remainingDays = daysLeft(deadline);
  const descriptionLimit = 100; // Limit description to 100 characters
  const descriptionText = description.length > descriptionLimit ? description.slice(0, descriptionLimit) + '...' : description;

  const donationPercentage = (amountCollected / target) * 100;

  return (
    <div
      className="sm:w-[300px] w-full rounded-[20px] bg-gradient-to-r from-[#1e1e2f] via-[#2c2c3e] to-[#3f3f57] cursor-pointer transition-all transform hover:scale-105 duration-300 ease-in-out hover:shadow-lg"
      onClick={handleClick}
      style={{ margin: '0 16px 24px' }} // Added margin for consistent spacing
    >
      <div className="relative group">
        <img
          src={image}
          alt="fund"
          className="w-full h-[200px] object-cover rounded-t-[20px] transition-all transform group-hover:scale-110 group-hover:rotate-2 duration-500 ease-in-out"
        />
        <div className="absolute top-4 right-4 bg-[#1c1c24] text-white text-[12px] py-1 px-3 rounded-full font-semibold uppercase">
          Donated
        </div>
      </div>

      <div className="flex flex-col p-6">
        <div className="flex flex-row items-center mb-[10px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">Education</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[18px] text-white text-left leading-[26px] truncate">{title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{descriptionText}</p>
        </div>

        <div className="flex flex-col mt-[20px]">
          <div className="flex justify-between items-center">
            <p className="font-epilogue text-white text-[14px]">Total Donated</p>
            <p className="font-epilogue text-[#b2b3bd] text-[14px]">{totalDonated}</p>
          </div>

          <div className="relative mt-[10px] bg-[#262626] h-[8px] rounded-[10px] overflow-hidden">
            <div
              className="bg-[#ff7043] h-full rounded-[10px] transition-all"
              style={{
                width: `${donationPercentage}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mt-[20px] p-4 rounded-lg bg-gradient-to-r from-[#ff6347] via-[#ff4500] to-[#ff7f50] text-white font-semibold text-[18px] shadow-lg transition-transform transform hover:scale-110 duration-300 ease-in-out">
          <p>Total Donated: {totalDonated}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{owner}</span></p>
        </div>
      </div>
    </div>
  );
};

export default DonatedFundCard;








