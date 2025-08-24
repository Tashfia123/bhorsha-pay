import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

const Homepage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,107,0.1),transparent_50%)]"></div>
        <motion.div
          className="absolute w-[500px] h-[500px] bg-[#00A86B] rounded-full blur-[128px] opacity-20"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        />
        {/* Additional animated background elements */}
        <motion.div
          className="absolute w-[300px] h-[300px] bg-[#4acd8d] rounded-full blur-[100px] opacity-10"
          animate={{
            x: mousePosition.x - 150,
            y: mousePosition.y - 150,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 80,
            delay: 0.2,
          }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] bg-[#8c6dfd] rounded-full blur-[80px] opacity-10"
          animate={{
            x: mousePosition.x - 100,
            y: mousePosition.y - 100,
          }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 60,
            delay: 0.4,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
            className="mb-6 relative"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00A86B]">
              Bhorsha-Pay
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white mb-8"
          >
            Revolutionizing Fundraising with Blockchain Technology
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white">
                Bangladesh Deserves Trust
              </h3>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-0.5 bg-[#00A86B]"></div>
                <span className="text-lg font-semibold text-[#00A86B]">
                  We Deliver It
                </span>
                <div className="w-8 h-0.5 bg-[#00A86B]"></div>
              </div>
            </div>
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Crypto Resources */}
            <div className="w-full max-w-3xl">
              <motion.h3
                whileHover={{ scale: 1.05 }}
                className="text-xl font-semibold text-[#00A86B] mb-6 text-center bg-white/5 py-3 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg"
              >
                Crypto Resources
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/crypto-rates"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span className="relative z-10 text-white font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Crypto Rates
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/crypto-news"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span className="relative z-10 text-white font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">📰</span>
                    Crypto News
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#008F5B] to-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <video
              autoPlay
              loop
              muted
              className="relative rounded-lg w-full aspect-video object-cover shadow-2xl"
            >
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A86B] to-[#008F5B] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <video
              autoPlay
              loop
              muted
              className="relative rounded-lg w-full aspect-video object-cover shadow-2xl"
            >
              <source src={video2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative w-full bg-white/5 backdrop-blur-sm py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="p-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-[#00A86B] text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                🔒
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Secure Transactions
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Every donation is secured by blockchain technology
              </p>
            </motion.div>
            <motion.div
              className="p-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-[#00A86B] text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Community Driven
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Join a global community of funders and creators
              </p>
            </motion.div>
            <motion.div
              className="p-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group hover:bg-white/10 transition-colors duration-300 shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-[#00A86B] text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                💎
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Transparent
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Track every transaction on the blockchain
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative w-full py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#4acd8d] mb-4">
                $10M+
              </div>
              <div className="text-gray-400 text-lg">Total Funds Raised</div>
            </motion.div>
            <motion.div
              className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#4acd8d] mb-4">
                500+
              </div>
              <div className="text-gray-400 text-lg">Active Campaigns</div>
            </motion.div>
            <motion.div
              className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#4acd8d] mb-4">
                50K+
              </div>
              <div className="text-gray-400 text-lg">Community Members</div>
            </motion.div>
            <motion.div
              className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#4acd8d] mb-4">
                99.9%
              </div>
              <div className="text-gray-400 text-lg">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Etherscan Button Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative w-full py-16"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Blockchain Transparency
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              View all transactions and verify smart contract activity on the
              Ethereum blockchain
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("https://etherscan.io/", "_blank")}
              className="bg-gradient-to-r from-[#00A86B] to-[#4acd8d] text-white font-semibold py-4 px-8 rounded-xl hover:from-[#009a5f] hover:to-[#3dbd7d] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 mx-auto text-lg"
            >
              <span>🔍</span>
              <span>Open Etherscan</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative w-full py-8 text-center text-gray-400 text-sm border-t border-white/10">
        <p>© 2025 Bhorsha Pay. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
