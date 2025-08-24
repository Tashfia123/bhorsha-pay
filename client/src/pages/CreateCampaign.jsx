import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { money } from "../assets";
import { CustomButton, FormField } from "../components";
import { checkIfImage } from "../utils";
import { useStateContext } from "../context";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide a valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#1e1e2d] via-[#23233d] to-[#181a21] flex justify-center items-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1c1c24] w-full max-w-4xl flex flex-col rounded-lg sm:p-10 p-6 shadow-lg relative overflow-hidden"
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#1c1c24]/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#57eba3] animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-[#57eba3] animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-3 h-3 rounded-full bg-[#57eba3] animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          className="flex justify-center items-center py-4 bg-[#3a3a43] rounded-lg mb-8 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h1 className="font-epilogue font-bold text-2xl sm:text-3xl text-white">
            Start a Campaign
          </h1>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <AnimatePresence>
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FormField
                labelName="Your Name *"
                placeholder="John Doe"
                inputType="text"
                value={form.name}
                handleChange={(e) => handleFormFieldChange("name", e)}
              />
              <FormField
                labelName="Campaign Title *"
                placeholder="Write a title"
                inputType="text"
                value={form.title}
                handleChange={(e) => handleFormFieldChange("title", e)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FormField
                labelName="Story *"
                placeholder="Write your story"
                isTextArea
                value={form.description}
                handleChange={(e) => handleFormFieldChange("description", e)}
              />
            </motion.div>

            <motion.div
              className="w-full flex items-center p-6 bg-gradient-to-r from-[#8c6dfd] to-[#57eba3] rounded-lg text-white relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={money}
                alt="money"
                className="w-10 h-10 object-contain relative z-10"
              />
              <h4 className="font-epilogue font-bold text-lg ml-4 relative z-10">
                You will get 100% of the raised amount
              </h4>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FormField
                labelName="Goal *"
                placeholder="ETH 0.50"
                inputType="text"
                value={form.target}
                handleChange={(e) => handleFormFieldChange("target", e)}
              />
              <FormField
                labelName="End Date *"
                placeholder="End Date"
                inputType="date"
                value={form.deadline}
                handleChange={(e) => handleFormFieldChange("deadline", e)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FormField
                labelName="Campaign Image *"
                placeholder="Place image URL of your campaign"
                inputType="url"
                value={form.image}
                handleChange={(e) => handleFormFieldChange("image", e)}
              />
            </motion.div>

            <motion.div
              className="flex justify-center items-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CustomButton
                btnType="submit"
                title="Submit New Campaign"
                styles="bg-gradient-to-r from-[#1dc071] to-[#57eba3] py-3 px-6 rounded-lg font-medium text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              />
            </motion.div>
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCampaign;
