import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CryptoRates = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCryptoRates();
  }, []);

  const fetchCryptoRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/v1/auth/crypto-rates');
      if (response.data.success) {
        setCryptoData(response.data.data);
      } else {
        setError('Failed to fetch crypto rates');
      }
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
      setError(error.response?.data?.message || 'Error fetching crypto rates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCryptoData = cryptoData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e1e2d] to-[#2a2d35]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#71cab3]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1e1e2d] to-[#2a2d35]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-[#71cab3] text-white px-6 py-3 rounded-lg hover:bg-[#238d6f] transition-colors duration-300"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e2d] to-[#2a2d35] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
            Cryptocurrency Rates
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71cab3]"
            />
            <button
              onClick={() => navigate('/')}
              className="bg-[#71cab3] text-white px-6 py-2 rounded-lg hover:bg-[#238d6f] transition-colors duration-300"
            >
              Go Back Home
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCryptoData.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-white">{coin.name}</h2>
                  <p className="text-gray-400">{coin.symbol}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white font-semibold">
                    ${coin.current_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white font-semibold">
                    ${(coin.market_cap / 1000000000).toFixed(2)}B
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">24h Change</span>
                  <span className={`font-semibold ${coin.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.price_change_24h?.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-400">
                    {new Date(coin.last_updated).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoRates; 