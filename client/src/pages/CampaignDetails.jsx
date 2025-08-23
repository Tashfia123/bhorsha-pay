import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { FaUsers, FaClock, FaEthereum, FaUserCircle } from 'react-icons/fa';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader, SocialShare, ProgressBar } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';
import { useTheme } from '../context/ThemeContext';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();
  const { isDarkMode } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);
    await donate(state.pId, amount); 
    navigate('/')
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c1c24] to-[#2c2f32]">
      {isLoading && <Loader />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img 
              src={state.image} 
              alt="campaign" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className={`text-5xl font-bold mb-4 text-white`}>
                {state.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FaClock className="text-white/80" />
                  <span className="text-white/80">{remainingDays} days left</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-white/80" />
                  <span className="text-white/80">{donators.length} backers</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEthereum className="text-white/80" />
                  <span className="text-white/80">{state.amountCollected} ETH raised</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Campaign Progress</h2>
              <ProgressBar current={parseFloat(state.amountCollected)} target={parseFloat(state.target)} />
              <div className="mt-4 flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {state.amountCollected} ETH raised
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Goal: {state.target} ETH
                </span>
              </div>
            </motion.div>

            {/* Story Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>About This Campaign</h2>
              <p className={`text-lg leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>{state.description}</p>
            </motion.div>

            {/* Donators Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Donators</h2>
              <div className="space-y-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <motion.div 
                    key={`${item.donator}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaUserCircle className={`text-2xl ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div>
                        <p className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.donator.slice(0, 6)}...{item.donator.slice(-4)}
                        </p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Donator #{index + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEthereum className="text-purple-400" />
                      <span className={`font-medium ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {item.donation} ETH
                      </span>
                    </div>
                  </motion.div>
                )) : (
                  <div className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <FaUsers className="text-4xl mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No donators yet. Be the first one!</p>
                    <p className="text-sm mt-2">Your donation can make a difference</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            {/* Creator Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Campaign Creator</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                  <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {state.owner.slice(0, 6)}...{state.owner.slice(-4)}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    10 Campaigns Created
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-[#1c1c24]' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Donate to Campaign</h2>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Amount (ETH)
                  </label>
                  <input 
                    type="number"
                    placeholder="0.1"
                    step="0.01"
                    className={`w-full py-3 px-4 rounded-lg ${
                      isDarkMode 
                        ? 'bg-[#2c2f32] border-[#3a3a43] text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-[#2c2f32]' : 'bg-gray-50'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Why Donate?
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your donation helps bring this project to life. Every contribution makes a difference.
                  </p>
                </div>

                <CustomButton 
                  btnType="button"
                  title="Donate Now"
                  styles="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 py-3 text-lg"
                  handleClick={handleDonate}
                />

                <div className="mt-4">
                  <SocialShare 
                    title={`Support this campaign: ${state.title}`} 
                    description={state.description}
                    url={window.location.href}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
