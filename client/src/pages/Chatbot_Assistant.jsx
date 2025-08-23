import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ChatBubbleOutline } from "@mui/icons-material";
import { Box, Typography, Fab } from "@mui/material";

const faqs = [
  {
    question: "What is Blockchain, and how does it work?",
    answer:
      "Blockchain is a decentralized, digital ledger that records transactions securely and transparently. It works by storing data in immutable blocks linked through cryptographic hashes, ensuring integrity and tamper resistance.",
  },
  {
    question: "What are the advantages of using Blockchain in fundraising?",
    answer:
      "Blockchain enables secure, transparent, and borderless transactions. It reduces intermediaries, cuts costs, and ensures real-time tracking of funds, building trust among investors and donors.",
  },
  {
    question: "How can Blockchain enhance trust in fundraising?",
    answer:
      "Blockchain provides transparency by allowing donors and investors to track how funds are used. Immutable records ensure that transactions cannot be altered, increasing accountability.",
  },
  {
    question: "Can Blockchain be used for charity fundraising? How?",
    answer:
      "Yes, Blockchain can be used for charity fundraising by providing transparency in donations, reducing transaction costs, and enabling global contributions. Smart contracts can automate fund allocation and ensure that funds reach the intended beneficiaries.",
  },
  {
    question:
      "What are Initial Coin Offerings (ICOs), and how are they used for fundraising?",
    answer:
      "ICOs are blockchain-based crowdfunding methods where startups or projects issue tokens to investors in exchange for cryptocurrency or fiat money. These tokens can represent ownership, utility, or future profits.",
  },
];

const Chatbot_Assistant = () => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [chatText, setChatText] = useState("Need help?");

  // Chat text animation loop
  useEffect(() => {
    const texts = ["Ask me anything!", "Need help?", "Chat with me!"];
    let index = 0;
    const interval = setInterval(() => {
      setChatText(texts[index]);
      index = (index + 1) % texts.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Embed Chatbase Chatbot
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "hpXRnHUypnv4SHnBylh1I"; // Your Chatbase bot ID
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  
    // Wait for Chatbase to load, then hide its default button
    setTimeout(() => {
      const chatbaseButton = document.querySelector("iframe[title='Chatbot']");
      if (chatbaseButton) chatbaseButton.style.display = "none";  // Hides default Chatbase button
    }, 2000);  // Give it 2 seconds to ensure it's loaded before hiding
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
   

  useEffect(() => {
    setFilteredFaqs(
      faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#1e1e2d] via-[#23233d] to-[#181a21] text-white"
          : "bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className={`text-4xl font-extrabold ${
            isDarkMode ? "text-[#9b73d3]" : "text-purple-600"
          }`}
        >
          Blockchain Info
        </h1>
        <p
          className={`text-lg mt-4 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Learn about Blockchain and its use in fundraising through FAQs or chat
          with our assistant!
        </p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-[#57eba3]" : "text-green-600"
          }`}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg cursor-pointer border transition-all duration-300 ease-in-out transform hover:scale-105 ${
                isDarkMode
                  ? `bg-[#2d2d3d] ${
                      activeIndex === index ? "border-[#57eba3]" : "border-[#3a3a4a]"
                    }`
                  : `bg-white ${
                      activeIndex === index ? "border-green-500" : "border-gray-200"
                    }`
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-semibold flex justify-between items-center">
                {faq.question}
                <button
                  className={`ml-2 p-1 rounded-full focus:outline-none ${
                    isDarkMode ? "text-[#57eba3] bg-[#1e1e2d]" : "text-green-600 bg-gray-100"
                  }`}
                >
                  {activeIndex === index ? "-" : "+"}
                </button>
              </h3>
              {activeIndex === index && (
                <p
                  className={`mt-4 pt-4 border-t ${
                    isDarkMode
                      ? "text-gray-300 border-[#3a3a4a]"
                      : "text-gray-600 border-gray-200"
                  }`}
                >
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chatbot Floating Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#57eba3", fontWeight: "bold", mb: 1, opacity: 0.8 }}
        >
          {chatText}
        </Typography>
      </Box>

      <Fab
  color="primary"
  sx={{
    position: "fixed",
    bottom: 16,
    right: 16,
    bgcolor: "#57eba3",
    color: "#fff",
    width: "70px",
    height: "70px",
    opacity: 0, // ⬅️ Makes it invisible
    pointerEvents: "none", // ⬅️ Prevents clicking
  }}
>
  <ChatBubbleOutline sx={{ fontSize: "40px" }} />
</Fab>
    </div>
  );
};

export default Chatbot_Assistant;
