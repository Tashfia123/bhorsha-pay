import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CryptoDashboard = () => {
  const [newsData, setNewsData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("news"); // Tabs: "news" or "rates"
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNews();
    fetchCryptoRates();
  }, []);

  const fetchNews = async () => {
    try {
      setLoadingNews(true);
      const response = await axios.get("http://localhost:8080/api/v1/auth/crypto-news");
      if (response.data.success) setNewsData(response.data.data);
      else setError("Failed to fetch news");
    } catch (err) {
      setError("Error fetching news");
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchCryptoRates = async () => {
    try {
      setLoadingCrypto(true);
      const response = await axios.get("http://localhost:8080/api/v1/auth/crypto-rates");
      if (response.data.success) setCryptoData(response.data.data);
      else setError("Failed to fetch crypto rates");
    } catch (err) {
      setError("Error fetching crypto rates");
    } finally {
      setLoadingCrypto(false);
    }
  };

  // Filtering for search functionality
  const filteredNews = newsData.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCryptoData = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e2d] to-[#2a2d35] py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">Crypto Dashboard</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71cab3]"
            />
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "news" ? "bg-[#71cab3] text-white" : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setActiveTab("news")}
              >
                News
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "rates" ? "bg-[#71cab3] text-white" : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setActiveTab("rates")}
              >
                Crypto Rates
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 News Section */}
        {activeTab === "news" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loadingNews ? (
              <div className="text-white text-center">Loading News...</div>
            ) : (
              filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300"
                >
                  {article.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3">{article.body}</p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-[#71cab3] text-white px-4 py-2 rounded-lg hover:bg-[#238d6f] transition-colors duration-300"
                    >
                      Read More
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* 🔥 Crypto Rates Section */}
        {activeTab === "rates" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loadingCrypto ? (
              <div className="text-white text-center">Loading Crypto Rates...</div>
            ) : (
              filteredCryptoData.map((coin, index) => (
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
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Price</span>
                      <span className="text-white font-semibold">${coin.current_price}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Market Cap</span>
                      <span className="text-white font-semibold">${(coin.market_cap / 1e9).toFixed(2)}B</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CryptoDashboard;
